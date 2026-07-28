import { NextRequest, NextResponse } from 'next/server';
import { searchLegalCorpus } from '@/lib/corpus';

export async function POST(req: NextRequest) {
  try {
    const { query, category } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const { results, citedSummary } = searchLegalCorpus(query, category);

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      citedSummary,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Search failed' }, { status: 500 });
  }
}
