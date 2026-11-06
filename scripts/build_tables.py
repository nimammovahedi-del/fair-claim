#!/usr/bin/env python3
"""
Merge the research JSON files into:
  - site/src/data/states.json, ca-counties.json, ca-statewide.json   (what the website reads)
  - output/review/fair-claim-review.xlsx                              (for Nima to review)
  - output/review/states.csv, ca-counties.csv                         (same data, plain CSV)

Run:  .venv/bin/python scripts/build_tables.py
Unverified fields are highlighted yellow in the spreadsheet.
"""
import csv
import glob
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RESEARCH = ROOT / "research"
SITE_DATA = ROOT / "site" / "src" / "data"
REVIEW = ROOT / "output" / "review"

STATE_FIELDS = [
    "state", "abbr", "court_name", "limit_individual", "limit_business", "limit_notes", "recent_changes",
    "filing_fee_min", "filing_fee_max", "filing_fee_notes", "who_can_sue", "lawyers_allowed", "lawyers_notes",
    "appeal", "appeal_who", "appeal_deadline_days", "e_filing", "e_filing_notes", "fee_waiver_form",
    "fee_waiver_threshold", "service_methods", "self_help_url", "citation", "sources", "date_checked",
    "unverified", "notes",
]
COUNTY_FIELDS = [
    "county", "court_name", "small_claims_page_url", "small_claims_locations", "self_help_center",
    "small_claims_advisor", "e_filing", "e_filing_notes", "remote_hearings", "local_notes", "sources",
    "date_checked", "unverified", "notes",
]

# Field-name aliases a researcher might have used, mapped back to the schema.
ALIASES = {"limit_notes_text": "limit_notes", "self_help": "self_help_url"}


def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def load_array(pattern: str):
    rows = []
    for f in sorted(glob.glob(str(pattern))):
        try:
            data = json.loads(Path(f).read_text())
        except json.JSONDecodeError as e:
            print(f"!! {f}: invalid JSON ({e})", file=sys.stderr)
            continue
        if isinstance(data, dict):
            data = data.get("rows") or data.get("states") or data.get("counties") or [data]
        for r in data:
            r["_file"] = Path(f).name
            rows.append(r)
    return rows


def to_number(v):
    if v is None or isinstance(v, (int, float)):
        return v
    s = re.sub(r"[^0-9.]", "", str(v))
    try:
        return float(s) if "." in s else int(s)
    except ValueError:
        return None


def normalize_state(r):
    for k, v in ALIASES.items():
        if k in r and v not in r:
            r[v] = r.pop(k)
    out = {f: r.get(f) for f in STATE_FIELDS}
    for f in ("limit_individual", "limit_business", "filing_fee_min", "filing_fee_max", "appeal_deadline_days"):
        out[f] = to_number(out[f])
    out["sources"] = [s if isinstance(s, dict) else {"url": str(s)} for s in (out["sources"] or [])]
    out["unverified"] = list(out["unverified"] or [])
    out["slug"] = (out["abbr"] or slugify(out["state"])).lower()
    return out


def normalize_county(r):
    out = {f: r.get(f) for f in COUNTY_FIELDS}
    out["small_claims_locations"] = out["small_claims_locations"] or []
    out["sources"] = [s if isinstance(s, dict) else {"url": str(s)} for s in (out["sources"] or [])]
    out["unverified"] = list(out["unverified"] or [])
    out["county"] = re.sub(r"\s+County$", "", out["county"] or "").strip()
    out["slug"] = slugify(out["county"])
    return out


def flat(v):
    """Turn nested values into readable spreadsheet text."""
    if v is None:
        return ""
    if isinstance(v, bool):
        return "yes" if v else "no"
    if isinstance(v, (int, float, str)):
        return v
    if isinstance(v, list):
        parts = []
        for x in v:
            if isinstance(x, dict):
                if "url" in x:
                    parts.append(f"{x.get('url')}  [{x.get('type', '')}] {x.get('what', '')}".strip())
                else:
                    parts.append(" · ".join(str(val) for val in x.values() if val not in (None, "")))
            else:
                parts.append(str(x))
        return "\n".join(parts)
    if isinstance(v, dict):
        return "\n".join(f"{k}: {flat(val)}" for k, val in v.items() if val not in (None, ""))
    return str(v)


def write_csv(path, rows, fields):
    with open(path, "w", newline="") as fh:
        w = csv.writer(fh)
        w.writerow(fields)
        for r in rows:
            w.writerow([flat(r.get(f)) for f in fields])


