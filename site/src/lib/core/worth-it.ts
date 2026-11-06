/**
 * Small claims cost-and-recovery math — framework-free, reusable. Pure functions, no storage.
 *
 * The model is deliberately simple and shown to the reader line by line:
 *   expected back = P(win) × P(collect | win) × (amount you can claim + costs added to judgment)
 *   net           = expected back − money you spend up front − value of your time
 * Every probability is the reader's own estimate; we only supply researched defaults and ranges.
 *
 * Wording rule: describe what the numbers show, never whether someone "should" sue.
 * Display `outcomeLabel` and `caveats`. `verdict` is kept only so older callers keep compiling.
 */

export interface WorthItInput {
  amountOwed: number;
  /** Small claims limit that applies to this plaintiff (individual vs. business); null = unknown. */
  limit: number | null;
  filingFee: number;
  serviceCost: number;
  otherCosts: number;
  /** 0–1 */
  chanceWin: number;
  /** 0–1, chance of collecting at least the judgment, given a win. */
  chanceCollect: number;
  /** Whether filing/service fees are typically added to the judgment if you win. */
  costsRecoverable: boolean;
  hours: number;
  hourlyValue: number;
}

/** Neutral description of how expected recovery compares with costs. */
export type WorthItOutcome = "costs_exceed_recovery" | "roughly_even" | "recovery_exceeds_costs";

export const OUTCOME_LABELS: Record<WorthItOutcome, string> = {
  costs_exceed_recovery: "Costs likely outweigh expected recovery",
  roughly_even: "Roughly break-even",
  recovery_exceeds_costs: "Expected recovery exceeds costs",
};

/** Caveats that apply to every result. Show them every time, not only when something looks off. */
export const WORTH_IT_CAVEATS: string[] = [
  "This is arithmetic on your own estimates. It does not predict what a judge will decide.",
  "“Expected” means the average over many cases like yours. A single case either pays or it doesn't.",
  "Winning gets you a court judgment, not a payment. Collecting is up to you.",
  "The person you sue may be able to file a claim against you in the same case, so you could end up owing money.",
  "Some costs don't fit in a number: stress, time away from work or family, and the relationship with the other side.",
];

export interface WorthItResult {
  claimable: number;
  overLimitBy: number;
  upfront: number;
  timeCost: number;
  /** Fees that would be added to the judgment if you win (0 when not recoverable). */
  recoverable: number;
  expectedBack: number;
  net: number;
  /** expectedBack ÷ (upfront + timeCost). Infinity when there are no costs but something to gain. */
  ratio: number;
  breakEvenCollect: number | null; // collection odds needed to break even, 0–1, null if impossible
  warnings: string[];
  outcome: WorthItOutcome;
  outcomeLabel: string;
  caveats: string[];
  /** @deprecated Judgment-style label kept for backward compatibility. Display `outcomeLabel` instead. */
  verdict: "likely_worth_it" | "close_call" | "likely_not_worth_it";
}

export function worthIt(i: WorthItInput): WorthItResult {
  const warnings: string[] = [];
  const amount = pos(i.amountOwed);
  const overLimitBy = i.limit != null && amount > i.limit ? amount - i.limit : 0;
  const claimable = i.limit != null ? Math.min(amount, i.limit) : amount;

  if (overLimitBy > 0) {
    warnings.push(
      `Your claim is ${fmt(overLimitBy)} over this court's limit. In small claims you can usually win no more than ${fmt(
        i.limit!,
      )}, and you give up the rest for good. The other route is regular civil court, which is slower and more formal.`,
    );
  }
  if (i.limit == null) warnings.push("We don't have a confirmed limit for this court yet, so we can't check your amount against it.");

  const fee = pos(i.filingFee);
  const service = pos(i.serviceCost);
  const upfront = fee + service + pos(i.otherCosts);
  const timeCost = pos(i.hours) * pos(i.hourlyValue);
  const recoverable = i.costsRecoverable ? fee + service : 0;
  const pWin = clamp01(i.chanceWin);
  const pCol = clamp01(i.chanceCollect);

  const expectedBack = pWin * pCol * (claimable + recoverable);
  const net = expectedBack - upfront - timeCost;

  const perfectCollectValue = pWin * (claimable + recoverable);
  const breakEvenCollect = perfectCollectValue > 0 ? (upfront + timeCost) / perfectCollectValue : null;

  if (pCol < 0.35)
    warnings.push(
      "With collection odds this low, a win may not turn into money. It can help to find out whether the other side has a job, a bank account you know about, or property.",
    );
  if (claimable > 0 && upfront > claimable * 0.25)
    warnings.push("Court costs are more than a quarter of what you could win. Some people try a demand letter or mediation before filing.");

  const costs = upfront + timeCost;
  const ratio = costs > 0 ? expectedBack / costs : expectedBack > 0 ? Infinity : 1;
  const outcome: WorthItOutcome = ratio < 0.9 ? "costs_exceed_recovery" : ratio > 1.2 ? "recovery_exceeds_costs" : "roughly_even";
  const verdict = net > 0 && ratio >= 1.5 ? "likely_worth_it" : net < 0 && ratio < 0.9 ? "likely_not_worth_it" : "close_call";

  return {
    claimable,
    overLimitBy,
    upfront,
    timeCost,
    recoverable,
    expectedBack,
    net,
    ratio,
    breakEvenCollect,
    warnings,
    outcome,
    outcomeLabel: OUTCOME_LABELS[outcome],
    caveats: WORTH_IT_CAVEATS.slice(),
    verdict,
  };
}

/** Field-level problems with raw inputs, for inline form errors. Keys match WorthItInput. */
export type WorthItErrors = Partial<Record<keyof WorthItInput, string>>;

/**
 * Checks raw numbers before calling worthIt(). Use null for an empty box and NaN for text that
 * isn't a number (parseAmount() returns exactly that). Returns {} when everything is usable.
 */
export function checkWorthItInput(i: Partial<Record<keyof WorthItInput, number | null>>): WorthItErrors {
  const e: WorthItErrors = {};
  const check = (k: keyof WorthItInput, label: string, example: string, max: number, required = false) => {
    const v = i[k];
    if (v == null) {
      if (required) e[k] = `Enter ${label}.`;
    } else if (Number.isNaN(v)) e[k] = `Enter ${label} as a number, like ${example}.`;
    else if (v < 0) e[k] = `This can't be a negative number.`;
    else if (required && v === 0) e[k] = `Enter ${label}. It needs to be more than $0.`;
    else if (v > max) e[k] = `That's more than ${max.toLocaleString("en-US")}. Check the number.`;
  };
  check("amountOwed", "the amount you're owed", "2,400", 10_000_000, true);
  check("filingFee", "the filing fee", "75", 100_000);
  check("serviceCost", "the cost of serving the papers", "40", 100_000);
  check("otherCosts", "other costs", "25", 1_000_000);
  check("hours", "the hours", "12", 2_000);
  check("hourlyValue", "what an hour is worth to you", "25", 10_000);
  return e;
}

/** Parses money or hours typed by a person: "$2,400", "2400.50", " 12 ". Empty → null. Not a number → NaN. */
export function parseAmount(raw: string): number | null {
  const s = raw.replace(/[$,\s]/g, "");
  if (s === "") return null;
  return /^-?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : NaN;
}

function pos(x: number): number {
  return Number.isFinite(x) ? Math.max(0, x) : 0;
}

function clamp01(x: number): number {
  return Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0;
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
