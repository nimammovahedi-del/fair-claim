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
| `docs/design-system.md` | Design system (tokens, components, motion); live gallery at `/design/` |
| `docs/plan.md` | Later phases + yearly upkeep plan |

## Run it
```bash
cd ~/Projects/small-claims && .venv/bin/python scripts/build_tables.py   # after editing research
cd site && npm run dev                                                    # http://localhost:4321
```
The theme follows the device; the header switch offers Light / Dark / Auto (Option A design, 2026-11-06).

## Prototype pages
- Home
- `/steps/`: the five steps
- `/worth-it/`: calculator. It warns when a claim is over the limit and sets California's fee from the amount.
- `/demand-letter/`: PDF, print and copy, with cited California deposit notes
- `/states/` and 51 state pages. The California page adds fee tiers, deadlines, a "last day to sue" estimator and forms by step.
- `/states/ca/counties/` and 58 county pages
- `/sources/`
- `/design/`: the design-system gallery, light and dark side by side
- `/checklists/`, `/glossary/`, `/about/`: placeholders for now

## Round 2 (2026-11-06): design, usability, features
These changes were made at Nima's request. Three agents worked in order: design first, then the other two at once.
- **Design:** an original system inspired by the French government's design system (DSFR). The DSFR itself can't be
  used outside French government sites (its terms forbid it), so we copied none of its code, its Marianne font or its colors.
  - Light theme is the default; the dark theme is a softer charcoal.
  - A Display settings panel offers Light / Dark / System.
  - Fonts are hosted on the site itself, so it makes no third-party requests.
- **"Before you start" notice:** shown once per tool and remembered, on the cost calculator, the demand letter and the California
  deadline estimator. The PDF and print versions carry a "general information, not legal advice" line.
- **Messaging:** neutral, information-first. "Is it worth it?" became the "Small claims cost calculator", with
  "What the numbers show" in place of a verdict. A "Before you decide" section on /steps/ covers options besides suing,
  hidden costs and the risk of a counterclaim.
- **Usability and accessibility:** an "In short" summary on state pages, filter boxes on the state and county tables, form checks with inline
  errors, tables that stack on phones, a skip link, captions and scopes, and a 404 page.
- **Charts, not visitor analytics** (the no-tracking promise stands): US limit map, limit changes, fee ranges,
  appeal/lawyer rules, collection odds, and Philadelphia outcomes. They're on the home and About pages; each has a source, a date and a data table.
- **Glossary:** 41 terms with tap-for-definition links on the steps and state pages.
- **Checklists:** printable, one page per state, at /checklists/{state}/.
- **Data fix:** California's state row now shows the 200% fee-waiver income test (it said 125%).

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
2. Nima reviews the design system at `/design/` (see `docs/design-system.md`).
3. Close the yellow cells, limits and fees first.
4. Phase 1 per `docs/plan.md`. Hosting needs a **new** free account, created by Nima. Never use the friend's Cloudflare token.

## Notes
- Shared with the letter-decoder project: `site/src/lib/core/` (see its README). There's a hand-over note in the shared session-notes folder.
- No AI API anywhere. Re-research happens in Claude Code sessions.

## Hosting decision (2026-11-06)
Fair Claim will use Nima's **fedmoney Cloudflare account**, the same one as the federal-money-map site. Deploy it the same way: a private GitHub repo with Cloudflare Pages' Git integration, connected by Nima in the dashboard. This Mac is never signed into that account. Not deployed yet. Before publishing: finish the polish round, have Nima review it, and close the unverified limits and fees.

## Round 3 (2026-11-07): Option A rebuild, polish, verification
- **Design:** the whole site was rebuilt in mockup Option A (Cocota-inspired). The landing page is "Small claims, explained." with three doors.
  - Palette: tomato, cobalt, lilac, sage and sand.
  - Fonts: Inter Tight and Geist.
  - Theme: follows the device, with a Light / Dark / Auto switch.
  - The calculator and the letter are one-question-at-a-time flows.
  - Polish pass applied Emil Kowalski's design skills (motion audit, mobile rules, stress tests).
  - Review gallery: `/review/`. Mockups: `/mockups/`.
- **Verification round 2:** limits, fees, appeal rules and lawyer rules were checked for the 27 states that still had them open. Corrections are in `research/verification/round2-*.json`, merged by `scripts/apply_verification.py`.
  - 53 facts confirmed and 36 values corrected.
  - Corrections: Ohio's appeal deadline is 30 days, not 14. Mississippi's is 30 days, not 10. Virginia's fee is $46–$55. New Mexico's Metro Court civil appeals go to the Court of Appeals on the record.
  - Fees set county by county (AL, AR, GA, LA, MO, OH, TN, etc.) are now documented as ranges.
  - **New:** Georgia's limit rises to $25,000 on 2027-01-01 (HB 999). Update the limit on that date.
