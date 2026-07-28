export interface NDADraftInput {
  disclosingParty: string;
  receivingParty: string;
  effectiveDate: string;
  jurisdiction: string;
  purpose: string;
  durationYears: number;
  confidentialScope: string;
  disputeResolution: string;
  tone: 'Formal' | 'Assertive' | 'Conciliatory';
}

export interface LegalNoticeDraftInput {
  claimantName: string;
  respondentName: string;
  noticeDate: string;
  causeOfAction: string;
  demandAmount: string;
  curePeriodDays: number;
  jurisdiction: string;
  tone: 'Formal' | 'Assertive' | 'Conciliatory';
}

export function generateNDADraft(input: NDADraftInput): string {
  const currentDate = input.effectiveDate || new Date().toISOString().split('T')[0];
  const dis = input.disclosingParty || "[DISCLOSING PARTY NAME/ENTITY]";
  const rec = input.receivingParty || "[RECEIVING PARTY NAME/ENTITY]";
  const jur = input.jurisdiction || "New Delhi, India";
  const dur = input.durationYears || 2;
  const pur = input.purpose || "evaluating a potential commercial partnership and software licensing collaboration";
  const scope = input.confidentialScope || "source code, proprietary algorithms, financial figures, trade secrets, and customer data";

  return `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

THIS NON-DISCLOSURE AGREEMENT ("Agreement") is executed on this ${currentDate} at ${jur}, BY AND BETWEEN:

1. ${dis}, having its principal place of business at [Disclosing Party Address] (hereinafter referred to as the "Disclosing Party", which expression shall unless repugnant to the context include its successors and permitted assigns);

AND

2. ${rec}, having its principal place of business at [Receiving Party Address] (hereinafter referred to as the "Receiving Party", which expression shall unless repugnant to the context include its successors and permitted assigns).

Disclosing Party and Receiving Party are individually referred to as a "Party" and collectively as the "Parties".

RECITALS:
WHEREAS, the Parties intend to engage in discussions regarding ${pur} (the "Purpose");
WHEREAS, in connection with the Purpose, the Disclosing Party may disclose certain non-public, proprietary, and confidential technical and business information to the Receiving Party;

NOW, THEREFORE, IT IS HEREBY AGREED AS FOLLOWS:

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" shall mean all proprietary information, trade secrets, ${scope}, technical processes, product designs, business plans, customer lists, and financial records disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, electronically, or visually.

2. OBLIGATIONS OF NON-DISCLOSURE & NON-USE
The Receiving Party agrees to:
   (a) Hold and maintain all Confidential Information in strict confidence, applying no less than reasonable standard of care;
   (b) Use the Confidential Information solely for the evaluated Purpose and for no other commercial or competitive objective;
   (c) Restrict disclosure of Confidential Information strictly to its employees, officers, advisors, and legal counsel who have a direct "need-to-know" and who are bound by written non-disclosure obligations no less restrictive than those contained herein.

3. EXCLUSIONS FROM CONFIDENTIAL INFORMATION
Confidential Information shall not include information which:
   (a) Is or becomes publicly known through no breach of this Agreement by the Receiving Party;
   (b) Was already in the lawful possession of the Receiving Party prior to disclosure hereunder;
   (c) Is independently developed by the Receiving Party without reference to or reliance upon the Disclosing Party's Confidential Information.

4. TERM AND SURVIVAL
This Agreement shall commence on ${currentDate} and remain in full force and effect for a period of ${dur} (${dur == 1 ? 'one' : 'two'}) year(s) from the date hereof. The confidentiality obligations under Clause 2 shall survive for a period of 3 (three) years following the termination or expiration of this Agreement.

5. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by and construed in accordance with the laws of India. Any dispute, controversy, or claim arising out of or relating to this Agreement shall be subject to the exclusive jurisdiction of the competent courts located at ${jur}.

6. REMEDIES FOR BREACH
The Receiving Party acknowledges that monetary damages may be inadequate to compensate for any breach of this Agreement, and the Disclosing Party shall be entitled to seek injunctive relief, specific performance, and legal fees in addition to any other remedies available at law.

IN WITNESS WHEREOF, the Parties hereto have caused this Non-Disclosure Agreement to be executed by their duly authorized representatives as of the date first above written.

____________________________________
For: ${dis}
Authorized Signatory: [Name & Title]

____________________________________
For: ${rec}
Authorized Signatory: [Name & Title]
`;
}

export function generateLegalNoticeDraft(input: LegalNoticeDraftInput): string {
  const date = input.noticeDate || new Date().toISOString().split('T')[0];
  const claim = input.claimantName || "[CLAIMANT NAME / CLIENT]";
  const resp = input.respondentName || "[RESPONDENT NAME / DEFAULTER ENTITY]";
  const cause = input.causeOfAction || "failure to clear outstanding invoices for services rendered despite repeated reminders";
  const amount = input.demandAmount || "₹ 5,00,000/- (Rupees Five Lakhs Only)";
  const cure = input.curePeriodDays || 15;
  const jur = input.jurisdiction || "New Delhi, India";

  return `LEGAL NOTICE / DEMAND LETTER

BY REGISTERED POST A.D. / SPEED POST / EMAIL

Date: ${date}

TO,
${resp}
[Respondent Full Address / Corporate Office]
Email: [Respondent Email]

SUBJECT: LEGAL NOTICE FOR ${cause.toUpperCase()} AND DEMAND FOR PAYMENT OF ${amount}

Dear Sir/Madam,

Under instructions from and on behalf of our Client, ${claim} (hereinafter referred to as "Our Client"), we do hereby serve upon you this Legal Notice as under:

1. Our Client is a reputed entity engaged in business, having performed its obligations under the agreed contract/purchase order dated [Insert Date].

2. That pursuant to the terms agreed upon between Our Client and You (the Respondent), Our Client duly delivered services/goods. However, despite receipt and acceptance of the same, you have defaulted on your payment obligations, causing severe financial loss to Our Client.

3. That the cause of action arises due to: ${cause}.

4. That as per the account ledger maintained by Our Client in the regular course of business, an aggregate principal sum of ${amount} remains due, unpaid, and outstanding against you, along with interest accrued at the rate of 18% per annum from the due date until actual realization.

5. In view of the above facts, WE HEREBY CALL UPON YOU to remit and clear the outstanding sum of ${amount} along with interest, to Our Client within a period of ${cure} (${cure == 15 ? 'Fifteen' : 'Thirty'}) Days from the receipt of this Notice.

6. PLEASE TAKE NOTICE that if you fail to comply with the demands herein within the stipulated ${cure}-day period, Our Client has given us strict instructions to initiate appropriate legal proceedings against you, including civil suits for recovery and criminal prosecution under applicable Indian statutory laws, at your sole risk, cost, and consequence.

Copy retained in our office for record and further action.

Yours faithfully,

____________________________________
ADVOCATE FOR CLIENT (${claim})
Law Chambers & Associates
Jurisdiction: ${jur}
`;
}
