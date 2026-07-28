import { NextResponse } from 'next/server';
import { isOpenAiConfigured } from '@/lib/openai';

// This endpoint is for deployment verification only.
// It confirms env vars are loaded in the serverless runtime without exposing secrets.
export async function GET() {
  const aiReady = isOpenAiConfigured();
  const hasJwt = !!process.env.JWT_SECRET;

  return NextResponse.json({
    openaiConfigured: aiReady,
    jwtConfigured: hasJwt,
    nodeEnv: process.env.NODE_ENV,
  });
}
