/**
 * "Is it worth it?" math — framework-free, reusable. Pure function, no storage.
 *
 * The model is deliberately simple and shown to the reader line by line:
 *   expected back = P(win) × P(collect | win) × (amount you can claim + costs added to judgment)
 *   net           = expected back − money you spend up front − value of your time
 * Every probability is the reader's own estimate; we only supply researched defaults and ranges.
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

export interface WorthItResult {
  claimable: number;
  overLimitBy: number;
  upfront: number;
  timeCost: number;
  expectedBack: number;
  net: number;
  breakEvenCollect: number | null; // collection odds needed to break even, 0–1, null if impossible
  warnings: string[];
  verdict: "likely_worth_it" | "close_call" | "likely_not_worth_it";
}

export function worthIt(i: WorthItInput): WorthItResult {
  const warnings: string[] = [];
  const amount = Math.max(0, i.amountOwed);
  const overLimitBy = i.limit != null && amount > i.limit ? amount - i.limit : 0;
  const claimable = i.limit != null ? Math.min(amount, i.limit) : amount;

  if (overLimitBy > 0) {
    warnings.push(
      `Your claim is ${fmt(overLimitBy)} over this court's limit. In small claims you can usually only win up to ${fmt(
        i.limit!,
      )} and you give up the rest for good. The other choice is regular civil court, which is slower and more formal.`,
    );
  }
  if (i.limit == null) warnings.push("We don't have a verified limit for this court yet, so we can't check it.");

  const upfront = Math.max(0, i.filingFee) + Math.max(0, i.serviceCost) + Math.max(0, i.otherCosts);
  const timeCost = Math.max(0, i.hours) * Math.max(0, i.hourlyValue);
  const recoverable = i.costsRecoverable ? Math.max(0, i.filingFee) + Math.max(0, i.serviceCost) : 0;
  const pWin = clamp01(i.chanceWin);
  const pCol = clamp01(i.chanceCollect);

  const expectedBack = pWin * pCol * (claimable + recoverable);
  const net = expectedBack - upfront - timeCost;

  const perfectCollectValue = pWin * (claimable + recoverable);
  const breakEvenCollect = perfectCollectValue > 0 ? (upfront + timeCost) / perfectCollectValue : null;

  if (pCol < 0.35)
    warnings.push(
      "With collection odds this low, winning may mostly get you a piece of paper. Check whether the other side has a job, a bank account you know about, or property before you file.",
    );
  if (claimable > 0 && upfront > claimable * 0.25)
    warnings.push("Court costs are more than a quarter of what you can win. Consider a demand letter or mediation first.");

  const ratio = upfront + timeCost > 0 ? expectedBack / (upfront + timeCost) : Infinity;
  const verdict = net > 0 && ratio >= 1.5 ? "likely_worth_it" : net < 0 && ratio < 0.9 ? "likely_not_worth_it" : "close_call";

  return { claimable, overLimitBy, upfront, timeCost, expectedBack, net, breakEvenCollect, warnings, verdict };
}

function clamp01(x: number): number {
  return Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0;
}

export function fmt(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
