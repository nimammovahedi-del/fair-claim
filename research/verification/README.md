# Verification round 2 (2026-11-07)

Each file `round2-N.json` is a JSON array of corrections:

```json
{
  "abbr": "OH",
  "field": "filing_fee_min",            // a field name from research/SCHEMA.md section A
  "value": 40,                          // the confirmed value (same type as the schema); omit to keep the current value
  "verified": true,                     // true only if confirmed on a primary source (statute, court rule, official court site/fee schedule/form)
  "varies": false,                      // true when the honest answer is "set locally" (e.g. each county sets fees); then value = the range you could confirm
  "sources": [{"url": "...", "what": "...", "type": "statute|court_rule|court_site|form"}],
  "note": "what you checked; if not verified, why"
}
```

`scripts/apply_verification.py` merges these into `research/states/group*.json`. It sets the value, removes the field from `unverified` when verified (or when it varies and the range is documented), adds the sources, appends the note, and sets `date_checked`.
