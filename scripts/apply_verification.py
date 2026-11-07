#!/usr/bin/env python3
"""
Merge verification corrections (research/verification/round*.json) into research/states/group*.json.

For each correction {abbr, field, value?, verified, varies?, sources, note}:
  - sets row[field] = value when a value is given
  - removes field from row["unverified"] when verified (or varies=True with sources)
  - appends sources (deduplicated by URL) and a dated note
  - leaves row["date_checked"] alone (it covers the whole row); the note carries this check's date
Prints a summary; use --dry-run to preview.

Run:  .venv/bin/python scripts/apply_verification.py [--dry-run]
Then: .venv/bin/python scripts/build_tables.py
"""
import glob
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATE = "2026-11-07"
APPLIED = ROOT / "research" / "verification" / "applied.json"  # files already merged (so reruns don't double-apply)


def applied() -> set:
    return set(json.loads(APPLIED.read_text())) if APPLIED.exists() else set()


def mark_applied(names) -> None:
    APPLIED.write_text(json.dumps(sorted(applied() | set(names)), indent=1))


def main(dry: bool) -> None:
    corrections, new_files = [], []
    for f in sorted(glob.glob(str(ROOT / "research" / "verification" / "round*.json"))):
        if Path(f).name in applied():
            continue
        new_files.append(Path(f).name)
        corrections += [dict(c, _file=Path(f).name) for c in json.loads(Path(f).read_text())]

    files = {}
    rows = {}
    for f in sorted(glob.glob(str(ROOT / "research" / "states" / "group*.json"))):
        data = json.loads(Path(f).read_text())
        files[f] = data
        for r in data:
            rows[r["abbr"]] = r

    confirmed, changed, still = [], [], []
    for c in corrections:
        r = rows.get(c["abbr"])
        if r is None:
            print(f"!! unknown state {c['abbr']} in {c['_file']}")
            continue
        field = c["field"]
        if "value" in c and c["value"] is not None and r.get(field) != c["value"]:
            changed.append(f"{c['abbr']}.{field}: {r.get(field)!r} -> {c['value']!r}")
            r[field] = c["value"]
        ok = bool(c.get("verified")) or (bool(c.get("varies")) and c.get("sources"))
        if ok:
            r["unverified"] = [u for u in r.get("unverified", []) if u != field]
            confirmed.append(f"{c['abbr']}.{field}")
        else:
            still.append(f"{c['abbr']}.{field}")
        have = {s.get("url") for s in r.get("sources", [])}
        for s in c.get("sources", []):
            if s.get("url") and s["url"] not in have:
                r.setdefault("sources", []).append(s)
                have.add(s["url"])
        if c.get("note"):
            tag = "verified" if ok else "still unverified"
            r["notes"] = ((r.get("notes") or "") + f" [{DATE} {field}, {tag}: {c['note']}]").strip()
        # date_checked covers the whole row, so it isn't changed here; the dated note records this check.

    apply_counties(dry)
    print(f"states: confirmed {len(confirmed)}, changed values {len(changed)}, still unverified {len(still)}")
    for line in changed:
        print("  changed", line)
    if still:
        print("  still unverified:", ", ".join(still))
    if not dry:
        for f, data in files.items():
            Path(f).write_text(json.dumps(data, indent=1, ensure_ascii=False))
        mark_applied(new_files)
        print("written:", ", ".join(new_files) or "nothing new")


def apply_counties(dry: bool) -> None:
    """Same idea for California counties: research/verification/counties-round*.json -> research/california/counties-*.json.
    A verified top-level field also clears its sub-field entries (e.g. "small_claims_advisor.phone")."""
    corrections, new_files = [], []
    for f in sorted(glob.glob(str(ROOT / "research" / "verification" / "counties-round*.json"))):
        if Path(f).name in applied():
            continue
        new_files.append(Path(f).name)
        corrections += json.loads(Path(f).read_text())
    if not corrections:
        return
    files, rows = {}, {}
    for f in sorted(glob.glob(str(ROOT / "research" / "california" / "counties-*.json"))):
        data = json.loads(Path(f).read_text())
        files[f] = data
        for r in data:
            rows[r["county"].replace(" County", "").strip().lower()] = r
    ok_n, changed, still = 0, 0, []
    for c in corrections:
        r = rows.get(c["county"].replace(" County", "").strip().lower())
        if r is None:
            print(f"!! unknown county {c['county']}")
            continue
        field = c["field"]
        if "value" in c and c["value"] is not None and r.get(field) != c["value"]:
            r[field] = c["value"]
            changed += 1
        if c.get("verified"):
            r["unverified"] = [u for u in r.get("unverified", []) if u != field and not u.startswith(field + ".")]
            ok_n += 1
        else:
            still.append(f"{c['county']}.{field}")
        have = {s.get("url") for s in r.get("sources", [])}
        for s in c.get("sources", []):
            if s.get("url") and s["url"] not in have:
                r.setdefault("sources", []).append(s)
                have.add(s["url"])
        if c.get("note"):
            tag = "verified" if c.get("verified") else "still unverified"
            r["notes"] = ((r.get("notes") or "") + f" [{DATE} {field}, {tag}: {c['note']}]").strip()
    print(f"counties: confirmed {ok_n}, changed values {changed}, still unverified {len(still)}")
    if still:
        print("  still unverified:", ", ".join(still))
    if not dry:
        for f, data in files.items():
            Path(f).write_text(json.dumps(data, indent=1, ensure_ascii=False))
        mark_applied(new_files)


if __name__ == "__main__":
    main("--dry-run" in sys.argv)
