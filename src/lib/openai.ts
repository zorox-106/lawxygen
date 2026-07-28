import OpenAI from 'openai';
import { NDADraftInput, LegalNoticeDraftInput, generateNDADraft, generateLegalNoticeDraft } from './drafter';
import { LegalDocument } from './corpus';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('replace_this')) {
    return null;
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: apiKey.trim(),
      timeout: 8000, // 8s — safely under Vercel's 10s default, 30s with vercel.json extended timeout
      maxRetries: 1,
    });
  }

  return openaiClient;
}

export function isOpenAiConfigured(): boolean {
  return getOpenAIClient() !== null;
}

/**
 * Generates structured legal draft using OpenAI GPT with system prompt enforcement.
 * Fallbacks seamlessly to legal template engine if OPENAI_API_KEY is unconfigured or errors.
 */
export async function generateOpenAILegalDraft(
  docType: 'NDA' | 'LEGAL_NOTICE',
  inputs: NDADraftInput | LegalNoticeDraftInput
): Promise<{ content: string; provider: 'openai' | 'template' }> {
  const client = getOpenAIClient();

  if (!client) {
    // Graceful fallback to legal drafting engine when OpenAI key is absent
    const templateDraft = docType === 'NDA'
      ? generateNDADraft(inputs as NDADraftInput)
      : generateLegalNoticeDraft(inputs as LegalNoticeDraftInput);
    return { content: templateDraft, provider: 'template' };
  }

  const tone = inputs.tone || 'Formal';

  const systemPrompt = `You are a Senior Indian Legal Counsel specializing in contract drafting and statutory notices under Indian Law.
OBJECTIVE: Draft a highly professional, court-ready ${docType === 'NDA' ? 'Non-Disclosure Agreement (NDA)' : 'Legal Demand Notice'} in Markdown format.

STRICT DRAFTING RULES:
1. Tone Enforcement: Apply a ${tone.toUpperCase()} tone throughout the legal clauses.
2. Structure & Formatting: Use bold Markdown section headers, numbered legal clauses (1.0, 1.1), proper recital blocks, and execution signature blocks.
3. Indian Statutory Alignment: Ensure jurisdiction aligns with Indian Courts and applicable statutes (Indian Contract Act 1872, Arbitration and Conciliation Act 1996, CPC 1908).
4. No Placeholders: Render full, legally binding text. Incorporate all user parameters seamlessly.
5. Refusal Rule: Do not output conversational filler or preamble. Return ONLY the final legal draft markdown.`;

  const userPrompt = docType === 'NDA'
    ? `Draft a Mutual Non-Disclosure Agreement with the following parameters:
- Disclosing Party: ${(inputs as NDADraftInput).disclosingParty}
- Receiving Party: ${(inputs as NDADraftInput).receivingParty}
- Effective Date: ${(inputs as NDADraftInput).effectiveDate}
- Term Duration: ${(inputs as NDADraftInput).durationYears} Year(s)
- Court Jurisdiction: ${(inputs as NDADraftInput).jurisdiction}
- Purpose of Disclosure: ${(inputs as NDADraftInput).purpose}
- Scope of Confidential Information: ${(inputs as NDADraftInput).confidentialScope}
- Legal Tone: ${tone}`
    : `Draft a Legal Demand Notice with the following parameters:
- Claimant Name (Client): ${(inputs as LegalNoticeDraftInput).claimantName}
- Respondent Name (Defaulter): ${(inputs as LegalNoticeDraftInput).respondentName}
- Cause of Action / Breach: ${(inputs as LegalNoticeDraftInput).causeOfAction}
- Demand Amount: ${(inputs as LegalNoticeDraftInput).demandAmount}
- Cure Period: ${(inputs as LegalNoticeDraftInput).curePeriodDays} Days
- Court Jurisdiction: ${(inputs as LegalNoticeDraftInput).jurisdiction}
- Legal Pressure Tone: ${tone}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2, // Low temperature for consistent legal structure
      max_tokens: 1500,
    });

    const draftText = response.choices[0]?.message?.content?.trim();
    if (!draftText) {
      throw new Error('Empty response from OpenAI');
    }

    return { content: draftText, provider: 'openai' };
  } catch (error: any) {
    console.warn('OpenAI drafting failed or timed out. Falling back to template generator:', error.message);
    const templateDraft = docType === 'NDA'
      ? generateNDADraft(inputs as NDADraftInput)
      : generateLegalNoticeDraft(inputs as LegalNoticeDraftInput);
    return { content: templateDraft, provider: 'template' };
  }
}

/**
 * Generates grounded RAG legal synthesis using OpenAI GPT over retrieved context chunks.
 * Enforces strict zero-hallucination rules.
 */
export async function generateOpenAIRAGSynthesis(
  query: string,
  retrievedDocs: LegalDocument[]
): Promise<{ summary: string; provider: 'openai' | 'template' }> {
  if (!retrievedDocs || retrievedDocs.length === 0) {
    return { summary: "No relevant legal sources were found.", provider: 'template' };
  }

  const client = getOpenAIClient();

  if (!client) {
    // Standard template synthesis fallback
    const citations = retrievedDocs.map((r, i) => `[${i + 1}] ${r.source} (${r.sectionOrCaseNo})`).join("; ");
    const summary = `Based on retrieved Indian legal statutes and precedents: Query '${query}' relates to ${retrievedDocs[0].title} [1]. ${retrievedDocs[0].summary} Grounded sources: ${citations}.`;
    return { summary, provider: 'template' };
  }

  const contextText = retrievedDocs
    .map((doc, idx) => `SOURCE [${idx + 1}] (${doc.source} - ${doc.sectionOrCaseNo}):\nTitle: ${doc.title}\nContent: ${doc.content}\nSummary: ${doc.summary}`)
    .join('\n\n');

  const systemPrompt = `You are an expert Indian Statutory Legal Researcher.
OBJECTIVE: Answer the user's legal query based ONLY on the provided legal context sources.

STRICT RAG RULES:
1. Grounding: Rely EXCLUSIVELY on the provided source texts below. Do NOT use outside general legal knowledge.
2. Citation Requirement: Invert inline citations like [1], [2] next to every statutory claim or penalty mentioned.
3. Refusal Rule: If the provided sources do NOT contain enough information to answer the query, respond ONLY with: "No relevant legal sources were found."
4. Conciseness: Provide a precise 2-3 sentence legal answer summarizing statutory consequences and citations.`;

  const userPrompt = `USER QUERY: "${query}"

RETRIEVED LEGAL CONTEXT SOURCES:
${contextText}`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1, // Minimal temperature to prevent hallucination
      max_tokens: 400,
    });

    const summaryText = response.choices[0]?.message?.content?.trim();
    if (!summaryText || summaryText.includes("No relevant legal sources were found")) {
      return { summary: "No relevant legal sources were found.", provider: 'openai' };
    }

    return { summary: summaryText, provider: 'openai' };
  } catch (error: any) {
    console.warn('OpenAI RAG synthesis failed. Falling back to template synthesis:', error.message);
    const citations = retrievedDocs.map((r, i) => `[${i + 1}] ${r.source} (${r.sectionOrCaseNo})`).join("; ");
    const summary = `Based on retrieved Indian legal statutes and precedents: Query '${query}' relates to ${retrievedDocs[0].title} [1]. ${retrievedDocs[0].summary} Grounded sources: ${citations}.`;
    return { summary, provider: 'template' };
  }
}
