import { NextRequest, NextResponse } from 'next/server';
import { registerUserInDb, createSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const user = registerUserInDb(email, name, password);
    const token = await createSessionToken(user);
    const response = NextResponse.json({ success: true, user });

    response.cookies.set('lawxygen_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Signup failed' }, { status: 400 });
  }
}
