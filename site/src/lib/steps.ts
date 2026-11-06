// The five-step path. General guidance only; state pages carry the cited, state-specific rules.
// Keep the voice calm and candid: say what usually happens, including the parts that go wrong.

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
    short: "A clear demand letter settles many disputes and shows the judge you tried.",
    time: "1 hour to write · usually 10–14 days to wait",
    cost: "Postage, ideally with tracking",
    body: [
      "Before you sue, ask once more — in writing, with a deadline. A calm letter that states the amount, the reason, and the date you'll file is often enough to get paid, because the other side now knows you're serious.",
      "Some states, including California, expect you to have asked for payment before you file, and the claim form asks whether you did. Even where it isn't required, judges notice who tried to settle.",
    ],
    doThis: [
      "State the exact amount and how you got it (receipts, invoice, deposit amount minus fair deductions).",
      "Give a specific deadline, usually 10–14 days.",
      "Send it in a way you can prove: certified mail, or email plus regular mail. Keep a copy.",
    ],
    mistakes: [
      "Threatening criminal charges or public shaming. It can be illegal and it hurts you in court.",
      "Asking for more than you can show. Keep the number defensible.",
    ],
  },
  {
    n: 2,
    slug: "file",
    title: "File your claim",
    short: "Fill out the court's claim form, file it in the right place, and pay the fee — or ask for a waiver.",
    time: "1–2 hours · hearing usually set weeks to a few months out",
    cost: "Filing fee (varies by state and amount) — waivable if you qualify",
    body: [
      "Each state has its own claim form. You usually file in the county (or district) where the other side lives or does business, or where the deal was made or the damage happened. Your state page lists the rules and the official form.",
      "Use the other side's correct legal name. For a business, look it up with your state's Secretary of State business search, or you may win a judgment against a name that can't be collected from.",
    ],
    doThis: [
      "Check the limit. If you're owed more, you may have to give up the extra or use regular civil court.",
      "Check the deadline to sue (the statute of limitations) for your type of claim.",
      "If money is tight, ask the clerk for the fee-waiver form before you pay.",
    ],
    mistakes: [
      "Suing an individual employee instead of the business, or the wrong company name.",
      "Filing in the wrong county, which can get the case dismissed or moved.",
    ],
  },
  {
    n: 3,
    slug: "serve",
    title: "Serve the papers",
    short: "The other side must be officially notified, in a way the court accepts, before the hearing.",
    time: "Must be done a set number of days before the hearing",
    cost: "Certified mail by the clerk, a sheriff, or a process server — a few dollars to about $100",
    body: [
      "'Service' is how the court knows the other side was told about the case. In most states you can't hand the papers over yourself; an adult who isn't part of the case, a sheriff, a process server, or the clerk (by certified mail) does it, depending on the state.",
      "After service, someone usually files a 'proof of service' form. If service isn't done right and on time, the hearing gets postponed — or the judgment can be undone later.",
    ],
    doThis: [
      "Find out your state's allowed methods and the deadline before the hearing (see your state page).",
      "Get a home or business address where the person can actually be found.",
      "File the proof of service with the court before the hearing.",
    ],
    mistakes: [
      "Serving the papers yourself when your state doesn't allow it.",
      "Leaving it until the last week before the hearing.",
    ],
  },
  {
    n: 4,
    slug: "hearing",
    title: "Go to the hearing",
    short: "Short, informal, and decided by a judge or commissioner. Bring proof, not just your story.",
    time: "Often 10–20 minutes in front of the judge, plus waiting",
    cost: "Usually a day off work",
    body: [
      "Small claims hearings are short. The judge reads the claim, hears each side, looks at evidence, and decides — sometimes on the spot, often by mail. In many states lawyers can't represent either side, so you'll speak for yourself.",
      "If the other side doesn't show up, you can usually still win by default, but you may need to prove the amount. Some courts offer free mediation the same day; it's worth considering, because an agreement the other side helped write is more likely to be paid.",
    ],
    doThis: [
      "Bring three copies of everything: contract, photos, texts, receipts, a one-page timeline.",
      "Practice a two-minute summary: what was agreed, what happened, what you're owed, and how you got the number.",
      "Ask witnesses to come, or bring signed written statements if your court accepts them.",
    ],
    mistakes: [
      "Arguing about fairness instead of showing the agreement and the damage.",
      "Not asking for court costs to be added to the judgment.",
    ],
  },
  {
    n: 5,
    slug: "collect",
    title: "Collect what you won",
    short: "Winning gets you a judgment, not a check. This is where many people get stuck.",
    time: "Weeks to years",
    cost: "More fees for each collection tool — often added to what they owe",
    body: [
      "The court doesn't collect for you. After any appeal period runs out, you ask for payment. If the other side doesn't pay, you use legal tools: a court-ordered statement of their assets or an exam in court, a wage garnishment, a bank levy, or a lien on property.",
      "Be realistic. Studies and surveys suggest a large share of winners never collect in full, especially when the other side has no job, no bank account you can find, or no property. People with low incomes are protected: a big part of wages and many public benefits can't be taken.",
    ],
    doThis: [
      "Before you file, ask: does the other side have a job, a business, a bank account, or property?",
      "After the appeal period, send a polite written request for payment with the judgment attached.",
      "Keep records of every payment, and file the form saying the judgment is paid once it is.",
    ],
    mistakes: [
      "Assuming the court will make them pay.",
      "Letting the judgment expire. Most judgments last years but must be renewed.",
    ],
  },
];
