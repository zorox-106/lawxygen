export interface NDADraftInput {
  disclosingParty: string;
  receivingParty: string;
  effectiveDate: string;
  jurisdiction: string;
  purpose: string;
  durationYears: number;
  confidentialScope: string;
  disputeResolution: string;
  tone?: 'Formal' | 'Assertive' | 'Conciliatory';
}

export interface LegalNoticeDraftInput {
  claimantName: string;
  respondentName: string;
  noticeDate: string;
  causeOfAction: string;
  demandAmount: string;
  curePeriodDays: number;
  jurisdiction: string;
  tone?: 'Formal' | 'Assertive' | 'Conciliatory';
}

export function generateNDADraft(input: NDADraftInput): string {
  const currentDate = input.effectiveDate || new Date().toISOString().split('T')[0];
  const dis = input.disclosingParty.trim() || "[DISCLOSING PARTY NAME/ENTITY]";
  const rec = input.receivingParty.trim() || "[RECEIVING PARTY NAME/ENTITY]";
  const jur = input.jurisdiction.trim() || "New Delhi, India";
  const dur = input.durationYears || 2;
  const pur = input.purpose.trim() || "evaluating a potential commercial partnership";
  const scope = input.confidentialScope.trim() || "source code, algorithms, financial figures, trade secrets, and customer data";
  const tone = input.tone || 'Formal';

  // ✅ Fix: Tone parameter alters legal phrasing dynamically
  let remedyClause = "";
  if (tone === 'Assertive') {
    remedyClause = `The Receiving Party explicitly agrees that any breach or threatened breach of this Agreement shall cause irreparable harm for which monetary damages alone shall be wholly inadequate. The Disclosing Party shall be immediately entitled to obtain emergency ex-parte injunctive relief, punitive damages, and full reimbursement of all legal fees without the requirement of posting a bond.`;
  } else if (tone === 'Conciliatory') {
    remedyClause = `In the event of an alleged breach, the Parties agree to first engage in good-faith executive consultations for 30 days to resolve the matter amicably before seeking formal judicial remedies or injunctive relief.`;
  } else {
    remedyClause = `The Receiving Party acknowledges that monetary damages may be inadequate to compensate for any breach of this Agreement, and the Disclosing Party shall be entitled to seek injunctive relief, specific performance, and legal fees in addition to any other remedies available at law.`;
  }

  return `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT (${tone.toUpperCase()} TONE)

THIS NON-DISCLOSURE AGREEMENT ("Agreement") is executed on this ${currentDate} at ${jur}, BY AND BETWEEN:

1. ${dis}, having its principal place of business at [Disclosing Party Address] (hereinafter referred to as the "Disclosing Party");

AND

2. ${rec}, having its principal place of business at [Receiving Party Address] (hereinafter referred to as the "Receiving Party").

RECITALS:
WHEREAS, the Parties intend to engage in discussions regarding ${pur} (the "Purpose");
WHEREAS, in connection with the Purpose, the Disclosing Party may disclose certain non-public, proprietary, and confidential technical and business information to the Receiving Party;

NOW, THEREFORE, IT IS HEREBY AGREED AS FOLLOWS:

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" shall mean all proprietary information, trade secrets, ${scope}, technical processes, product designs, business plans, customer lists, and financial records disclosed by the Disclosing Party.

2. OBLIGATIONS OF NON-DISCLOSURE & NON-USE
The Receiving Party agrees to:
   (a) Hold and maintain all Confidential Information in strict confidence, applying no less than reasonable standard of care;
   (b) Use the Confidential Information solely for the evaluated Purpose and for no other commercial objective;
   (c) Restrict disclosure strictly to employees bound by written confidentiality obligations.

3. TERM AND SURVIVAL
This Agreement shall commence on ${currentDate} and remain in full force and effect for a period of ${dur} year(s). Confidentiality obligations shall survive for 3 years following expiration.

4. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by the laws of India. Courts at ${jur} shall have exclusive jurisdiction.

5. REMEDIES AND DISPUTE RESOLUTION
${remedyClause}

IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the date first written above.

____________________________________
For: ${dis}
Authorized Signatory

____________________________________
For: ${rec}
Authorized Signatory
`;
}

export function generateLegalNoticeDraft(input: LegalNoticeDraftInput): string {
  const date = input.noticeDate || new Date().toISOString().split('T')[0];
  const claim = input.claimantName.trim() || "[CLAIMANT NAME]";
  const resp = input.respondentName.trim() || "[RESPONDENT NAME]";
  const cause = input.causeOfAction.trim() || "failure to clear outstanding invoices";
  const amount = input.demandAmount.trim() || "₹ 5,00,000/-";
  const cure = input.curePeriodDays || 15;
  const jur = input.jurisdiction.trim() || "New Delhi, India";
  const tone = input.tone || 'Assertive';

  // ✅ Fix: Tone parameter alters legal notice pressure level
  let legalThreat = "";
  if (tone === 'Assertive') {
    legalThreat = `PLEASE TAKE STRICT NOTICE that upon expiry of the ${cure}-day period without full payment, Our Client has issued peremptory instructions to file summary civil recovery suits under Order 37 CPC and initiate criminal prosecution under Section 420 IPC / Section 138 NI Act without further notice, attaching your corporate bank accounts and holding you personally liable for all legal costs and 18% per annum penal interest.`;
  } else if (tone === 'Conciliatory') {
    legalThreat = `Our Client remains open to settling this matter amicably without resorting to protracted litigation. We encourage you to reach out within ${cure} days to arrange a mutually agreeable payment schedule before any formal legal filings are initiated.`;
  } else {
    legalThreat = `PLEASE TAKE NOTICE that if you fail to comply with the demands herein within ${cure} days, Our Client shall initiate appropriate legal proceedings against you in competent courts at ${jur} at your sole risk and cost.`;
  }

  return `LEGAL DEMAND NOTICE (${tone.toUpperCase()} DEMAND)

BY REGISTERED POST A.D. / SPEED POST / EMAIL

Date: ${date}

TO,
${resp}
[Respondent Address]

SUBJECT: LEGAL NOTICE FOR ${cause.toUpperCase()} — DEMAND FOR REALIZATION OF ${amount}

Dear Sir/Madam,

Under instructions from our Client, ${claim} ("Our Client"), we serve upon you this Legal Notice:

1. Our Client is a reputed commercial entity having performed all contractual obligations.

2. You have defaulted on your payment obligations regarding: ${cause}.

3. As per our Client's verified ledger, an aggregate principal sum of ${amount} remains due and unpaid.

4. WE HEREBY CALL UPON YOU to remit the outstanding sum of ${amount} to Our Client within ${cure} Days from receipt of this Notice.

5. CONCILIATION & LEGAL CONSEQUENCES:
${legalThreat}

Retained for record and legal proceedings.

Yours faithfully,

____________________________________
ADVOCATE FOR CLIENT (${claim})
Jurisdiction: ${jur}
`;
}
