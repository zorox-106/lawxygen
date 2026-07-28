import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { searchLegalCorpus } from '@/lib/corpus';
import { z } from 'zod';

const SearchRequestSchema = z.object({
  query: z.string().min(1, 'Search query cannot be empty').max(500, 'Query too long'),
  category: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // ✅ Fix: Verify authenticated session before querying statutory legal corpus
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
    const { results, citedSummary } = searchLegalCorpus(query, category);

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      citedSummary,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Search execution failed' },
      { status: 500 }
    );
  }
}