- **Still unverified** (45 rows, none of them limits, fees, appeals or lawyer rules): fee-waiver forms and thresholds, e-filing, who can sue, self-help links, service methods. Yellow cells in the spreadsheet.
- **Upcoming date-driven updates:** GA $25,000 (2027-01-01), WI $15,000 (2027-01-01), SC fee $105 (2027-01-01), UT $25,000 (2030-01-01).

## Verification round 3 (2026-11-07)
Agents checked every remaining state detail plus the California county gaps. Corrections are in `research/verification/round3-*.json` and `counties-round3.json`, merged by `scripts/apply_verification.py`; `applied.json` records which files are merged, so reruns don't apply them twice.
- **States:** 119 facts confirmed, 100 values corrected or made more specific. **12 fields in 6 states are still open** because official sites were blocked or silent:
  - LA: e-filing, self-help URL
  - MS: who can sue, fee-waiver form and threshold
  - MO: e-filing, fee-waiver form, self-help URL (courts.mo.gov bot check)
  - NM: e-filing, who can sue
  - TN: service methods
  - WY: fee-waiver form
- **Notable state corrections:**
  - NC e-filing is statewide since Oct 2025.
  - KS self-represented people can't e-file.
  - PA small claims courts have no e-filing.
  - Ohio's fee-waiver income test is 187.5% of the poverty guidelines.
  - West Virginia's is 150%.
  - Kentucky added a sliding-scale route.
  - Two dead self-help links were replaced (MA, OH).
- **CA counties:** 25 confirmed, 25 corrected (advisors in Butte, Shasta, Napa, Humboldt and others). **42 details in 31 counties are still open**, mostly whether small counties allow small-claims e-filing or remote hearings; their court sites don't say. Advisors are still unconfirmed in Del Norte, San Francisco, Sierra, Tehama, Yolo and Yuba.
- **New dated change:** Rhode Island's fee goes from $55 to $75 and its counterclaim cap to $5,000 on 2027-01-01 (P.L. 2026 ch. 323).
- **Launch prep** is done; see `docs/publish.md`. Hosting is the fedmoney Cloudflare account.

## Live preview (2026-11-07)
- **Address:** https://fair-claim-706.pages.dev. It's Cloudflare Pages project `fair-claim` on the fedmoney account ("federal-money-atlas2"), and it auto-deploys on every push to github.com/nimammovahedi-del/fair-claim (private).
- **Checked live:** all page types return 200, review-only pages return 404, robots.txt blocks crawlers, every page is noindex, security headers are active, and the PDF library loads under them.
- **To do:**
  - Nima changes Cloudflare's `SITE_URL` variable to `https://fair-claim-706.pages.dev`, or deletes it, so canonical and share links use the real address.
  - Test on a real phone.
  - Go public later by setting `PUBLIC_INDEXABLE=true`.

## Address change (2026-11-07)
Nima wants the short address **https://fairclaim.pages.dev**. Pages projects can't be renamed, so the plan is: create a new Cloudflare Pages project named `fairclaim` on the same repo (same settings), check it, then delete the old `fair-claim` project (fair-claim-706.pages.dev). The code's default address is already set to fairclaim.pages.dev.
- 2026-11-07: **Live at https://fairclaim.pages.dev** (Pages project `fairclaim`, fedmoney account). Checked: all page types 200, mockups 404, canonical correct, security headers on, still noindex. The old `fair-claim` project (fair-claim-706.pages.dev) can be deleted by Nima.

## Location search (2026-11-06)
- `<LocationSearch />` replaces the state dropdowns on `/states/` and `/checklists/`: ZIP code, city/town, county or
  state, matched in the browser (nothing typed is sent anywhere). California ZIPs, cities and counties go to the
  county page.
- Data: `scripts/build_places.py` downloads U.S. Census Bureau files (public domain) to `research/raw/places/`
  (git-ignored) and writes `site/public/geo/` (zip-0…9, counties, places-a…z). Sources: 2020 ZCTA-to-county
  relationship file, 2024 Gazetteer counties + places, 2020 national place-by-county list. ZCTAs approximate USPS
  ZIPs, so a few PO-box-only ZIPs aren't found; 8 California places have no county in the 2020 list and go to the
  California page. Rerun after a new Census release.

## Round 6 (2026-11-07): search, home/About, logo
- **Location search** (ZIP, city, county or state) runs in the browser on Census files in `site/public/geo/`, built by `scripts/build_places.py`. It's on the home, /states/ and /checklists/ pages.
- **Spacing:** about 25% tighter, set by spacing tokens.
- **Home page:** shorter. Headline plus search, smaller doors, a five-steps strip, the 55% figure and a compact limits map.
- **About:** four numbered parts: getting paid, who uses small claims, how we check, and mission plus free help. The fact counts are calculated from the data.
- **Glossary:** letters with terms are now clearly stronger than empty ones.
- **Logo: "Balance"** (a scale with cobalt and tomato tiles). It's in the header, the favicon (follows light/dark), apple-touch-icon, icon-512 and a new og.png share image. The 10 logo options are in `output/logos/`.
- **Rhode Island:** the 2027 fee change now reads "$75.75 total today becomes a flat $75".
