// Evidence on collecting small claims judgments, from research/collection/collection-research.md.
// There is no national or California dataset; courts generally don't track whether winners get paid.
// Every item keeps its source and whether we've confirmed it against the original.

export interface Evidence {
  stat: string;
  text: string;
  sourceLabel: string;
  url: string;
  unverified: boolean;
}

const denver: Evidence = {
  stat: "55%",
  text: "of winners in a study of Denver's small claims court never collected any part of their judgment. Overall, only 31% of the money awarded was ever paid.",
  sourceLabel: "Best et al., 21 Fordham Urb. L.J. 343 (1994)",
  url: "https://ir.lawnet.fordham.edu/ulj/vol21/iss2/4",
  unverified: false,
};

export const odds: { headline: Evidence; items: Evidence[] } = {
  headline: denver,
  items: [
    denver,
    {
      stat: "56% vs. 79%",
      text: "In a 2004 survey of 600 Michigan small claims plaintiffs, 56% of cases decided by a judge got full or partial payment, compared with 79% of mediated cases.",
      sourceLabel: "Donohue & Atkin (2004), via Resolution Systems Institute",
      url: "https://www.aboutrsi.org/library/district-court-small-claims-division-mediation-in-michigan-comparing-collection-rates-in-adjudicated-and-mediated-cases",
      unverified: false,
    },
    {
      stat: "≈ 2×",
      text: "In Maine small claims courts, defendants fully complied with mediated agreements at almost twice the rate of judgments imposed by a judge.",
      sourceLabel: "McEwen & Maiman, 18 Law & Society Review (1984)",
      url: "https://www.aboutrsi.org/library/mediation-in-small-claims-court-achieving-compliance-through-consent",
      unverified: false,
    },
    {
      stat: "≈ 2 in 3",
      text: "of small claims winners in three Maine counties didn't collect, according to a 2004 Sun Journal survey; local clerks estimated winners were paid a quarter to a third of the time.",
      sourceLabel: "Sun Journal (Lewiston, Me.), Aug. 22, 2004",
      url: "https://www.sunjournal.com/2004/08/22/small-claims-smaller-gains/",
      unverified: false,
    },
    {
      stat: "100,000+",
      text: "small claims cases were filed in Philadelphia from 2013 to 2018, most of them debt collection cases against individuals. Of the cases that reached a judgment, 95% were defaults.",
      sourceLabel: "Pew Charitable Trusts (2022)",
      url: "https://www.pew.org/en/research-and-analysis/reports/2022/10/how-debt-collection-works-in-philadelphias-municipal-court",
      unverified: false,
    },
  ],
};

// Presets for the calculator's "chance of collecting" slider. These are rough, labeled guides
// anchored on the studies above (about half of winners collect something) — not findings.
export const collectPresets = [
  { label: "Business or landlord with a bank account", value: 0.7 },
  { label: "Has a steady job", value: 0.6 },
  { label: "Not sure (studies: about half)", value: 0.45 },
  { label: "No job or assets I know of", value: 0.15 },
];
