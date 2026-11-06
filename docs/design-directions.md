# Fair Claim — design directions (pick one)

All three are built into the prototype. Run it locally and switch with the **Design** menu in the header
(or open `/design/`). Same pages, same structure; only colors, type and a few details change.
Motion in all three: short color/opacity changes only. No bounce, no overshoot, no scroll-jacking.

## A · Counter — "the clerk's counter"
Plain, official, very hard to mistrust.

- **Inspired by:** GOV.UK Design System (black header, yellow focus ring, bold type, one idea per page);
  the U.S. Web Design System and its Public Sans typeface; California Judicial Council forms like SC-100
  (numbered boxed items, tight rules).
- **Look:** white page, near-black text, one civic blue, green action buttons, square corners, step numbers in
  solid black squares. Public Sans throughout; IBM Plex Mono for citations and dates.
- **Strength:** reads as trustworthy to stressed, first-time readers, and it's the most accessible of the three.
- **Risk:** can look like "another government site": trustworthy, but easy to forget.

## B · Docket — "a court docket as a calm dark console"
A family resemblance to the Congress tracker.

- **Inspired by:** PACER docket sheets and courthouse calendar boards (case numbers, dates and status in tight
  columns); Bloomberg Terminal and Linear's quiet dark UI; Nima's Congress tracker.
- **Look:** dark slate; amber for warnings and key numbers; monospace for every figure, citation and date;
  ledgers whose numbers line up. IBM Plex Sans + Plex Mono.
- **Strength:** great for the 50-state table, the calculator and the "checked on" dates. It looks like a
  serious data tool.
- **Risk:** a dark, dense screen can feel intimidating to a tenant who's upset about a deposit.

## C · Pamphlet — "a well-made printed guide from the public library"

- **Inspired by:** Nolo's classic paperback *Everybody's Guide to Small Claims Court* and public-library legal
  pamphlets; ProPublica / Marshall Project explainers (serif text, generous margins, sidenote sources);
  Stripe Press book design (warm paper, oxblood accent, big italic numerals).
- **Look:** cream paper, warm ink, Source Serif 4, oxblood accent, large italic step numerals; citations sit
  quietly beside the text.
- **Strength:** the most human and distinctive. It suits a guide people read start to finish, and it prints
  beautifully.
- **Risk:** less "official" at a glance, and dense tables need extra care in a serif.

**My suggestion:** C for the guide pages, borrowing A's numbered-box structure for the step-by-step forms. Or
A, if you want maximum trust from first-time readers. B fits the data better than the people. Your call.

## Site structure

```
/                          Home: the pitch, the 5-step strip, "the part other guides skip" (collection odds), state picker
/steps/                    The five steps in full (demand → file → serve → hearing → collect)
/worth-it/                 "Is it worth it?" calculator (?state=xx preselects)
/demand-letter/            Demand-letter generator (browser-only, PDF/print/copy, stores nothing)
/states/                   50 states + DC table
/states/{xx}/              State page: limit, fees, who can sue, lawyers, appeals, service, e-filing, fee waiver, sources
/states/ca/counties/       58-county table
/states/ca/counties/{c}/   County page: advisor, courthouses, self-help center, e-filing, remote hearings
/sources/                  How we check + what research says about getting paid
-- later --
/sued/                     "I've been sued" path (mostly debt-collector suits)
/collect/                  Collecting a judgment, by state
/states/{xx}/counties/…    County detail for more states
```
