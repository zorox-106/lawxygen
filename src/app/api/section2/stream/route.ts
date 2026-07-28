import { NextRequest } from 'next/server';
import { z } from 'zod';

/**
 * Section 2 — Native Next.js SSE Streaming RAG Endpoint
 * Mirrors the FastAPI /research/query endpoint with token-by-token streaming,
 * inline [doc_id] citation grounding, and zero-result hallucination protection.
 * 
 * This route runs on Vercel without needing an external FastAPI server.
 */

const StreamQuerySchema = z.object({
  query: z.string().min(1).max(1000),
});

// Mirrors the MOCK_DATABASE from section2_rag/main.py
const MOCK_DATABASE = [
  {
    doc_id: 'ni_act_138',
    title: 'Section 138, Negotiable Instruments Act, 1881',
    chunk_text:
      'Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money is returned by the bank unpaid, such person shall be deemed to have committed an offence and shall be punished with imprisonment for a term which may be extended to two years, or with fine which may extend to twice the amount of the cheque, or with both.',
    keywords: ['cheque', 'bounce', 'dishonour', '138', 'negotiable', 'instruments', 'punishment', 'penalty', 'fine'],
  },
  {
    doc_id: 'ipc_420',
    title: 'Section 420, Indian Penal Code, 1860',
    chunk_text:
      'Cheating and dishonestly inducing delivery of property: Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.',
    keywords: ['cheating', 'fraud', '420', 'ipc', 'property', 'dishonestly', 'imprisonment'],
  },
  {
    doc_id: 'it_act_66d',
    title: 'Section 66D, Information Technology Act, 2000',
    chunk_text:
      'Punishment for cheating by personation by using computer resource: Whoever by means of any communication device or computer resource cheats by personation, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.',
    keywords: ['cyber', 'computer', 'it act', '66d', 'personation', 'online', 'fraud', 'phishing'],
  },
  {
    doc_id: 'contract_act_10',
    title: 'Section 10, Indian Contract Act, 1872',
    chunk_text:
      'What agreements are contracts: All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.',
    keywords: ['contract', 'agreement', 'consent', 'consideration', 'lawful', 'section 10'],
  },
];

interface RetrievedChunk {
  doc_id: string;
  chunk_text: string;
  score: number;
}

function retrieve(query: string): RetrievedChunk[] {
  const queryLower = query.toLowerCase().trim();
  if (!queryLower) return [];

  const matches: RetrievedChunk[] = [];
  for (const doc of MOCK_DATABASE) {
    const matchedWords = doc.keywords.filter(kw => queryLower.includes(kw));
    if (matchedWords.length > 0) {
      const score = Math.min(0.98, parseFloat((0.60 + matchedWords.length * 0.12).toFixed(2)));
      matches.push({ doc_id: doc.doc_id, chunk_text: doc.chunk_text, score });
    }
  }

  return matches.sort((a, b) => b.score - a.score).slice(0, 3);
}

async function* generateStream(query: string): AsyncGenerator<string> {
  const chunks = retrieve(query);

  // Zero-result hallucination guard
  if (chunks.length === 0) {
    const msg = 'No relevant legal sources found for your query. The system cannot provide a grounded response without authoritative source documents.';
    for (const word of msg.split(' ')) {
      yield `${word} `;
      await new Promise(r => setTimeout(r, 30));
    }
    yield `\n\n[SOURCES_USED]: ${JSON.stringify({ status: 'no_sources_found', used_chunks: [] })}`;
    return;
  }

  // Build response with inline [doc_id] citations
  const parts: string[] = [];
  parts.push(`Based on Indian statutory law and public legal records for your query regarding '${query}':\n\n`);

  for (let i = 0; i < chunks.length; i++) {
    const { doc_id, chunk_text, score } = chunks[i];
    parts.push(`Point ${i + 1}: According to legal record `);
    parts.push(`[${doc_id}]`);
    parts.push(` (relevance score: ${score}), `);
    parts.push(`"${chunk_text}" `);
    parts.push(`[${doc_id}]\n\n`);
  }
  parts.push('Summary: All claims above are directly cited from retrieved statutory provisions.');

  const fullText = parts.join('');
  const words = fullText.split(' ');

  for (let i = 0; i < words.length; i++) {
    yield i === words.length - 1 ? words[i] : `${words[i]} `;
    await new Promise(r => setTimeout(r, 30));
  }

  const sourcesPayload = {
    status: 'success',
    query,
    total_sources_retrieved: chunks.length,
    used_chunks: chunks.map(c => ({
      doc_id: c.doc_id,
      score: c.score,
      chunk_snippet: c.chunk_text.slice(0, 80) + '...',
    })),
  };
  yield `\n\n[SOURCES_USED]: ${JSON.stringify(sourcesPayload, null, 2)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = StreamQuerySchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.issues[0].message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { query } = parsed.data;

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const token of generateStream(query)) {
            controller.enqueue(encoder.encode(token));
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Stream error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
