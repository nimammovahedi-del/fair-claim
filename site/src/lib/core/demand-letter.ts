/**
 * Demand-letter builder — framework-free, no dependencies, reusable in other projects.
 * Pure function: answers in, structured letter out. It never stores or sends anything.
 *
 * Wording rules (keep when editing):
 *  - Calm and factual. No threats of arrest, criminal charges, or reporting to anyone
 *    (that can be illegal, and it weakens the letter in front of a judge).
 *  - Only mention court as the next step the sender is actually allowed to take.
 *  - State-specific legal lines are passed in by the caller from cited data (`legalNotes`),
 *    never hard-coded here.
 */

import { addCalendarDays, formatLongDate, type ISODate } from "./deadlines";

export type DisputeKind = "security_deposit" | "consumer_refund" | "unpaid_invoice" | "property_damage" | "other";

export interface Party {
  name: string;
  addressLines: string[]; // street, city/state/ZIP …
  email?: string;
  phone?: string;
}

export interface DemandLetterInput {
  kind: DisputeKind;
  sender: Party;
  recipient: Party;
  letterDate: ISODate;
  amount: number;
  /** Short description of the thing in dispute: rental address, invoice number, service, item… */
  subjectDetail: string;
  /** Date of the key event: move-out, purchase, invoice due date, damage. */
  eventDate?: ISODate;
  /** The sender's own words about what happened. Kept as written. */
  facts: string;
  /** How long to give them, in calendar days (commonly 10–14). */
  responseDays: number;
  paymentMethods?: string;
  /** e.g. "small claims court in Alameda County". */
  courtPhrase?: string;
  /** Cited, state-specific sentences from data (e.g. deposit-return deadline). */
  legalNotes?: string[];
  /** Note an offer to talk/mediate, which courts like to see. */
  offerToDiscuss?: boolean;
}

export interface DemandLetter {
  heading: string[]; // sender block + date + recipient block
  subject: string;
  salutation: string;
  paragraphs: string[];
  closing: string[];
  deadline: ISODate;
  /** Plain-text version for copy/paste. */
  text: string;
}

export function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

const SUBJECTS: Record<DisputeKind, (i: DemandLetterInput) => string> = {
  security_deposit: (i) => `Demand for return of security deposit — ${i.subjectDetail}`,
  consumer_refund: (i) => `Demand for refund — ${i.subjectDetail}`,
  unpaid_invoice: (i) => `Demand for payment — ${i.subjectDetail}`,
  property_damage: (i) => `Demand for payment for property damage — ${i.subjectDetail}`,
  other: (i) => `Demand for payment — ${i.subjectDetail}`,
};

function opening(i: DemandLetterInput): string {
  const amt = formatMoney(i.amount);
  const when = i.eventDate ? formatLongDate(i.eventDate) : null;
  switch (i.kind) {
    case "security_deposit":
      return `I am writing about my security deposit for ${i.subjectDetail}. ${
        when ? `I moved out on ${when}. ` : ""
      }I am asking you to return ${amt} of my deposit.`;
    case "consumer_refund":
      return `I am writing about ${i.subjectDetail}${when ? `, which I paid for on ${when}` : ""}. I am asking for a refund of ${amt}.`;
    case "unpaid_invoice":
      return `I am writing about ${i.subjectDetail}${when ? `, which was due on ${when}` : ""}. The balance of ${amt} has not been paid.`;
    case "property_damage":
      return `I am writing about damage to my property: ${i.subjectDetail}${when ? `, which happened on ${when}` : ""}. I am asking you to pay ${amt} to cover the cost.`;
    default:
      return `I am writing about ${i.subjectDetail}. I am asking you to pay ${amt}.`;
  }
}

export function buildDemandLetter(i: DemandLetterInput): DemandLetter {
  const deadline = addCalendarDays(i.letterDate, i.responseDays);
  const amt = formatMoney(i.amount);

  const senderBlock = [i.sender.name, ...i.sender.addressLines, i.sender.phone, i.sender.email].filter(
    (x): x is string => !!x && x.trim() !== "",
  );
  const recipientBlock = [i.recipient.name, ...i.recipient.addressLines].filter((x) => x.trim() !== "");

  const paragraphs: string[] = [opening(i)];
  if (i.facts.trim()) paragraphs.push(i.facts.trim());
  for (const note of i.legalNotes ?? []) if (note.trim()) paragraphs.push(note.trim());

  paragraphs.push(
    `Please pay ${amt} by ${formatLongDate(deadline)}.` +
      (i.paymentMethods?.trim() ? ` You can pay by ${i.paymentMethods.trim()}.` : ""),
  );

  if (i.offerToDiscuss !== false) {
    paragraphs.push(
      "I would prefer to settle this without going to court. If you disagree with any part of this, please contact me before that date so we can try to work it out.",
    );
  }

  paragraphs.push(
    `If I do not receive payment or hear from you by then, I intend to file a claim${
      i.courtPhrase?.trim() ? ` in ${i.courtPhrase.trim()}` : " in small claims court"
    } to recover the full amount, plus court costs allowed by law.`,
  );

  const closing = ["Sincerely,", "", "", i.sender.name];
  const subject = SUBJECTS[i.kind](i);
  const salutation = `Dear ${i.recipient.name || "Sir or Madam"}:`;
  const heading = [...senderBlock, "", formatLongDate(i.letterDate), "", ...recipientBlock];

  const text = [
    ...heading,
    "",
    `Re: ${subject}`,
    "",
    salutation,
    "",
    ...paragraphs.flatMap((p) => [p, ""]),
    ...closing,
  ].join("\n");

  return { heading, subject, salutation, paragraphs, closing, deadline, text };
}
