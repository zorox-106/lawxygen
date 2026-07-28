import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { generateNDADraft, generateLegalNoticeDraft, NDADraftInput, LegalNoticeDraftInput } from '@/lib/drafter';
import { z } from 'zod';

const DraftRequestSchema = z.object({
  docType: z.enum(['NDA', 'LEGAL_NOTICE']),
  inputs: z.record(z.string(), z.any()),
});

export async function POST(req: NextRequest) {
  try {
    // ✅ Fix: Verify authenticated session before allowing document drafting
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
        { error: 'Invalid payload schema: ' + parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { docType, inputs } = parsed.data;
    let draftContent = '';

    if (docType === 'NDA') {
      draftContent = generateNDADraft(inputs as NDADraftInput);
    } else if (docType === 'LEGAL_NOTICE') {
      draftContent = generateLegalNoticeDraft(inputs as LegalNoticeDraftInput);
    }

    return NextResponse.json({
      success: true,
      docType,
      draftContent,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Drafting execution error' },
      { status: 500 }
    );
  }
}
