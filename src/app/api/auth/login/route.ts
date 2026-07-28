import { NextRequest, NextResponse } from 'next/server';
import { authenticateUserInDb, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = authenticateUserInDb(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials. Use Advocate demo email.' }, { status: 401 });
    }

    const token = await createSessionToken(user);
    const response = NextResponse.json({ success: true, user });

    // Set HTTP-Only Cookie
    response.cookies.set('lawxygen_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
