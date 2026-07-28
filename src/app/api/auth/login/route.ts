import { NextRequest, NextResponse } from 'next/server';
import { authenticateUserInDb, createSessionToken } from '@/lib/auth';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const user = await authenticateUserInDb(email, password);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

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
    return NextResponse.json(
      { error: error.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
