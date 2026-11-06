// Plain-language glossary of small claims words.
//
// - `def`: one or two plain sentences that hold true in most states. General information, not advice.
// - `ca`: an optional California note. Only add one when research/california/statewide.json or
//   research/collection/collection-research.md supports it, and cite that source.
// - `related`: slugs of other entries (checked at build time by the glossary page).
// - Slugs are permanent: pages link to /glossary/#<slug> and the <Term> component looks them up here.

export interface GlossaryCite {
  label: string;
  url: string;
}

export interface GlossaryEntry {
  slug: string;
  term: string;
  aka?: string[];
  def: string;
  cite?: GlossaryCite; // for a general fact that needs a source
  ca?: { text: string; cite: GlossaryCite };
  related?: string[];
}

export const glossaryChecked = "2026-11-05";

const leg = (law: string, sec: string) =>
  `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${law}&sectionNum=${sec}`;
const form = (id: string) => `https://www.courts.ca.gov/documents/${id}.pdf`;

const entries: GlossaryEntry[] = [
  {
    slug: "abstract-of-judgment",
    term: "Abstract of judgment",
    def: "A short court document that summarizes a judgment. Recording it with a county office creates a lien on real estate the debtor owns in that county.",
    ca: {
      text: "Form EJ-001. Recording it creates a lien on the debtor's real property in that county that lasts 10 years from the judgment and can be renewed. The court fee is $40, plus the county recorder's fee. It can't be issued during the 30 days after judgment while the appeal period runs.",
      cite: { label: "CCP 697.310; CCP 116.810; Statewide Civil Fee Schedule", url: leg("CCP", "697.310") },
    },
    related: ["lien", "judgment-creditor", "writ-of-execution"],
  },
  {
    slug: "appeal",
    term: "Appeal",
    def: "Asking a higher court to change a decision. In small claims, who may appeal, how long they have, and whether the appeal is a brand-new trial differ a lot from state to state, and some states allow no appeal at all.",
    ca: {
      text: "Only the side ordered to pay can appeal: a plaintiff can't appeal a loss on their own claim. File form SC-140 within 30 days after the clerk mails or hands over the Notice of Entry of Judgment. The fee is $75.",
      cite: { label: "CCP 116.710, 116.750; CCP 116.760", url: leg("CCP", "116.710") },
    },
    related: ["trial-de-novo", "notice-of-entry-of-judgment", "motion-to-vacate"],
  },
  {
    slug: "assignee",
    term: "Assignee",
    aka: ["Debt buyer"],
    def: "A person or company that has taken over someone else's right to be paid. Debt buyers are assignees: they buy old debts and then try to collect them, sometimes by suing.",
    ca: {
      text: "Assignees generally can't sue in California small claims. A plaintiff must be the original owner of the claim, with two narrow exceptions.",
      cite: { label: "SC-100-INFO (Rev. Jan. 1, 2024)", url: form("sc100info") },
    },
    related: ["plaintiff", "claim"],
  },
  {
    slug: "bank-levy",
    term: "Bank levy",
    def: "A collection step where a sheriff or other officer orders a bank to hand over money from the debtor's account to pay a judgment. Some money is protected and can't be taken.",
    ca: {
      text: "A set amount in the debtor's accounts is protected automatically, without filing a claim: $2,325 per debtor from July 1, 2026. The sheriff's fee set by statute is $50. You need a writ of execution first.",
      cite: { label: "CCP 704.220; form EJ-156 (Rev. July 20, 2026)", url: form("ej156") },
    },
    related: ["exemption", "writ-of-execution", "wage-garnishment"],
  },
  {
    slug: "claim",
    term: "Claim",
    def: "Your written request asking the court to order someone to pay you (or return property), with the amount and the reason. Filing it starts the case.",
    ca: {
      text: "The claim form is SC-100, signed under oath.",
      cite: { label: "Form SC-100 (Rev. Jan. 1, 2026)", url: form("sc100") },
    },
    related: ["plaintiff", "filing-fee", "small-claims-limit", "counterclaim"],
  },
  {
    slug: "continuance",
    term: "Continuance",
    aka: ["Postponement"],
    def: "Moving the hearing to a later date. Courts usually want a written request made well before the hearing, and a good reason.",
    ca: {
      text: "Ask on form SC-150 at least 10 days before the hearing unless the court finds good cause for a later request. There is a $10 fee once the defendant has been served on time.",
      cite: { label: "CCP 116.570", url: leg("CCP", "116.570") },
    },
    related: ["hearing", "service-of-process"],
  },
  {
    slug: "costs",
    term: "Court costs",
    def: "Fees you paid to bring the case, such as the filing fee and the cost of serving papers. The winner can often ask to have them added to the judgment.",
    ca: {
      text: "The winner is entitled to costs, including the cost of serving the defendant, and later to the costs of enforcing the judgment.",
      cite: { label: "CCP 116.610(g); CCP 116.820(c)", url: leg("CCP", "116.610") },
    },
    related: ["filing-fee", "judgment"],
  },
  {
    slug: "counterclaim",
    term: "Counterclaim",
    aka: ["Defendant's claim"],
    def: "A claim the defendant files against the plaintiff in the same case. The judge usually decides both claims at the same hearing.",
    ca: {
      text: "Called a defendant's claim (form SC-120). It has the same limits as a plaintiff's claim and must be served on the plaintiff at least 5 days before the hearing (1 day if the defendant was served 10 days or less before it).",
      cite: { label: "CCP 116.360", url: leg("CCP", "116.360") },
    },
    related: ["defendant", "claim", "small-claims-limit"],
  },
  {
    slug: "debtors-examination",
    term: "Debtor's examination",
    aka: ["Judgment debtor exam"],
    def: "A court hearing where the person who owes a judgment must answer questions under oath about their income, bank accounts and property, so the winner can find something to collect from.",
    ca: {
      text: "Request it on form SC-134. The filing fee is $60, and the order must be personally served at least 30 days before the exam. Separately, an unpaid debtor must send the winner a Statement of Assets (SC-133) within 30 days after notice of the judgment is mailed.",
      cite: { label: "Form SC-134; CCP 116.830; Statewide Civil Fee Schedule", url: form("sc134") },
    },
    related: ["judgment-debtor", "judgment-creditor", "writ-of-execution"],
  },
  {
    slug: "default-judgment",
    term: "Default judgment",
    def: "A judgment against a side that didn't respond or didn't come to the hearing. It's usually for the plaintiff, and it counts the same as any other judgment.",
    ca: {
      text: "Even when the defendant doesn't appear, the plaintiff still has to present evidence that proves the claim.",
      cite: { label: "CCP 116.520(b)", url: leg("CCP", "116.520") },
    },
    related: ["judgment", "motion-to-vacate", "service-of-process"],
  },
  {
    slug: "defendant",
    term: "Defendant",
    def: "The person or business being sued.",
    related: ["plaintiff", "counterclaim", "service-of-process"],
  },
  {
    slug: "demand-letter",
    term: "Demand letter",
    def: "A letter asking for payment before you sue. It states the amount, the reason and a deadline. It often settles the dispute, and it shows the judge you tried.",
    ca: {
      text: "The claim form asks whether you asked the defendant to pay before suing, where that was possible. In person or by phone also counts, but a letter leaves a record.",
      cite: { label: "CCP 116.320(b); form SC-100 item 4", url: leg("CCP", "116.320") },
    },
    related: ["claim", "mediation"],
  },
  {
    slug: "dismissal",
    term: "Dismissal",
    def: "Ending a case without a decision for either side, for example because the plaintiff withdrew it or the papers were never served. Some dismissals let you file again later; others don't.",
    ca: {
      text: "A plaintiff asks to dismiss on form CIV-110.",
      cite: { label: "Form CIV-110", url: form("civ110") },
    },
    related: ["service-of-process", "claim"],
  },
  {
    slug: "exemption",
    term: "Exemption",
    def: "A type or amount of money or property the law protects from collection, such as part of a paycheck, some money in a bank account, many public benefits, and some equity in a car or home.",
    cite: {
      label: "31 C.F.R. § 212.5 (federal benefits in bank accounts)",
      url: "https://www.ecfr.gov/current/title-31/subtitle-B/chapter-II/subchapter-A/part-212/section-212.5",
    },
    ca: {
      text: "Form EJ-156 lists the current amounts. For example, $8,625 of equity in a vehicle and $2,325 in bank accounts are protected (2026 figures).",
      cite: { label: "Form EJ-156 (Rev. July 20, 2026)", url: form("ej156") },
    },
    related: ["judgment-proof", "bank-levy", "wage-garnishment"],
  },
  {
    slug: "fee-waiver",
    term: "Fee waiver",
    def: "Permission to skip court fees because you can't afford them. You ask with the court's own form, usually when you file.",
    ca: {
      text: "Form FW-001. You qualify if you get certain public benefits, if your household income is at or below 200% of the federal poverty guidelines (raised from 125% on Jan. 1, 2026), or if paying would leave you unable to meet basic needs.",
      cite: { label: "Gov. Code 68632; form FW-001", url: leg("GOV", "68632") },
    },
    related: ["filing-fee", "costs"],
  },
  {
    slug: "filing-fee",
    term: "Filing fee",
    def: "What the court charges to start a case. It depends on the state, sometimes the county, and often the amount you claim.",
    ca: {
      text: "$30 for claims up to $1,500, $50 up to $5,000, $75 above that. $100 if you filed more than 12 small claims in California in the past 12 months.",
      cite: { label: "CCP 116.230", url: leg("CCP", "116.230") },
    },
    related: ["fee-waiver", "costs", "claim"],
  },
  {
    slug: "hearing",
    term: "Hearing",
    aka: ["Trial"],
    def: "The court date when each side tells its story and shows evidence to a judge, commissioner or magistrate. Small claims hearings are short and informal.",
    related: ["continuance", "default-judgment", "judgment"],
  },
  {
    slug: "interest",
    term: "Judgment interest",
    def: "Interest that builds up on an unpaid judgment, at a rate set by state law.",
    ca: {
      text: "10% a year in general; 5% for some medical-debt and personal-debt judgments against individuals entered or renewed since Jan. 1, 2023.",
      cite: { label: "CCP 685.010", url: leg("CCP", "685.010") },
    },
    related: ["judgment", "judgment-creditor"],
  },
  {
    slug: "judgment",
    term: "Judgment",
    def: "The court's final decision, including any amount one side must pay. A judgment is a right to be paid, not a payment: the court doesn't collect it for you.",
    ca: {
      text: "A money judgment can be enforced for 10 years and can be renewed before it runs out.",
      cite: { label: "CCP 683.020", url: leg("CCP", "683.020") },
    },
    related: ["judgment-creditor", "judgment-debtor", "notice-of-entry-of-judgment", "satisfaction-of-judgment"],
  },
  {
    slug: "judgment-creditor",
    term: "Judgment creditor",
    def: "The person or business that won a money judgment and is owed the money.",
    related: ["judgment-debtor", "judgment", "writ-of-execution"],
  },
  {
    slug: "judgment-debtor",
    term: "Judgment debtor",
    def: "The person or business ordered to pay a judgment.",
    related: ["judgment-creditor", "debtors-examination", "exemption"],
  },
  {
    slug: "judgment-proof",
    term: "Judgment-proof",
    def: "Describes someone with no income or property that can legally be taken, often because everything they have is protected. You can win against them and still collect nothing, though their situation may change later.",
    related: ["exemption", "judgment", "wage-garnishment"],
  },
  {
    slug: "legal-aid",
    term: "Legal aid",
    def: "Free legal help from nonprofit organizations, usually for people with low incomes. LawHelp.org lists programs by state.",
    cite: { label: "LawHelp.org", url: "https://www.lawhelp.org/" },
    related: ["self-help-center", "small-claims-advisor"],
  },
  {
    slug: "lien",
    term: "Lien",
    aka: ["Judgment lien"],
    def: "A legal claim attached to property, usually real estate, for an unpaid judgment. The winner is typically paid when the property is sold or refinanced.",
    ca: {
      text: "Created by recording an abstract of judgment in each county where the debtor owns real estate. A lien on certain business property can be filed with the Secretary of State.",
      cite: { label: "CCP 697.310; CCP 697.510", url: leg("CCP", "697.310") },
    },
    related: ["abstract-of-judgment", "judgment-creditor"],
  },
  {
    slug: "mediation",
    term: "Mediation",
    def: "A meeting where a neutral person helps both sides try to reach their own agreement. The mediator doesn't decide who wins. Many courts and community programs offer it free.",
    related: ["demand-letter", "hearing", "judgment"],
  },
  {
    slug: "motion-to-vacate",
    term: "Motion to vacate",
    def: "A request asking the court to cancel a judgment, for example because you missed the hearing for a good reason or were never properly served.",
    ca: {
      text: "Form SC-135, $20 fee. Generally within 30 days after the Notice of Entry of Judgment is mailed if you missed the hearing; up to 180 days after you learned of the judgment if you were never properly served.",
      cite: { label: "CCP 116.720–116.745", url: leg("CCP", "116.730") },
    },
    related: ["default-judgment", "appeal", "service-of-process"],
  },
  {
    slug: "notice-of-entry-of-judgment",
    term: "Notice of entry of judgment",
    def: "The paper the court sends both sides saying what the judgment is and when it was entered. Deadlines to appeal or to ask to cancel the judgment often count from this notice.",
    ca: {
      text: "Form SC-130 (or SC-200). Collection is automatically paused for 30 days, or until an appeal is decided.",
      cite: { label: "Form SC-130; CCP 116.810", url: form("sc130") },
    },
    related: ["judgment", "appeal", "motion-to-vacate"],
  },
  {
    slug: "plaintiff",
    term: "Plaintiff",
    def: "The person or business that files the claim and starts the case.",
    related: ["defendant", "claim"],
  },
  {
    slug: "process-server",
    term: "Process server",
    def: "A person paid to deliver court papers to the other side. Rules on who may serve, and whether a server must be registered, vary by state.",
    related: ["service-of-process", "proof-of-service"],
  },
  {
    slug: "proof-of-service",
    term: "Proof of service",
    def: "A form, signed by the person who delivered the papers, telling the court how and when the other side was served. Without it, the hearing may be postponed.",
    ca: {
      text: "Form SC-104, filed at least 5 days before the hearing.",
      cite: { label: "CCP 116.340(c)", url: leg("CCP", "116.340") },
    },
    related: ["service-of-process", "substituted-service", "process-server"],
  },
  {
    slug: "satisfaction-of-judgment",
    term: "Satisfaction of judgment",
    def: "A form the winner files once the judgment is paid in full, so the court record shows the debt is cleared.",
    ca: {
      text: "Form SC-290 (EJ-100 if an abstract was recorded). If the winner doesn't file it within 14 days after the debtor's written demand, without good cause, they can owe the debtor's damages plus $50.",
      cite: { label: "CCP 116.850", url: leg("CCP", "116.850") },
    },
    related: ["judgment", "judgment-creditor", "abstract-of-judgment"],
  },
  {
    slug: "self-help-center",
    term: "Self-help center",
    def: "A free service run by a court that explains procedures and forms to people without lawyers. Staff can give information but generally not advice about what you should do. Every Fair Claim state page links to that state's official self-help site.",
    related: ["small-claims-advisor", "legal-aid"],
  },
  {
    slug: "service-of-process",
    term: "Service of process",
    aka: ["Serve", "Serving papers"],
    def: "Officially delivering the court papers to the other side in a way the court accepts, such as by certified mail, a sheriff, or an adult who isn't part of the case. The case can't go ahead until it's done.",
    ca: {
      text: "You can't serve the papers yourself. Service must be done at least 15 days before the hearing, or 20 days if the defendant lives outside the county.",
      cite: { label: "CCP 116.340", url: leg("CCP", "116.340") },
    },
    related: ["proof-of-service", "substituted-service", "process-server"],
  },
  {
    slug: "small-claims-advisor",
    term: "Small claims advisor",
    def: "A free advisor, provided by the court or county in some states, who explains small claims procedures and can help you prepare.",
    ca: {
      text: "California law requires counties to provide free small claims advisor help. Our California county pages list each county's advisor where we found one.",
      cite: { label: "CCP 116.260", url: leg("CCP", "116.260") },
    },
    related: ["self-help-center", "legal-aid"],
  },
  {
    slug: "small-claims-limit",
    term: "Small claims limit",
    aka: ["Jurisdictional limit"],
    def: "The most you can sue for in small claims. Across the 50 states and DC it runs from $2,500 to $25,000. If you're owed more, you may have to give up the extra or use a regular civil court.",
    cite: { label: "Fair Claim state research (each state page links its sources)", url: "/states/" },
    ca: {
      text: "$12,500 for individuals, $6,250 for businesses, and no more than two claims over $2,500 a year statewide.",
      cite: { label: "CCP 116.220, 116.221, 116.231", url: leg("CCP", "116.221") },
    },
    related: ["claim", "filing-fee"],
  },
  {
    slug: "statute-of-limitations",
    term: "Statute of limitations",
    def: "The deadline for filing a lawsuit. It depends on the kind of claim and counts from when the problem happened. Miss it and the case can be thrown out.",
    ca: {
      text: "For example: 4 years for a written contract, 2 years for an oral agreement, 3 years for damage to property.",
      cite: { label: "CCP 337, 338, 339", url: leg("CCP", "337") },
    },
    related: ["claim"],
  },
  {
    slug: "substituted-service",
    term: "Substituted service",
    def: "Serving papers by leaving them with another adult at the person's home or workplace and then mailing a copy, instead of handing them to the person directly.",
    ca: {
      text: "Complete 10 days after the copy is mailed, so start at least 10 days before the usual service deadline. The mailing is shown on form SC-104A.",
      cite: { label: "CCP 415.20; CCP 116.340", url: leg("CCP", "415.20") },
    },
    related: ["service-of-process", "proof-of-service"],
  },
  {
    slug: "trial-de-novo",
    term: "Trial de novo",
    def: "Latin for a new trial. In states where a small claims appeal works this way, the case is heard again from the start, often by a different judge, instead of reviewing the first decision.",
    ca: {
      text: "A California small claims appeal is a new hearing before a different judicial officer. Lawyers may take part.",
      cite: { label: "CCP 116.770", url: leg("CCP", "116.770") },
    },
    related: ["appeal"],
  },
  {
    slug: "venue",
    term: "Venue",
    def: "Which court location the case belongs in. Usually it's where the defendant lives or does business, where a contract was made or was to be carried out, or where the damage happened.",
    related: ["claim", "dismissal"],
  },
  {
    slug: "wage-garnishment",
    term: "Wage garnishment",
    def: "A court order telling an employer to hold back part of a debtor's pay and send it toward a judgment. Federal law caps most garnishments at 25% of disposable earnings; some states protect more.",
    cite: { label: "15 U.S.C. § 1673; U.S. Dept. of Labor Fact Sheet #30", url: "https://www.dol.gov/agencies/whd/fact-sheets/30-cppa" },
    ca: {
      text: "The most that can be taken is the lesser of 20% of disposable earnings or 40% of the amount above 48 times the state minimum hourly wage each week. Apply with form WG-001 after getting a writ of execution.",
      cite: { label: "CCP 706.050", url: leg("CCP", "706.050") },
    },
    related: ["writ-of-execution", "exemption", "judgment-proof"],
  },
  {
    slug: "writ-of-execution",
    term: "Writ of execution",
    def: "A court order that lets a sheriff or other officer take a debtor's money or property to pay a judgment. It's usually needed before a bank levy or wage garnishment.",
    ca: {
      text: "Form EJ-130. The clerk's fee is $40 and can be added to the judgment. The writ expires after 180 days.",
      cite: { label: "Form EJ-130; Statewide Civil Fee Schedule; California Courts self-help", url: "https://selfhelp.courts.ca.gov/how-get-writ-execution" },
    },
    related: ["bank-levy", "wage-garnishment", "judgment-creditor"],
  },
];

export const glossary: GlossaryEntry[] = entries.slice().sort((a, b) => a.term.localeCompare(b.term));

const bySlug = new Map(glossary.map((e) => [e.slug, e]));

/** Look up an entry. Throws at build time for an unknown slug, so a typo in <Term slug="…"> can't ship. */
export function getTerm(slug: string): GlossaryEntry {
  const e = bySlug.get(slug);
  if (!e) throw new Error(`Glossary: no entry with slug "${slug}". Add it to src/lib/glossary.ts.`);
  return e;
}

// Fail the build if a `related` slug points nowhere.
for (const e of glossary) {
  for (const r of e.related ?? []) {
    if (!bySlug.has(r)) throw new Error(`Glossary: "${e.slug}" lists unknown related term "${r}".`);
  }
}
