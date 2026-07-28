import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'lawxygen_secret_jwt_key_2026_super_secure_auth_token'
);

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

// In-memory mock database of registered users with default demo user
const USERS_DB: Record<string, { id: string; name: string; passwordHash: string; role: string }> = {
  'advocate@lawxygen.com': {
    id: 'usr_demo_01',
    name: 'Adv. Rajesh Sharma',
    passwordHash: 'Lawyer@123', // In real app hashed with bcrypt
    role: 'Senior Advocate'
  }
};

export async function createSessionToken(user: UserSession): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch (error) {
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('lawxygen_session')?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export function registerUserInDb(email: string, name: string, passwordHash: string): UserSession {
  const normalizedEmail = email.toLowerCase().trim();
  if (USERS_DB[normalizedEmail]) {
    throw new Error('User already exists with this email');
  }
  
  const id = `usr_${Date.now()}`;
  USERS_DB[normalizedEmail] = {
    id,
    name,
    passwordHash,
    role: 'Advocate'
  };

  return { id, email: normalizedEmail, name, role: 'Advocate' };
}

export function authenticateUserInDb(email: string, password: string): UserSession | null {
  const normalizedEmail = email.toLowerCase().trim();
  const user = USERS_DB[normalizedEmail];
  if (!user || user.passwordHash !== password) {
    return null;
  }
  return {
    id: user.id,
    email: normalizedEmail,
    name: user.name,
    role: user.role
  };
}
