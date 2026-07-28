import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// ✅ Fix: No hardcoded fallback — throw at startup if JWT_SECRET is missing
const jwtSecretValue = process.env.JWT_SECRET;
if (!jwtSecretValue) {
  throw new Error(
    'JWT_SECRET environment variable is not set. ' +
    'Copy .env.example to .env.local and set a strong secret.'
  );
}
const JWT_SECRET = new TextEncoder().encode(jwtSecretValue);

const BCRYPT_ROUNDS = 12;

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface StoredUser {
  id: string;
  name: string;
  passwordHash: string;
  role: string;
}

// In-memory store (acceptable for demo; production would use a database)
const USERS_DB: Record<string, StoredUser> = {};

// ✅ Fix: Hash the demo password at module load time so it is never stored plaintext
(async () => {
  USERS_DB['advocate@lawxygen.com'] = {
    id: 'usr_demo_01',
    name: 'Adv. Rajesh Sharma',
    passwordHash: await bcrypt.hash('Lawyer@123', BCRYPT_ROUNDS),
    role: 'Senior Advocate',
  };
})();

// ─── Token helpers ────────────────────────────────────────────────────────────

export async function createSessionToken(user: UserSession): Promise<string> {
  return new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
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
  } catch {
    // Token expired, malformed, or signature invalid — return null silently
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('lawxygen_session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

// ─── User store helpers ───────────────────────────────────────────────────────

export async function registerUserInDb(
  email: string,
  name: string,
  plainPassword: string
): Promise<UserSession> {
  const normalizedEmail = email.toLowerCase().trim();

  if (USERS_DB[normalizedEmail]) {
    throw new Error('An account with this email already exists.');
  }

  const id = `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  // ✅ Fix: Always hash passwords with bcrypt before storing
  const passwordHash = await bcrypt.hash(plainPassword, BCRYPT_ROUNDS);

  USERS_DB[normalizedEmail] = { id, name, passwordHash, role: 'Advocate' };
  return { id, email: normalizedEmail, name, role: 'Advocate' };
}

export async function authenticateUserInDb(
  email: string,
  plainPassword: string
): Promise<UserSession | null> {
  const normalizedEmail = email.toLowerCase().trim();
  const user = USERS_DB[normalizedEmail];

  // ✅ Fix: Use bcrypt.compare — constant-time comparison, no plaintext
  if (!user || !(await bcrypt.compare(plainPassword, user.passwordHash))) {
    return null;
  }

  return {
    id: user.id,
    email: normalizedEmail,
    name: user.name,
    role: user.role,
  };
}