def add_sheet(wb, title, rows, fields, key_field, widths):
    from openpyxl.styles import Alignment, Font, PatternFill

    ws = wb.create_sheet(title)
    yellow = PatternFill("solid", fgColor="FFF2B3")
    head = PatternFill("solid", fgColor="1F2933")
    ws.append(fields)
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF")
        c.fill = head
        c.alignment = Alignment(wrap_text=True, vertical="top")
    for r in rows:
        ws.append([flat(r.get(f)) for f in fields])
        row_idx = ws.max_row
        unv = set(r.get("unverified") or [])
        for col, f in enumerate(fields, start=1):
            cell = ws.cell(row=row_idx, column=col)
            cell.alignment = Alignment(wrap_text=True, vertical="top")
            # Highlight a field if it (or a sub-field like "small_claims_advisor.phone") is unverified.
            if f in unv or any(u.startswith(f + ".") for u in unv):
                cell.fill = yellow
    for col, f in enumerate(fields, start=1):
        letter = ws.cell(row=1, column=col).column_letter
        ws.column_dimensions[letter].width = widths.get(f, 28)
    ws.freeze_panes = ws.cell(row=2, column=2)
    ws.auto_filter.ref = ws.dimensions
    return ws


def main():
    SITE_DATA.mkdir(parents=True, exist_ok=True)
    REVIEW.mkdir(parents=True, exist_ok=True)

    states = [normalize_state(r) for r in load_array(RESEARCH / "states" / "group*.json")]
    states.sort(key=lambda r: r["state"])
    counties = [normalize_county(r) for r in load_array(RESEARCH / "california" / "counties-*.json")]
    counties.sort(key=lambda r: r["county"])
    ca_path = RESEARCH / "california" / "statewide.json"
    ca = json.loads(ca_path.read_text()) if ca_path.exists() else {}

    (SITE_DATA / "states.json").write_text(json.dumps(states, indent=1))
    (SITE_DATA / "ca-counties.json").write_text(json.dumps(counties, indent=1))
    (SITE_DATA / "ca-statewide.json").write_text(json.dumps(ca, indent=1))

    write_csv(REVIEW / "states.csv", states, STATE_FIELDS)
    write_csv(REVIEW / "ca-counties.csv", counties, COUNTY_FIELDS)

    try:
        from openpyxl import Workbook
        from openpyxl.styles import Alignment, Font
    except ImportError:
        print("openpyxl not installed; wrote CSVs only")
        return

    wb = Workbook()
    readme = wb.active
    readme.title = "Read me"
    lines = [
        ("Fair Claim — Phase 0 research tables", True),
        ("Checked 2026-11-05 unless a row says otherwise. Legal information, not advice.", False),
        ("", False),
        ("Yellow cells = not yet confirmed against a primary source (statute, court rule, or official court site).", False),
        ("'unverified' column lists those fields by name; 'notes' explains conflicts.", False),
        ("'sources' lists each URL with the kind of source and what it supports.", False),
        ("", False),
        (f"States + DC: {len(states)} rows (expected 51)", False),
        (f"California counties: {len(counties)} rows (expected 58)", False),
        (f"States with at least one unverified field: {sum(1 for s in states if s['unverified'])}", False),
        (f"Counties with at least one unverified field: {sum(1 for c in counties if c['unverified'])}", False),
        ("", False),
        ("Regenerate: .venv/bin/python scripts/build_tables.py", False),
    ]
    for text, bold in lines:
        readme.append([text])
        readme.cell(row=readme.max_row, column=1).font = Font(bold=bold, size=14 if bold else 11)
    readme.column_dimensions["A"].width = 110

    add_sheet(
        wb, "States", states, STATE_FIELDS, "state",
        {"state": 16, "abbr": 6, "limit_individual": 12, "limit_business": 12, "filing_fee_min": 10,
         "filing_fee_max": 10, "appeal_deadline_days": 10, "date_checked": 12, "sources": 70, "notes": 50,
         "limit_notes": 45, "who_can_sue": 45, "appeal": 45, "service_methods": 45, "filing_fee_notes": 45},
    )
    add_sheet(
        wb, "CA counties", counties, COUNTY_FIELDS, "county",
        {"county": 16, "small_claims_locations": 60, "self_help_center": 45, "small_claims_advisor": 50,
         "sources": 70, "local_notes": 45, "notes": 45, "date_checked": 12},
    )

    # California statewide: flatten top-level keys into two columns.
    ws = wb.create_sheet("CA statewide")
    ws.append(["topic", "detail"])
    for c in ws[1]:
        c.font = Font(bold=True)
    for k, v in ca.items():
        ws.append([k, flat(v)])
        ws.cell(row=ws.max_row, column=2).alignment = Alignment(wrap_text=True, vertical="top")
    ws.column_dimensions["A"].width = 28
    ws.column_dimensions["B"].width = 140

    out = REVIEW / "fair-claim-review.xlsx"
    wb.save(out)
    print(f"states: {len(states)}  counties: {len(counties)}  ca-statewide keys: {len(ca)}")
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
