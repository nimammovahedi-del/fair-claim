# Fair Claim — plan for later phases

## Phase 0 (this round): done, see STATUS.md
Research tables (51 jurisdictions, 58 CA counties, CA statewide rules, collection memo), local prototype, design
options.

## Phase 1: verify, then launch the core
1. Nima reviews `output/review/fair-claim-review.xlsx`. Yellow cells are unverified.
2. Close the unverified cells, starting with limits and fees, since the calculator uses them.
3. Pick a design direction; apply it and remove the switcher.
4. Write the per-state pages in plain language (the prototype shows the raw fields).
5. Add state-specific notes to the demand-letter tool (each cited) for the top case type in each state:
   security deposits (return deadline, bad-faith penalty).
6. Hosting: Astro static site on Cloudflare Pages or Vercel (free). This needs a **new** account, created by
   Nima. Nothing is deployed until Nima says so.

## Phase 2: the collection guide (`/collect/`)
The site's hook is honesty about getting paid, so this comes next.
- Per state: when you can start, judgment interest, how long it lasts and how to renew it, debtor exam,
  wage garnishment limit, bank levy and exemptions, property liens, and the official forms.
- California first (research is mostly done in `research/collection/`), then the 10 most populous states.
- A "can they pay?" checklist before filing (job, bank, property, business, licensed trade, landlord).
- A collection step tracker in the browser, built on the reusable `deadlines.ts`. It saves nothing.

## Phase 3: "I've been sued" (`/sued/`)
Most small claims defendants are people sued by debt buyers and collectors (Pew's Philadelphia data; the April
2026 Harvard Law School Consumer Protection Clinic report on fast-moving debt cases).
- Triage: is it a debt? Who is suing (original creditor or debt buyer)? When is the court date or answer deadline?
- Never ignore it: default-judgment risk, with the state's deadline to respond (deadline logic is reusable).
- Common defenses to raise and check: wrong amount, not my debt, past the statute of limitations, the plaintiff
  can't prove it owns the debt, identity theft.
- Exempt income (Social Security, SSI, VA benefits; federal bank-account protection).
- Links to legal aid (LawHelp.org, state legal-aid directories) and court self-help centers.
- This joins well with the letter decoder: "a court letter / summons" becomes one of the letter types it decodes.

## Phase 4: county detail for more states
Order by population and by how much the rules vary by county:
1. New York (NYC Civil Court vs. city/town/village courts, plus commercial claims)
2. Texas (justice courts by precinct)
3. Florida (county courts and small claims pretrial conferences)
4. Illinois (Cook County municipal districts)
5. Pennsylvania (magisterial districts, Philadelphia Municipal Court)
6. Georgia, Ohio, Michigan, North Carolina, New Jersey

Fields to reuse from CA: locations, self-help center, free advisor or mediation program, e-filing, remote hearings.

## Merging with the letter decoder
`site/src/lib/core/` (deadlines, demand letter, worth-it math) has no site dependencies. If the two projects
become one "everyday legal help" site, move `core/` into a shared package and use one design system.

## Yearly upkeep plan
Limits and fees change by statute. New laws usually take effect January 1 or July 1. Fee waiver income tables
change each spring with the federal poverty guidelines.

| When | What |
| --- | --- |
| **Early June** | Scan each state's enacted bills for "small claims" (legislative sessions mostly end by June). Flag states for July 1 changes. |
| **Late June** | Re-check flagged states; update before July 1 effective dates. |
| **Early December** | Full re-check of all 51: limit, fees, appeal, e-filing, self-help URL. Update for January 1 changes. |
| **March–April** | Fee-waiver income tables (CA FW-001 is reissued for the new federal poverty guidelines). |
| **Quarterly** | Automated link check of every source URL (GitHub Actions, free). Opens an issue listing dead links. |
| **Any time** | Reader-reported errors: fix, re-date, and keep a short public changelog. |

Automation ideas (free): a scheduled GitHub Action that (1) checks every `sources[].url` and `self_help_url` for
HTTP errors, (2) flags rows whose `date_checked` is older than 13 months, and (3) diffs official fee-schedule PDFs
by hash so a change gets a human look. No AI API: any re-research happens in Claude Code sessions.
