export interface LegalDocument {
  id: string;
  title: string;
  category: 'Statute' | 'Precedent' | 'Bare Act';
  source: string;
  courtOrAuthority: string;
  sectionOrCaseNo: string;
  year: number;
  content: string;
  summary: string;
  keywords: string[];
}

export const INDIAN_LEGAL_CORPUS: LegalDocument[] = [
  {
    id: "leg_01",
    title: "Section 138 - Dishonour of Cheque for Insufficiency of Funds",
    category: "Statute",
    source: "Negotiable Instruments Act, 1881",
    courtOrAuthority: "Parliament of India",
    sectionOrCaseNo: "Sec 138",
    year: 1881,
    content: "Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money to another person from out of that account for the discharge, in whole or in part, of any debt or other liability, is returned by the bank unpaid, either because of the amount of money standing to the credit of that account is insufficient to honour the cheque or that it exceeds the amount arranged to be paid from that account by an agreement made with that bank, such person shall be deemed to have committed an offence and shall, without prejudice to any other provisions of this Act, be punished with imprisonment for a term which may be extended to two years, or with fine which may extend to twice the amount of the cheque, or with both.",
    summary: "Punishment for cheque dishonour up to 2 years imprisonment or fine up to double the cheque amount.",
    keywords: ["cheque", "dishonour", "bounce", "bank", "138", "punishment", "fine", "debt", "liability"]
  },
  {
    id: "leg_02",
    title: "Section 420 - Cheating and Dishonestly Inducing Delivery of Property",
    category: "Statute",
    source: "Indian Penal Code, 1860 (Bharatiya Nyaya Sanhita, 2023 Sec 318)",
    courtOrAuthority: "Parliament of India",
    sectionOrCaseNo: "Sec 420 IPC",
    year: 1860,
    content: "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    summary: "Cognizable and non-bailable offence penalizing fraud, financial cheating, and inducement with up to 7 years imprisonment.",
    keywords: ["cheating", "fraud", "420", "ipc", "property", "inducement", "imprisonment", "misrepresentation"]
  },
  {
    id: "leg_03",
    title: "Section 66D - Punishment for Cheating by Personation by Using Computer Resource",
    category: "Statute",
    source: "Information Technology Act, 2000",
    courtOrAuthority: "Parliament of India",
    sectionOrCaseNo: "Sec 66D IT Act",
    year: 2000,
    content: "Whoever by means of any communication device or computer resource cheats by personation, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.",
    summary: "Penalizes cyber fraud, online phishing, and digital identity theft with up to 3 years imprisonment and fine.",
    keywords: ["cyber", "computer", "it act", "66d", "phishing", "online fraud", "impersonation", "digital crime"]
  },
  {
    id: "leg_04",
    title: "Section 10 & 27 - Essential Elements of Contract & Restraint of Trade",
    category: "Bare Act",
    source: "Indian Contract Act, 1872",
    courtOrAuthority: "Parliament of India",
    sectionOrCaseNo: "Sec 10 & 27",
    year: 1872,
    content: "Section 10: All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void. Section 27: Every agreement by which any one is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void, except in agreements for sale of goodwill.",
    summary: "Defines valid contracts requiring free consent & consideration, and voids non-compete clauses in restraint of trade.",
    keywords: ["contract", "agreement", "consent", "consideration", "non-compete", "restraint of trade", "section 10", "section 27"]
  },
  {
    id: "leg_05",
    title: "Kesavananda Bharati v. State of Kerala (1973) - Basic Structure Doctrine",
    category: "Precedent",
    source: "Supreme Court of India (1973) 4 SCC 225",
    courtOrAuthority: "Supreme Court of India (13-Judge Bench)",
    sectionOrCaseNo: "Writ Petition (Civil) 135 of 1970",
    year: 1973,
    content: "The Supreme Court of India established the historic 'Basic Structure Doctrine', ruling that while Parliament has wide powers to amend the Constitution under Article 368, it cannot alter or destroy the fundamental features or basic structure of the Indian Constitution, such as judicial review, secularism, democracy, and federalism.",
    summary: "Landmark ruling establishing constitutional supremacy and basic structure doctrine limiting Parliamentary amendment power.",
    keywords: ["basic structure", "constitution", "article 368", "supreme court", "amendment", "judicial review", "kesavananda"]
  },
  {
    id: "leg_06",
    title: "Article 21 - Protection of Life and Personal Liberty",
    category: "Statute",
    source: "Constitution of India",
    courtOrAuthority: "Constituent Assembly of India",
    sectionOrCaseNo: "Art 21",
    year: 1950,
    content: "No person shall be deprived of his life or personal liberty except according to procedure established by law. The Supreme Court has expansively interpreted Article 21 to include the right to privacy (Puttaswamy case), clean environment, speedy trial, free legal aid, and dignity.",
    summary: "Fundamental Right safeguarding life, personal liberty, privacy, and fair trial rights in India.",
    keywords: ["article 21", "constitution", "fundamental right", "privacy", "liberty", "fair trial", "puttaswamy"]
  },
  {
    id: "leg_07",
    title: "Section 35 - Procedure for Filing Consumer Complaint",
    category: "Bare Act",
    source: "Consumer Protection Act, 2019",
    courtOrAuthority: "Parliament of India",
    sectionOrCaseNo: "Sec 35 CPA",
    year: 2019,
    content: "A complaint in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided may be filed with a District Commission by the consumer, any recognized consumer association, or one or more consumers having the same interest with the permission of the District Commission.",
    summary: "Outlines jurisdiction and procedure for consumers to seek redressal for defective goods or service deficiency.",
    keywords: ["consumer", "complaint", "defective goods", "deficiency", "district commission", "redressal", "cpa 2019"]
  },
  {
    id: "leg_08",
    title: "Navtej Singh Johar v. Union of India (2018) - Decriminalization of Sec 377",
    category: "Precedent",
    source: "Supreme Court of India (2018) 10 SCC 1",
    courtOrAuthority: "Supreme Court of India (5-Judge Bench)",
    sectionOrCaseNo: "Writ Petition (Crl.) No. 76 of 2016",
    year: 2018,
    content: "The Supreme Court unanimously held that Section 377 of the Indian Penal Code, insofar as it criminalized consensual sexual acts between adults in private, violated Articles 14, 15, 19, and 21 of the Constitution. Constitutional morality overrides societal prejudice, affirming equality and individual autonomy.",
    summary: "Unanimous Supreme Court judgment upholding equality, dignity, and personal autonomy for LGBTQ+ individuals.",
    keywords: ["section 377", "equality", "navtej johar", "supreme court", "dignity", "constitutional morality", "lgbtq"]
  }
];

