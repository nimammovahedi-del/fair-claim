# Research schema (Phase 0)

Every fact needs a source and a "last checked" date. Check date for this round: **2026-11-05**.

## Source rules (apply to every file)

1. **Prefer primary sources:** the statute or court rule itself (official legislature site), or the state judiciary's
   own website / self-help pages / official forms. Secondary sources (Nolo, law firm blogs, ad-driven state charts)
   may be used only to find a lead; never cite them as the source of a fact.
2. If a fact is only confirmed by a secondary source, or sources conflict, still record your best value but
   **list the field name in `unverified`** and explain in `notes`.
3. Never invent a value. If you can't find it, write `null` and list the field in `unverified`.
4. Watch for recent changes (2024–2026 legislation). If a limit or fee changed recently or is scheduled to change,
   give the current value AND the change (date + new value + source) in `recent_changes`.
5. Money values are plain numbers (no `$`). Ranges go in text fields.
6. `sources` is a list of `{ "url": ..., "what": "which fields this supports", "type": "statute|court_rule|court_site|form|secondary" }`.

## A. State rows — `research/states/<group>.json` (a JSON array, one object per state)

```json
{
  "state": "California",
  "abbr": "CA",
  "court_name": "Small claims division of Superior Court",
  "limit_individual": 12500,
  "limit_business": 6250,
  "limit_notes": "Text: other limits (e.g. per-year caps, different limits by court/county, special case types)",
  "recent_changes": "Text or null",
  "filing_fee_min": 30,
  "filing_fee_max": 100,
  "filing_fee_notes": "How fees vary (by amount, county, number of filings, plus service cost)",
  "who_can_sue": "Text: individuals, businesses, assignees/collection agencies allowed?, minimum age, corporations must appear via officer, etc.",
  "lawyers_allowed": "yes | no | limited",
  "lawyers_notes": "Text",
  "appeal": "Text: who can appeal (plaintiff? defendant? both?), to which court, new trial (de novo) or on the record, deadline in days",
  "appeal_who": "both | defendant_only | none | varies",
  "appeal_deadline_days": 30,
  "e_filing": "yes_statewide | some_courts | no",
  "e_filing_notes": "Text",
  "fee_waiver_form": "Form name/number and URL if any",
  "fee_waiver_threshold": "Text: income test (e.g. 125% of federal poverty guidelines, receives SNAP/SSI) or 'judge's discretion'",
  "service_methods": "Text: certified mail by clerk, sheriff, private process server, any adult, etc.",
  "self_help_url": "Official small claims self-help page",
  "citation": "Main statute(s)/court rule(s), e.g. 'Cal. Code Civ. Proc. §§ 116.110–116.950'",
  "sources": [],
  "date_checked": "2026-11-05",
  "unverified": ["field names not confirmed by a primary source"],
  "notes": "Anything odd: county-by-county variation, multiple courts, etc."
}
```

## B. California counties — `research/california/counties-<group>.json` (JSON array, one per county)

```json
{
  "county": "Alameda",
  "court_name": "Superior Court of California, County of Alameda",
  "small_claims_page_url": "court's small claims page",
  "small_claims_locations": [
    { "name": "…Hall of Justice", "address": "street, city, ZIP", "notes": "which cases/areas it hears, in-person/remote" }
  ],
  "self_help_center": { "name": "", "address": "", "phone": "", "url": "", "notes": "" },
  "small_claims_advisor": {
    "provider": "who runs it (court, county, nonprofit, e.g. Dept. of Consumer Affairs)",
    "phone": "", "url": "", "email": "",
    "format": "phone / in person / workshops / email; hours if listed",
    "free": true,
    "notes": ""
  },
  "e_filing": "yes | no | unclear",
  "e_filing_notes": "provider or portal",
  "remote_hearings": "yes | no | unclear — Zoom/remote appearance for small claims",
  "local_notes": "anything county-specific (local forms, mediation program, filing by mail only, etc.)",
  "sources": [],
  "date_checked": "2026-11-05",
  "unverified": [],
  "notes": ""
}
```

Statewide California rules (limits, fees, forms) are researched once, separately — do not repeat them per county.
