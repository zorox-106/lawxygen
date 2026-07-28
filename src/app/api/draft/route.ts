import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { generateOpenAILegalDraft } from '@/lib/openai';
import { z } from 'zod';

const DraftRequestSchema = z.object({
  docType: z.enum(['NDA', 'LEGAL_NOTICE']),
  inputs: z.record(z.string(), z.any()),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in to generate legal documents.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = DraftRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload: ' + parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { docType, inputs } = parsed.data;

    // Call OpenAI generator returning draft text and structured metadata
    const { content, metadata } = await generateOpenAILegalDraft(docType, inputs as any);

    return NextResponse.json({
      success: true,
      docType,
      draftContent: content,
      metadata,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Drafting execution error' },
      { status: 500 }
    );
  }
}
