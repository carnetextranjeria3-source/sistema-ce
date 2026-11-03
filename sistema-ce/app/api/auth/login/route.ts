import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/auth';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL || '';
    const hash = process.env.ADMIN_PASSWORD_HASH || '';
    if (!email || !password || !adminEmail || !hash || email.toLowerCase() !== adminEmail.toLowerCase() || !(await bcrypt.compare(password, hash))) return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    const token = await createSession(adminEmail);
    const res = NextResponse.json({ ok: true });
    res.cookies.set('portal_ce_session', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 60 * 60 * 8 });
    return res;
  } catch { return NextResponse.json({ error: 'No se pudo iniciar sesión' }, { status: 400 }); }
}
