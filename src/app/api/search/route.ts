import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { searchLegalCorpus } from '@/lib/corpus';
import { generateOpenAIRAGSynthesis } from '@/lib/openai';
import { z } from 'zod';

const SearchRequestSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty').max(500, 'Query too long'),
  category: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to perform statutory research.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = SearchRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { query, category } = parsed.data;
    const { results } = searchLegalCorpus(query, category);
    const timestamp = new Date().toISOString();

    if (results.length === 0) {
      return NextResponse.json({
        success: true,
        query,
        count: 0,
        citedSummary: "No relevant legal sources were found.",
        metadata: {
          provider: 'template',
          model: 'zero-results-fallback',
          generatedAt: timestamp,
          grounded: false,
        },
        results: [],
      });
    }

    const docs = results.map(r => r.doc);
    const { summary, metadata } = await generateOpenAIRAGSynthesis(query, docs);

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      citedSummary: summary,
      metadata,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Search execution failed' },
      { status: 500 }
    );
  }
}
