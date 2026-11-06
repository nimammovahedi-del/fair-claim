# Fair Claim — STATUS

*Free small claims court guide. Legal information, not legal advice. Phase 0 finished 2026-11-06.
Nothing deployed, no accounts created.*

## Decisions (Nima, 2026-11-05)
- **Working name:** Fair Claim.
- **Tone:** calm and candid. A neutral reference voice that's frank about costs and the odds of getting paid.
- **Main readers of the "sue someone" path:** tenants (deposits), consumers vs. businesses, and small
  businesses/freelancers.
- **Demand letter:** copy, print, and a PDF download, all made in the browser (jsPDF). Nothing is stored.
- **Scope:** basic rules for all 50 states + DC; full county detail for California. "I've been sued" comes later.

## What's here
| Path | What |
| --- | --- |
| `output/review/fair-claim-review.xlsx` | **Start here.** Sheets: States (51 rows), CA counties (58), CA statewide. Yellow = unverified. |
| `output/review/states.csv`, `ca-counties.csv` | Same data as CSV |
| `research/states/group1-4.json` | 50-state + DC research, cited and dated 2026-11-05 |
| `research/california/counties-1-3.json` | 58 CA counties: courthouses, self-help center, advisor, e-filing, remote hearings |
| `research/california/statewide.json` | CA limits, fee tiers, forms by step, service/appeal deadlines, statutes of limitations, fee waiver, deposits, judgments |
| `research/collection/collection-research.md` | Collecting a judgment (CA + general) and the evidence on odds of getting paid |
| `research/SCHEMA.md` | Field definitions and source rules |
| `scripts/build_tables.py` | Merges research → site data + spreadsheet |
| `site/` | Astro prototype (local only) |
| `site/src/lib/core/` | Reusable, framework-free logic: deadlines, demand letter, worth-it math |
| `docs/design-directions.md` | 3 design directions + site structure |
| `docs/plan.md` | Later phases + yearly upkeep plan |

## Run it
```bash
cd ~/Projects/small-claims && .venv/bin/python scripts/build_tables.py   # after editing research
cd site && npm run dev                                                    # http://localhost:4321
```
Use the **Design** menu in the header to switch between A Counter, B Docket and C Pamphlet.

## Prototype pages
- Home
- `/steps/`: the five steps
- `/worth-it/`: calculator. It warns when a claim is over the limit and sets California's fee from the amount.
- `/demand-letter/`: PDF, print and copy, with cited California deposit notes
- `/states/` and 51 state pages. The California page adds fee tiers, deadlines, a "last day to sue" estimator and forms by step.
- `/states/ca/counties/` and 58 county pages
- `/sources/`
- `/design/`

## Research findings that change the brief
- **Rhode Island is $5,000**, not $2,500 (raised July 2021). Kentucky's $2,500 is now the lowest.
- **Delaware and Tennessee: $25,000** confirmed. Tennessee's limit doesn't depend on county population.
- **California:** $12,500 for individuals and $6,250 for businesses confirmed (SB 71, effective 2024-01-01).
  AB 1827, which would have raised it to $15,000, died in committee in August 2026.
  - The fee waiver threshold is now **200%** of federal poverty guidelines, up from 125% (SB 54, effective 2026-01-01).
  - The automatic bank exemption is $2,325 (July 1, 2026).
- **Idaho is $15,000** (July 1, 2026) and **Maine is $10,000** (January 1, 2026). Both confirmed.
- **Coming up:**
  - **Wisconsin:** the limit rises to $15,000 on 2027-01-01, and the fee already went to $124 on 2026-11-01.
  - **South Carolina:** the fee goes from $70 to $105 on 2027-01-01.
  - **Utah:** the limit rises to $25,000 on 2030-01-01.
  - **Recent increases:** West Virginia to $20,000 (July 2025), Nebraska to $7,500 (July 2025), Arizona to $5,000 (September 2025).
- **New York:** $10,000 applies in NYC only. Other city and district courts are $5,000 and town/village courts $3,000. Businesses must use "commercial claims."
- **Collection odds:**
  - **Best anchor:** a Denver study (Fordham Urban Law Journal, 1994) found 55% of winners collected nothing, and 31% of awarded dollars were paid.
  - **Michigan 2004 (56%):** the original report link is dead; the figure comes from a summary.
  - **Maine "two-thirds":** an informal 2004 Sun Journal newspaper survey of three counties.
- **The "April 2026 Harvard report"** is a law-review article by Alexa Rosenbloom, director of the Harvard Law School Consumer
  Protection Clinic. It's in the Georgetown Journal on Poverty Law & Policy, vol. 33 (2026), and is about coverage attorneys in debt mills.
- **CA advisors:** not every county has a dedicated small claims advisor. Courts with 1,000 or fewer small claims filings a year can opt out (CCP 116.940(c)): Shasta and Trinity have.
  - **No named advisor found:** Sierra, San Francisco, San Bernardino, Butte and Lassen.

## Needs a human look (top items; full list in the spreadsheet's yellow cells)
- **Unverified fields:** 46 of 51 states and 42 of 58 counties have at least one. Most are e-filing, fee-waiver or service details.
- **Most gaps:** Mississippi (statute says a 10-day appeal deadline, a county court says 30), Ohio, Tennessee, Louisiana, Massachusetts, Pennsylvania and New Hampshire. Their official sites blocked the research tools, or fees are set county by county.
- **Conflicting fees:** Arkansas and Georgia.
- **Florida:** the 30-day appeal deadline comes from a secondary source.
- **Indiana:** Marion County's limit needs checking.
- **California:** the statute site blocked the tools, so the state row was confirmed from official forms; statewide.json cites the statutes.
- **CA county court pages:** several still show old limits (flagged in `local_notes`), and Kern says $6,500 for businesses.
- **Los Angeles:** the court site is mid-migration and its courthouse list needs re-checking.

## Next steps
1. Nima reviews the spreadsheet.
2. Nima picks a design direction (see `docs/design-directions.md`).
3. Close the yellow cells, limits and fees first.
4. Phase 1 per `docs/plan.md`. Hosting needs a **new** free account, created by Nima. Never use the friend's Cloudflare token.

## Notes
- Shared with the letter-decoder project: `site/src/lib/core/` (see its README). There's a hand-over note in the shared session-notes folder.
- No AI API anywhere. Re-research happens in Claude Code sessions.
