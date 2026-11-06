// Optional, cited state-law sentences the demand-letter tool can add, keyed by state slug.
// Only add a note when its rule is confirmed against the statute; mark anything else unverified.
export interface LetterNote {
  id: string;
  kinds: string[]; // dispute kinds this applies to
  text: string;
  citation: string;
  url: string;
  unverified?: boolean;
}

const CIV_1950_5 = "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1950.5";

export const letterNotes: Record<string, LetterNote[]> = {
  ca: [
    {
      id: "ca-deposit-21-days",
      kinds: ["security_deposit"],
      text: "California law requires a landlord to return the security deposit, minus any lawful deductions listed in an itemized statement, within 21 days after the tenant moves out (Civil Code § 1950.5(h)(1)).",
      citation: "Cal. Civ. Code § 1950.5(h)(1)",
      url: CIV_1950_5,
    },
    {
      id: "ca-deposit-bad-faith",
      kinds: ["security_deposit"],
      text: "If a landlord keeps a deposit in bad faith, a court may award up to twice the amount of the deposit in addition to the amount owed (Civil Code § 1950.5(m)).",
      citation: "Cal. Civ. Code § 1950.5(m)",
      url: CIV_1950_5,
    },
  ],
};