export interface SearchResult {
  doc: LegalDocument;
  score: number;
  highlightSnippet: string;
}

export function searchLegalCorpus(query: string, categoryFilter?: string): { results: SearchResult[]; citedSummary: string } {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) {
    return { results: [], citedSummary: "Please enter a legal search query." };
  }

  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);
  
  const scored = INDIAN_LEGAL_CORPUS.map(doc => {
    if (categoryFilter && categoryFilter !== 'All' && doc.category !== categoryFilter) {
      return { doc, score: 0, highlightSnippet: '' };
    }

    let score = 0;
    const fullText = `${doc.title} ${doc.source} ${doc.content} ${doc.keywords.join(' ')}`.toLowerCase();

    // Exact title / section match bonus
    if (fullText.includes(normalizedQuery)) score += 0.5;

    queryWords.forEach(word => {
      if (doc.keywords.includes(word)) score += 0.25;
      if (doc.title.toLowerCase().includes(word)) score += 0.20;
      if (doc.content.toLowerCase().includes(word)) score += 0.10;
    });

    let highlightSnippet = doc.summary;
    const firstWordMatch = queryWords.find(w => doc.content.toLowerCase().includes(w));
    if (firstWordMatch) {
      const idx = doc.content.toLowerCase().indexOf(firstWordMatch);
      const start = Math.max(0, idx - 40);
      const end = Math.min(doc.content.length, idx + 140);
      highlightSnippet = (start > 0 ? "..." : "") + doc.content.substring(start, end) + "...";
    }

    return { doc, score: Number(score.toFixed(2)), highlightSnippet };
  });

  // Strict relevance threshold filter (must have score > 0.15)
  const filteredResults = scored
    .filter(item => item.score > 0.15)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  // ✅ Fix: Do NOT return random default documents when no query matches!
  if (filteredResults.length === 0) {
    return {
      results: [],
      citedSummary: `No matching legal statutes or Supreme Court precedents found in the indexed corpus for query '${query}'.`
    };
  }

  // Synthesize cited summary grounded only in matching results
  const citations = filteredResults.map((r, i) => `[${i + 1}] ${r.doc.source} (${r.doc.sectionOrCaseNo})`).join("; ");
  const citedSummary = `Based on retrieved Indian legal statutes and precedents: Query '${query}' relates to ${filteredResults[0].doc.title} [1]. ${filteredResults[0].doc.summary} Grounded sources: ${citations}.`;

  return { results: filteredResults, citedSummary };
}
