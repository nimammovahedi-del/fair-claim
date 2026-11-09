// Derived numbers for the "what the data shows" charts.
//
// Rules for this file:
// - Every number is either read straight from src/data/*.json (generated from research/) or copied from
//   research/collection/collection-research.md with its source URL. Nothing is estimated or modelled here.
// - Simple arithmetic on those numbers (counts, medians, 100 − x) is allowed and labelled as such where shown.
// - Anything the research marks as unconfirmed carries `unverified: true` (or a field in `unverifiedFields`).
import { states, counties, caStatewide, type StateRow } from "./data";

export interface SourceLink {
  label: string;
  url: string;
}

// ------------------------------------------------------------------ Shared

/** Latest "checked" date across the 51 state rows (they were all checked on the same day). */
export const statesChecked: string = states
  .map((s) => s.date_checked ?? "")
  .filter(Boolean)
  .sort()
  .at(-1) as string;

/** Date the collection research memo was checked (see its header). */
export const evidenceChecked = "2026-11-05";

export const statesSource: SourceLink = {
  label: "Fair Claim state research (each state page lists its sources)",
  url: "/states/",
};

export function usd(n: number, compact = false) {
  if (compact && n >= 1000) {
    const k = n / 1000;
    return `$${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

function median(xs: number[]) {
  const a = xs.slice().sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

const isU = (s: StateRow, ...f: string[]) => f.some((x) => s.unverified?.includes(x));

// ------------------------------------------------------------------ 1. Limits (tile map + distribution)

/** Ordered bins for the tile map. Upper bounds are inclusive. */
export const limitBins = [
  { max: 5000, label: "Up to $5,000" },
  { max: 7500, label: "$5,001 – $7,500" },
  { max: 10000, label: "$7,501 – $10,000" },
  { max: 15000, label: "$10,001 – $15,000" },
  { max: 25000, label: "$15,001 – $25,000" },
];

export function limitBin(n: number) {
  const i = limitBins.findIndex((b) => n <= b.max);
  return i === -1 ? limitBins.length - 1 : i;
}

// Tile-grid positions [column, row] on an 11 × 8 grid. One square per state + DC, roughly where it sits on a map.
export const tileLayout: Record<string, [number, number]> = {
  AK: [0, 0], ME: [10, 0],
  VT: [9, 1], NH: [10, 1],
  WA: [0, 2], ID: [1, 2], MT: [2, 2], ND: [3, 2], MN: [4, 2], IL: [5, 2], WI: [6, 2], MI: [7, 2], NY: [8, 2], RI: [9, 2], MA: [10, 2],
  OR: [0, 3], NV: [1, 3], WY: [2, 3], SD: [3, 3], IA: [4, 3], IN: [5, 3], OH: [6, 3], PA: [7, 3], NJ: [8, 3], CT: [9, 3],
  CA: [0, 4], UT: [1, 4], CO: [2, 4], NE: [3, 4], MO: [4, 4], KY: [5, 4], WV: [6, 4], VA: [7, 4], MD: [8, 4], DE: [9, 4],
  AZ: [1, 5], NM: [2, 5], KS: [3, 5], AR: [4, 5], TN: [5, 5], NC: [6, 5], SC: [7, 5], DC: [8, 5],
  OK: [3, 6], LA: [4, 6], MS: [5, 6], AL: [6, 6], GA: [7, 6],
  HI: [0, 7], TX: [3, 7], FL: [8, 7],
};

export const limitTiles = states
  .filter((s) => s.limit_individual != null)
  .map((s) => ({
    abbr: s.abbr,
    state: s.state,
    slug: s.slug,
    limit: s.limit_individual as number,
    business: s.limit_business,
    bin: limitBin(s.limit_individual as number),
    col: tileLayout[s.abbr]?.[0] ?? 0,
    row: tileLayout[s.abbr]?.[1] ?? 0,
    unverified: isU(s, "limit_individual"),
  }));

const limits = limitTiles.map((t) => t.limit);
export const limitStats = {
  count: limits.length,
  median: median(limits),
  min: Math.min(...limits),
  max: Math.max(...limits),
  minStates: limitTiles.filter((t) => t.limit === Math.min(...limits)).map((t) => t.state),
  maxStates: limitTiles.filter((t) => t.limit === Math.max(...limits)).map((t) => t.state),
  binCounts: limitBins.map((_, i) => limitTiles.filter((t) => t.bin === i).length),
  atMedian: limitTiles.filter((t) => t.limit === median(limits)).length,
  /** States where businesses have a lower limit than individuals. */
  lowerForBusiness: states
    .filter((s) => s.limit_business != null && s.limit_individual != null && s.limit_business < s.limit_individual)
    .map((s) => ({ state: s.state, individual: s.limit_individual as number, business: s.limit_business as number })),
};

// ------------------------------------------------------------------ 2. Recent limit increases (dumbbell)
// Read by hand from each state's `recent_changes` text in states.json (and ca-statewide.json for California).
// `effective` is the date the higher limit took effect. Only changes to the general limit for individuals.

export interface LimitChange {
  abbr: string;
  from: number;
  to: number;
  effective: string; // ISO date
  scheduled?: boolean; // not yet in effect
  note?: string;
  unverified?: boolean;
}

const caPrior = caStatewide?.limits?.prior_limit_individual as number; // 10,000 (SB 71 digest)

export const limitChanges: LimitChange[] = [
  { abbr: "ID", from: 5000, to: 15000, effective: "2026-07-01" },
  { abbr: "ME", from: 6000, to: 10000, effective: "2026-01-01" },
  { abbr: "AZ", from: 3500, to: 5000, effective: "2025-09-26" },
  {
    abbr: "WV",
    from: 10000,
    to: 20000,
    effective: "2025-07-07",
  },
  { abbr: "NE", from: 3900, to: 7500, effective: "2025-07-01", note: "In two steps: $6,000 from July 2024, $7,500 from July 2025." },
  { abbr: "UT", from: 15000, to: 20000, effective: "2025-01-01" },
  { abbr: "MN", from: 15000, to: 20000, effective: "2024-08-01" },
  { abbr: "KS", from: 4000, to: 10000, effective: "2024-07-01" },
  // California: confirmed against SB 71 in ca-statewide.json (the states.json row flags its longer recent_changes
  // text, which also covers a bill that did not pass).
  { abbr: "CA", from: caPrior ?? 10000, to: 12500, effective: "2024-01-01", note: "Businesses: $6,250." },
  { abbr: "GA", from: 15000, to: 25000, effective: "2027-01-01", scheduled: true, note: "HB 999 (2026). Magistrate court." },
  { abbr: "WI", from: 10000, to: 15000, effective: "2027-01-01", scheduled: true },
  { abbr: "UT", from: 20000, to: 25000, effective: "2030-01-01", scheduled: true },
];

/** Michigan's last scheduled step (to $7,000) took effect 2024-01-01; the earlier amount isn't in our data. */
export const limitChangeFootnote =
  "Michigan's limit also reached $7,000 on January 1, 2024, the last of a series of scheduled steps; the earlier amount isn't in our research, so it isn't drawn.";

export const limitChangeRows = limitChanges.map((c) => {
  const s = states.find((x) => x.abbr === c.abbr)!;
  return { ...c, state: s.state, slug: s.slug };
});
export const raisedSince2024 = limitChanges.filter((c) => !c.scheduled && c.effective >= "2024-01-01").length + 1; // + Michigan

// ------------------------------------------------------------------ 3. Filing fees (range plot)

export const feeRows = states
  .map((s) => ({
    abbr: s.abbr,
    state: s.state,
    slug: s.slug,
    min: s.filing_fee_min,
    max: s.filing_fee_max,
    unverified: isU(s, "filing_fee_min", "filing_fee_max"),
  }))
  .filter((r) => r.min != null || r.max != null)
  .sort((a, b) => (a.min ?? a.max ?? 0) - (b.min ?? b.max ?? 0) || (a.max ?? a.min ?? 0) - (b.max ?? b.min ?? 0));

export const feeMissing = states
  .filter((s) => s.filing_fee_min == null && s.filing_fee_max == null)
  .map((s) => ({ state: s.state, slug: s.slug }));

const feeMins = states.map((s) => s.filing_fee_min).filter((n): n is number => n != null);
const feeAll = states.flatMap((s) => [s.filing_fee_min, s.filing_fee_max]).filter((n): n is number => n != null);
export const feeStats = {
  statesWithFigures: feeRows.length,
  medianLowest: median(feeMins),
  lowest: Math.min(...feeAll),
  highest: Math.max(...feeAll),
  overOneFifty: feeRows.filter((r) => (r.max ?? 0) > 150).length,
  unverifiedCount: feeRows.filter((r) => r.unverified).length,
};

// ------------------------------------------------------------------ 4. Appeals and lawyers (counts)

export const appealGroups = [
  { key: "both", label: "Either side can appeal" },
  { key: "defendant_only", label: "Only the defendant can appeal" },
  { key: "varies", label: "Depends on the court" },
  { key: "none", label: "No appeal" },
].map((g) => {
  const rows = states.filter((s) => s.appeal_who === g.key);
  return {
    ...g,
    count: rows.length,
    states: rows.map((s) => ({ abbr: s.abbr, state: s.state, slug: s.slug, unverified: isU(s, "appeal", "appeal_who") })),
  };
});

export const lawyerGroups = [
  { key: "yes", label: "Lawyers allowed" },
  { key: "limited", label: "Allowed only in some cases" },
  { key: "no", label: "Not allowed at the hearing" },
].map((g) => {
  const rows = states.filter((s) => s.lawyers_allowed === g.key);
  return {
    ...g,
    count: rows.length,
    states: rows.map((s) => ({ abbr: s.abbr, state: s.state, slug: s.slug, unverified: isU(s, "lawyers_allowed") })),
  };
});

const deadlines = states.map((s) => s.appeal_deadline_days).filter((n): n is number => n != null);
export const appealDeadlineStats = {
  count: deadlines.length,
  min: Math.min(...deadlines),
  max: Math.max(...deadlines),
  median: median(deadlines),
};

// ------------------------------------------------------------------ 5. Collecting: the evidence
// From research/collection/collection-research.md, Part 3. There is no national or California dataset.

export const denver = {
  wonPct: 85, // plaintiffs who filed and appeared won 85% of the time
  collectedNothingPct: 55, // of winning plaintiffs, 55% never collected any part
  dollarsPaidPct: 31, // amounts collected = 31% of amounts awarded
  source: {
    label: "Best, Zalesne, Bridges & Chenoweth, 21 Fordham Urb. L.J. 343 (1994)",
    url: "https://ir.lawnet.fordham.edu/ulj/vol21/iss2/4",
  },
  caveat: "Denver small claims court.",
};

export interface CollectRow {
  label: string;
  detail: string;
  /** Share of winners who got at least some money, 0–100. */
  pct: number;
  display: string;
  strength: "study" | "unverified" | "anecdotal";
  source: SourceLink;
}

export const collectRows: CollectRow[] = [
  {
    label: "Denver, 1994 study",
    detail: "Winners who collected anything. Computed as 100% minus the 55% who collected nothing.",
    pct: 100 - denver.collectedNothingPct,
    display: `${100 - denver.collectedNothingPct}%`,
    strength: "study",
    source: denver.source,
  },
  {
    label: "Michigan, 2004 survey: decided by a judge",
    detail: "Plaintiffs paid in full or in part, out of a survey of 600 plaintiffs.",
    pct: 56,
    display: "56%",
    strength: "unverified",
    source: {
      label: "Donohue & Atkin (2004), via Resolution Systems Institute",
      url: "https://www.aboutrsi.org/library/district-court-small-claims-division-mediation-in-michigan-comparing-collection-rates-in-adjudicated-and-mediated-cases",
    },
  },
  {
    label: "Michigan, 2004 survey: settled in mediation",
    detail: "Same survey, cases that were mediated instead.",
    pct: 79,
    display: "79%",
    strength: "unverified",
    source: {
      label: "Donohue & Atkin (2004), via Resolution Systems Institute",
      url: "https://www.aboutrsi.org/library/district-court-small-claims-division-mediation-in-michigan-comparing-collection-rates-in-adjudicated-and-mediated-cases",
    },
  },
  {
    label: "Three Maine counties, 2004 newspaper survey",
    detail: "“Roughly two-thirds” of winners did not collect, so about one in three did. Local clerks estimated a quarter to a third.",
    pct: 100 / 3,
    display: "≈ 1 in 3",
    strength: "anecdotal",
    source: {
      label: "Sun Journal (Lewiston, Me.), “Small claims smaller gains,” Aug. 22, 2004",
      url: "https://www.sunjournal.com/2004/08/22/small-claims-smaller-gains/",
    },
  },
];

export const strengthLabel: Record<CollectRow["strength"], string> = {
  study: "Published study",
  unverified: "Study summary",
  anecdotal: "Newspaper survey",
};

// ------------------------------------------------------------------ 6. Who uses small claims: Philadelphia (Pew)

export const pew2022 = {
  source: {
    label: "Pew Charitable Trusts, “How Debt Collection Works in Philadelphia's Municipal Court” (Oct. 26, 2022)",
    url: "https://www.pew.org/en/research-and-analysis/reports/2022/10/how-debt-collection-works-in-philadelphias-municipal-court",
  },
  casesTotal: "more than 100,000",
  years: "2013–2018",
  outcomeCases: 117117,
  outcomes: [
    { label: "Default judgment for the plaintiff", pct: 35, note: "The defendant didn't respond or appear." },
    { label: "Dismissed: papers never served", pct: 24, note: "" },
    { label: "Judgment for the plaintiff after a trial", pct: 1, note: "" },
    { label: "Judgment for the defendant", pct: 1, note: "" },
  ],
  judgmentsTotal: "nearly 45,000",
  judgmentsDefaultPct: 95,
};
/** The four itemized outcomes sum to 61%; the rest isn't itemized in our research notes. */
export const pewOtherPct = 100 - pew2022.outcomes.reduce((a, o) => a + o.pct, 0);

export const pew2021 = {
  source: {
    label: "Pew Charitable Trusts, “How Philadelphia Municipal Court's Civil Division Works” (2021, updated 2022)",
    url: "https://www.pew.org/en/research-and-analysis/reports/2021/02/how-philadelphia-municipal-courts-civil-division-works",
  },
  plaintiffsWithLawyersPct: 91,
  defendantsWithLawyersPct: 12, // "about 12%"
  plaintiffWinPct: 97.6, // of small claims cases that ended in a judgment for one side
};

// ------------------------------------------------------------------ 7. California fee tiers

export const caFeeTiers: { appliesTo: string; fee: number; citation: string }[] = (
  caStatewide?.fees?.filing_fee_tiers ?? []
).map((t: { applies_to: string; fee: number; citation: string }) => ({
  appliesTo: t.applies_to,
  fee: t.fee,
  citation: t.citation,
}));
export const caFeeSources: string[] = caStatewide?.fees?.filing_fee_sources ?? [];

// ------------------------------------------------------------------ 8. Fee waivers (count only)

export const feeWaiverStats = {
  withForm: states.filter((s) => s.fee_waiver_form).length,
  unconfirmed: states.filter((s) => s.fee_waiver_form && isU(s, "fee_waiver_form")).length,
  total: states.length,
};

// ------------------------------------------------------------------ 9. How we check: verification counts
// Counted from the data files: a "fact" is one filled-in field from the lists below. A fact is open when the
// row's `unverified` list names it (county lists can name a sub-field, e.g. "small_claims_advisor.provider").

const stateFactFields = [
  "court_name", "limit_individual", "limit_business", "filing_fee_min", "filing_fee_max", "who_can_sue",
  "lawyers_allowed", "appeal", "appeal_deadline_days", "e_filing", "fee_waiver_form", "fee_waiver_threshold",
  "service_methods", "self_help_url",
] as const;
const countyFactFields = [
  "court_name", "small_claims_page_url", "small_claims_locations", "self_help_center", "small_claims_advisor",
  "e_filing", "remote_hearings",
] as const;
const filled = (v: unknown) =>
  v != null && v !== "" && !(Array.isArray(v) && v.length === 0) && !(typeof v === "object" && !Array.isArray(v) && Object.keys(v as object).length === 0);

function factCounts<T extends { unverified?: string[] | null }>(rows: T[], fields: readonly string[]) {
  const tracked = rows.reduce((n, r) => n + fields.filter((f) => filled((r as Record<string, unknown>)[f])).length, 0);
  const open = rows.reduce((n, r) => n + (r.unverified?.length ?? 0), 0);
  const rowsOpen = rows.filter((r) => (r.unverified?.length ?? 0) > 0).length;
  return { tracked, open, confirmed: tracked - open, rows: rows.length, rowsOpen };
}

export const stateFacts = factCounts(states, stateFactFields);
export const countyFacts = factCounts(counties, countyFactFields);
export const countiesChecked: string = counties
  .map((c) => c.date_checked ?? "")
  .filter(Boolean)
  .sort()
  .at(-1) as string;

/** States with open (unverified) fields, for the "still open" list. */
export const statesOpen = states
  .filter((s) => (s.unverified?.length ?? 0) > 0)
  .map((s) => ({ abbr: s.abbr, state: s.state, slug: s.slug, fields: s.unverified.length }));

/** Re-check rounds, from the project's verification log (STATUS.md, rounds 2 and 3, November 2026). */
export const recheckRounds = {
  when: "November 2026",
  confirmed: 53 + 119 + 25, // round 2 states + round 3 states + round 3 CA counties
  corrected: 36 + 100 + 25,
};

/** Dated changes already enacted; each state's page has the law and its source. */
export const upcomingChanges = [
  { date: "2027-01-01", abbr: "GA", what: "Limit rises from $15,000 to $25,000 (HB 999)." },
  { date: "2027-01-01", abbr: "WI", what: "Limit rises from $10,000 to $15,000 (2025 Wis. Act 105)." },
  { date: "2027-01-01", abbr: "SC", what: "Filing fee goes from $70 to $105 (2026 Act No. 155)." },
  { date: "2027-01-01", abbr: "RI", what: "Entry fee and counterclaim cap change (P.L. 2026, ch. 323)." },
  { date: "2030-01-01", abbr: "UT", what: "Limit rises from $20,000 to $25,000 (built into § 78A-8-102)." },
].map((c) => {
  const s = states.find((x) => x.abbr === c.abbr)!;
  return { ...c, state: s.state, slug: s.slug };
});

/** The yearly upkeep plan (docs/plan.md). */
export const upkeep = [
  { when: "March–April", what: "Fee-waiver income tables, after the new federal poverty guidelines." },
  { when: "June", what: "Scan each state's new laws for small claims changes; re-check before July 1." },
  { when: "December", what: "Full re-check of all 51: limits, fees, appeals, e-filing, self-help links. Update for January 1." },
  { when: "Every quarter", what: "Check every source link for dead pages." },
  { when: "Any time", what: "Fix reported errors, re-date the fact and note the change." },
];

/** True when any limit, filing fee, appeal or lawyer rule is still marked unverified. */
export const coreOpen = states.some((s) =>
  isU(s, "limit_individual", "limit_business", "filing_fee_min", "filing_fee_max", "appeal", "appeal_who", "appeal_deadline_days", "lawyers_allowed"),
);

// ------------------------------------------------------------------ Upcoming rule changes (home page)
// Dated changes already enacted but not yet in effect. Limits come from limitChanges (scheduled);
// fee changes are read by hand from each state's `recent_changes` (verified, see research/verification).
export interface UpcomingChange {
  abbr: string;
  state: string;
  slug: string;
  effective: string; // ISO date
  kind: "Limit" | "Filing fee";
  from: string;
  to: string;
  note?: string;
}
const feeChanges = [
  { abbr: "RI", effective: "2027-01-01", from: "$75.75", to: "$75", note: "One flat fee instead of $55 plus add-ons." },
  { abbr: "SC", effective: "2027-01-01", from: "$70", to: "$105" },
];
// Home page rows (structured before/after amounts). About uses `upcomingChanges` above, which carries the law citations.
export const upcomingRows: UpcomingChange[] = [
  ...limitChanges
    .filter((c) => c.scheduled)
    .map((c) => ({ abbr: c.abbr, effective: c.effective, kind: "Limit" as const, from: usd(c.from), to: usd(c.to), note: undefined })),
  ...feeChanges.map((f) => ({ ...f, kind: "Filing fee" as const })),
]
  .map((c) => {
    const st = states.find((x) => x.abbr === c.abbr)!;
    return { ...c, state: st.state, slug: st.slug };
  })
  .sort((a, b) => a.effective.localeCompare(b.effective) || a.state.localeCompare(b.state));
