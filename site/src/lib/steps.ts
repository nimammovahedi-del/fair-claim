// The five-step path, plus the "Before you decide" material that comes ahead of it.
// General information only; state pages carry the cited, state-specific rules.
//
// Voice: calm, candid and neutral. Say what usually happens, including the parts that go wrong.
// Don't cheer people on and don't promise outcomes. Suing is one option among several.
// Never add a legal fact here that isn't backed by the research/ folder; keep these general.

export interface Step {
  n: number;
  slug: string;
  title: string;
  short: string;
  time: string;
  cost: string;
  body: string[];
  doThis: string[];
  mistakes: string[];
}

export const steps: Step[] = [
  {
    n: 1,
    slug: "demand",
    title: "Ask for the money in writing",
    short: "Many disputes end with a clear written request. It also shows the judge you tried.",
    time: "About 1 hour to write, then usually 10–14 days to wait",
    cost: "Postage, ideally with tracking",
    body: [
      "Before filing, most people ask once more in writing, with a deadline. A calm letter that states the amount, the reason and the date gives the other side a clear chance to pay or to explain why they disagree.",
      "Some states, including California, expect you to have asked for payment before you file, and the claim form asks whether you did. Even where it isn't required, a written request is a record you can show the judge.",
    ],
    doThis: [
      "State the exact amount and how you got it (receipts, invoice, deposit amount minus fair deductions).",
      "Give a specific deadline, usually 10–14 days.",
      "Send it in a way you can prove: certified mail, or email plus regular mail. Keep a copy.",
    ],
    mistakes: [
      "Threatening criminal charges or public shaming. It can be illegal, and it hurts you in court.",
      "Asking for more than you can show. Keep the number to what your papers support.",
    ],
  },
  {
    n: 2,
    slug: "file",
    title: "File the claim",
    short: "Fill out the court's claim form, file it in the right place, and pay the fee or ask for a waiver.",
    time: "1–2 hours, then a hearing usually weeks to a few months away",
    cost: "A filing fee that depends on the state and the amount. You can ask for a waiver if you qualify.",
    body: [
      "Each state has its own claim form. You usually file in the county (or district) where the other side lives or does business, or where the deal was made or the damage happened. Your state page lists the rules and the official form.",
      "Use the other side's correct legal name. For a business, look it up with your state's Secretary of State business search. A judgment against the wrong name may not be collectible.",
    ],
    doThis: [
      "Check the limit. If you're owed more, you may have to give up the extra or use regular civil court.",
      "Check the deadline to sue (the statute of limitations) for your type of claim.",
      "If money is tight, ask the clerk for the fee-waiver form before you pay.",
    ],
    mistakes: [
      "Suing an individual employee instead of the business, or using the wrong company name.",
      "Filing in the wrong county, which can get the case dismissed or moved.",
    ],
  },
  {
    n: 3,
    slug: "serve",
    title: "Serve the papers",
    short: "The other side must be officially told about the case, in a way the court accepts, before the hearing.",
    time: "Must be done a set number of days before the hearing",
    cost: "From a few dollars (certified mail by the clerk) to about $100 (sheriff or process server)",
    body: [
      "“Service” is how the court knows the other side was told about the case. In most states you can't hand the papers over yourself. Depending on the state, an adult who isn't part of the case, a sheriff, a process server or the clerk (by certified mail) does it.",
      "After service, someone usually files a “proof of service” form. If service isn't done right and on time, the hearing gets postponed, or the judgment can be undone later.",
    ],
    doThis: [
      "Find out your state's allowed methods and the deadline before the hearing (see your state page).",
      "Get a home or business address where the person can actually be found.",
      "File the proof of service with the court before the hearing.",
    ],
    mistakes: ["Serving the papers yourself when your state doesn't allow it.", "Leaving it until the last week before the hearing."],
  },
  {
    n: 4,
    slug: "hearing",
    title: "Go to the hearing",
    short: "Short and informal, decided by a judge or commissioner. Proof matters more than the story.",
    time: "Often 10–20 minutes in front of the judge, plus waiting",
    cost: "Usually a day off work",
    body: [
      "Small claims hearings are short. The judge reads the claim, hears each side, looks at the evidence and decides, sometimes on the spot and often by mail later. In many states lawyers can't represent either side, so each person speaks for themselves.",
      "If the other side doesn't show up, you can usually still get a judgment by default, but you may need to prove the amount. Some courts offer free mediation the same day. Studies of small claims courts found that mediated agreements were paid more often than judgments.",
    ],
    doThis: [
      "Bring three copies of everything: contract, photos, texts, receipts and a one-page timeline.",
      "Practice a two-minute summary: what was agreed, what happened, what you're owed and how you got the number.",
      "Ask witnesses to come, or bring signed written statements if your court accepts them.",
    ],
    mistakes: ["Arguing about fairness instead of showing the agreement and the damage.", "Not asking for court costs to be added to the judgment."],
  },
  {
    n: 5,
    slug: "collect",
    title: "Collect the judgment",
    short: "A judgment is not a check. Many winners never collect in full.",
    time: "Weeks to years",
    cost: "More fees for each collection tool, often added to what they owe",
    body: [
      "The court doesn't collect for you. After any appeal period runs out, you ask for payment. If the other side doesn't pay, there are legal tools: a court-ordered statement of their assets or an exam in court, a wage garnishment, a bank levy, or a lien on property.",
      "Studies and surveys suggest a large share of winners never collect in full, especially when the other side has no job, no bank account you can find, or no property. People with low incomes are protected: a big part of wages and many public benefits can't be taken.",
    ],
    doThis: [
      "Before you file, think about whether the other side has a job, a business, a bank account or property.",
      "After the appeal period, send a polite written request for payment with the judgment attached.",
      "Keep records of every payment, and file the form saying the judgment is paid once it is.",
    ],
    mistakes: ["Assuming the court will make them pay.", "Letting the judgment expire. Most judgments last years but must be renewed."],
  },
];

