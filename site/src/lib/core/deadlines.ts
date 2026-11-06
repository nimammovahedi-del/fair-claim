/**
 * Deadline helpers — framework-free, no dependencies, safe to reuse in other projects
 * (e.g. the government letter decoder). All dates are handled as calendar dates in UTC,
 * so "2026-11-05" never shifts a day because of the reader's time zone.
 *
 * This is date arithmetic only. The legal rule (how many days, calendar vs. court days,
 * what starts the clock) must come from cited data, never be hard-coded here.
 */

export type ISODate = string; // "YYYY-MM-DD"

const DAY_MS = 86_400_000;

export function parseISODate(s: ISODate): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) throw new Error(`Not a YYYY-MM-DD date: ${s}`);
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCMonth() !== +m[2] - 1) throw new Error(`Invalid date: ${s}`);
  return d;
}

export function toISODate(d: Date): ISODate {
  return d.toISOString().slice(0, 10);
}

export function todayISO(now: Date = new Date()): ISODate {
  // The reader's local calendar date, expressed as an ISO date.
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addCalendarDays(date: ISODate, days: number): ISODate {
  return toISODate(new Date(parseISODate(date).getTime() + days * DAY_MS));
}

/** Adds whole years; Feb 29 + 1 year lands on Feb 28. */
export function addYears(date: ISODate, years: number): ISODate {
  const d = parseISODate(date);
  const target = new Date(Date.UTC(d.getUTCFullYear() + years, d.getUTCMonth(), 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d.getUTCDate(), lastDay));
  return toISODate(target);
}

export function isWeekend(date: ISODate): boolean {
  const day = parseISODate(date).getUTCDay();
  return day === 0 || day === 6;
}

/**
 * Adds court/business days, skipping weekends and any holidays passed in.
 * Holidays vary by state and year, so callers supply them from data.
 */
export function addBusinessDays(date: ISODate, days: number, holidays: ISODate[] = []): ISODate {
  const skip = new Set(holidays);
  let cur = date;
  let left = Math.abs(days);
  const step = days >= 0 ? 1 : -1;
  while (left > 0) {
    cur = addCalendarDays(cur, step);
    if (!isWeekend(cur) && !skip.has(cur)) left--;
  }
  return cur;
}

/** If a deadline lands on a weekend/holiday, many rules roll it to the next court day. */
export function rollForwardToBusinessDay(date: ISODate, holidays: ISODate[] = []): ISODate {
  const skip = new Set(holidays);
  let cur = date;
  while (isWeekend(cur) || skip.has(cur)) cur = addCalendarDays(cur, 1);
  return cur;
}

export function daysBetween(from: ISODate, to: ISODate): number {
  return Math.round((parseISODate(to).getTime() - parseISODate(from).getTime()) / DAY_MS);
}

export type DeadlineStatus = "passed" | "today" | "soon" | "upcoming";

export interface DeadlineInfo {
  date: ISODate;
  daysLeft: number;
  status: DeadlineStatus;
}

export function describeDeadline(date: ISODate, today: ISODate, soonDays = 30): DeadlineInfo {
  const daysLeft = daysBetween(today, date);
  const status: DeadlineStatus =
    daysLeft < 0 ? "passed" : daysLeft === 0 ? "today" : daysLeft <= soonDays ? "soon" : "upcoming";
  return { date, daysLeft, status };
}

/** A limitation period expressed in data, e.g. { years: 4, citation: "Cal. Code Civ. Proc. § 337" }. */
export interface LimitationRule {
  label: string;
  years?: number;
  days?: number;
  citation: string;
  note?: string;
}

/**
 * Last day to file under a limitation rule. This is a rough guide only: tolling,
 * discovery rules and contract terms can change the real answer, so the UI must say so.
 */
export function limitationDeadline(eventDate: ISODate, rule: LimitationRule): ISODate {
  let d = eventDate;
  if (rule.years) d = addYears(d, rule.years);
  if (rule.days) d = addCalendarDays(d, rule.days);
  return d;
}

export function formatLongDate(date: ISODate, locale = "en-US"): string {
  return parseISODate(date).toLocaleDateString(locale, {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
