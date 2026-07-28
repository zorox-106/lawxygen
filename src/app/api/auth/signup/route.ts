import { NextRequest, NextResponse } from 'next/server';
import { registerUserInDb, createSessionToken } from '@/lib/auth';
import { z } from 'zod';

const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SignupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const user = await registerUserInDb(email, name, password);
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
      { error: error.message || 'Signup failed' },
      { status: 400 }
    );
  }
}
