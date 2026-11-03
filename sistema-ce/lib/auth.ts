import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const secret = process.env.SESSION_SECRET;
if (!secret || secret.length < 32) throw new Error('SESSION_SECRET debe tener al menos 32 caracteres');
const key = new TextEncoder().encode(secret);
export async function createSession(email: string) {
  return new SignJWT({ email, role: 'admin' }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('8h').sign(key);
}
export async function getSession() {
  const token = cookies().get('portal_ce_session')?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, key); return payload; } catch { return null; }
}
export async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') return null;
  return session;
}