// ------------------------------------------------------------------ Before you decide
// Options other than suing. Described generally on purpose: which agency handles what varies by
// state and by trade, and we don't have cited, state-by-state sources for these yet.
export interface Option {
  title: string;
  text: string;
}

export const alternatives: Option[] = [
  {
    title: "Talk or negotiate",
    text: "A phone call or a meeting can settle things faster than a court date. Some people offer to accept part of the amount, or to be paid in installments. Put any agreement in writing.",
  },
  {
    title: "Send a demand letter",
    text: "A clear written request with a deadline. Many disputes end here, and if they don't, the letter is a record that you asked.",
  },
  {
    title: "Mediation",
    text: "A neutral person helps both sides reach their own agreement. Many courts and community programs offer it free or at low cost, before or instead of a hearing.",
  },
  {
    title: "A complaint to a regulator",
    text: "If the other side needs a state license for their work, the agency that issues it may take complaints. Your state attorney general's consumer protection office also takes complaints about businesses. They don't always get your money back, but some businesses respond to them.",
  },
  {
    title: "Insurance or a card dispute",
    text: "For damage to a car or home, your own insurance or the other side's may cover it. If you paid by credit card, ask the card company whether you can dispute the charge.",
  },
  {
    title: "Let it go",
    text: "Sometimes the time, cost and stress of chasing the money are more than the money. Writing it off is a reasonable choice, too.",
  },
];

// The non-money costs of a small claims case. General, not state-specific.
export const hiddenCosts: string[] = [
  "Time: preparing papers and evidence, arranging service, a half or full day at court, and sometimes months of collection work afterward.",
  "Stress: facing the other side in person, waiting for a decision, and the chance of losing.",
  "Relationships: suing a neighbor, landlord, relative or former client usually ends the relationship.",
  "Money you may not get back: filing and service fees, time off work, and collection fees if they don't pay.",
];
