import { NextRequest, NextResponse } from 'next/server';
import { generateNDADraft, generateLegalNoticeDraft, NDADraftInput, LegalNoticeDraftInput } from '@/lib/drafter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { docType, inputs } = body;

    if (!docType || !inputs) {
      return NextResponse.json({ error: 'Document type and inputs are required' }, { status: 400 });
    }

    let draftContent = '';

    if (docType === 'NDA') {
      draftContent = generateNDADraft(inputs as NDADraftInput);
    } else if (docType === 'LEGAL_NOTICE') {
      draftContent = generateLegalNoticeDraft(inputs as LegalNoticeDraftInput);
    } else {
      return NextResponse.json({ error: 'Unsupported document type' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      docType,
      draftContent,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Drafting failed' }, { status: 500 });
  }
}
