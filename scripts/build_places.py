#!/usr/bin/env python3
"""
Build the location-search data (ZIP code, city/town, county) the site's <LocationSearch /> uses.
Everything is matched in the visitor's browser; these are plain static files on our own domain.

Sources (all U.S. Census Bureau, public domain):
  - 2020 ZCTA-to-county relationship file
    https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt
  - 2024 Gazetteer, counties
    https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_counties_national.zip
  - 2024 Gazetteer, places (incorporated places + census-designated places)
    https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_place_national.zip
  - 2020 place-by-county file (which counties each place lies in; used for California only)
    https://www2.census.gov/geo/docs/reference/codes2020/national_place_by_county2020.txt

ZCTAs are the Census's approximation of USPS ZIP codes; a few PO-box-only ZIPs have no ZCTA.

Output (site/public/geo/):
  zip-0.json … zip-9.json   {"94110": "ca/san-francisco", "10001": "ny", "96161": "ca/nevada ca/placer"}
                            A value is space-separated destinations, largest land area first. Outside
                            California only the state is kept; in California the county slug is added.
  counties.json             [["Shasta County", "ca/shasta"], ["Oakland County", "mi"], …]
  places-a.json … places-z.json
                            [["Oakland", "ca/alameda"], ["Springfield", "il"], …] largest land area first.

Run:  .venv/bin/python scripts/build_places.py      (downloads to research/raw/places/ if missing)
"""
import csv
import io
import json
import re
import unicodedata
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "research" / "raw" / "places"
OUT = ROOT / "site" / "public" / "geo"
SITE_DATA = ROOT / "site" / "src" / "data"

URLS = {
    "zcta": "https://www2.census.gov/geo/docs/maps-data/data/rel2020/zcta520/tab20_zcta520_county20_natl.txt",
    "counties": "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_counties_national.zip",
    "places": "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2024_Gazetteer/2024_Gaz_place_national.zip",
    "place_county": "https://www2.census.gov/geo/docs/reference/codes2020/national_place_by_county2020.txt",
}

# Place-name endings that describe the kind of place, not its name ("Oakland city" -> "Oakland").
PLACE_SUFFIX = re.compile(
    r"\s+(?:city and borough|consolidated government|unified government|metropolitan government|metro government"
    r"|urban county|metro township|municipality|corporation|comunidad|zona urbana|city|town|village|borough|CDP)$"
)
COUNTY_SUFFIX = re.compile(r"\s+(?:County|Parish|Borough|Census Area|City and Borough|Municipality|city)$")


def fetch(key: str) -> Path:
    path = RAW / URLS[key].rsplit("/", 1)[1]
    if not path.exists():
        RAW.mkdir(parents=True, exist_ok=True)
        print("downloading", URLS[key])
        urllib.request.urlretrieve(URLS[key], path)
    return path


def read_text(path: Path) -> str:
    if path.suffix == ".zip":
        with zipfile.ZipFile(path) as z:
            return z.read(z.namelist()[0]).decode("utf-8-sig")
    return path.read_text(encoding="utf-8-sig")


def rows(path: Path, delim: str):
    text = read_text(path)
    reader = csv.DictReader(io.StringIO(text), delimiter=delim)
    for r in reader:
        yield {k.strip(): (v or "").strip() for k, v in r.items() if k}


def first_letter(name: str) -> str:
    s = unicodedata.normalize("NFD", name).encode("ascii", "ignore").decode().lower()
    s = re.sub(r"[^a-z]", "", s)
    return s[:1]


def main() -> None:
    states = json.loads((SITE_DATA / "states.json").read_text())
    abbr_to_slug = {s["abbr"].upper(): s["slug"] for s in states}
    ca_slugs = {c["county"].lower(): c["slug"] for c in json.loads((SITE_DATA / "ca-counties.json").read_text())}

    # --- counties (Gazetteer): FIPS -> destination + display name
    county_dest: dict[str, str] = {}
    county_list = []
    for r in rows(fetch("counties"), "\t"):
        st = abbr_to_slug.get(r["USPS"])
        if not st:
            continue  # Puerto Rico etc. aren't covered by the site
        dest = st
        if st == "ca":
            base = COUNTY_SUFFIX.sub("", r["NAME"]).lower()
            if base not in ca_slugs:
                raise SystemExit(f"California county without a page: {r['NAME']}")
            dest = f"ca/{ca_slugs[base]}"
        county_dest[r["GEOID"]] = dest
        county_list.append([r["NAME"], dest])
    county_list.sort(key=lambda x: x[0])

    # --- ZIPs (ZCTA -> counties), largest land area first, water-only parts dropped
    parts = defaultdict(list)
    for r in rows(fetch("zcta"), "|"):
        z, c = r["GEOID_ZCTA5_20"], r["GEOID_COUNTY_20"]
        if not z or c not in county_dest or int(r["AREALAND_PART"] or 0) <= 0:
            continue
        parts[z].append((int(r["AREALAND_PART"]), county_dest[c]))
    zips: dict[str, dict[str, str]] = defaultdict(dict)
    for z, ps in parts.items():
        dests = []
        for _, d in sorted(ps, reverse=True):
            if d not in dests:
                dests.append(d)
        zips[z[0]][z] = " ".join(dests)

    # --- places: which CA counties each place is in (2020 codes)
    place_counties = defaultdict(list)
    ca_county_by_name = {k: f"ca/{v}" for k, v in ca_slugs.items()}
    for r in rows(fetch("place_county"), "|"):
        if r["STATE"] != "CA":
            continue
        base = COUNTY_SUFFIX.sub("", r["COUNTYNAME"]).lower()
        d = ca_county_by_name.get(base)
        if d and d not in place_counties[r["STATEFP"] + r["PLACEFP"]]:
            place_counties[r["STATEFP"] + r["PLACEFP"]].append(d)

    places = defaultdict(list)  # letter -> [(area, name, dest)]
    missing_ca = 0
    for r in rows(fetch("places"), "\t"):
        st = abbr_to_slug.get(r["USPS"])
        if not st:
            continue
        name = r["NAME"].replace(" (balance)", "")
        name = PLACE_SUFFIX.sub("", name).strip()
        area = int(r["ALAND"] or 0)
        if st == "ca":
            dests = place_counties.get(r["GEOID"]) or []
            if not dests:
                missing_ca += 1
                dests = ["ca"]
        else:
            dests = [st]
        names = [name]
        # Consolidated city-counties: "Nashville-Davidson", "Louisville/Jefferson County" -> also "Nashville", "Louisville"
        if r["LSAD"] in ("00", "UG", "MG", "CG", "UC") and re.search(r"[-/]", name):
            names.append(re.split(r"[-/,]", name)[0].strip())
        for n in names:
            letter = first_letter(n)
            if letter:
                places[letter].append((area, n, " ".join(dests)))

    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.json"):
        old.unlink()

    def write(name: str, data) -> None:
        (OUT / name).write_text(json.dumps(data, separators=(",", ":"), ensure_ascii=False))

    for d, m in sorted(zips.items()):
        write(f"zip-{d}.json", dict(sorted(m.items())))
    write("counties.json", county_list)
    total = 0
    for letter, items in sorted(places.items()):
        seen = set()
        out = []
        for _, n, d in sorted(items, key=lambda x: -x[0]):
            if (n, d) in seen:
                continue
            seen.add((n, d))
            out.append([n, d])
        total += len(out)
        write(f"places-{letter}.json", out)
    print(f"{sum(len(m) for m in zips.values())} ZIPs, {len(county_list)} counties, {total} places "
          f"({missing_ca} California places without a county) -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
