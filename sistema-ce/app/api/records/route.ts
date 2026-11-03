import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Record from '@/models/Record';
import { audit } from '@/lib/audit';
export const runtime = 'nodejs';
export async function GET() { if (!(await requireAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 }); await connectDB(); const rows = await Record.find().sort({ createdAt: -1 }).lean(); return NextResponse.json(rows); }
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try { await connectDB(); const body = await req.json(); const created = await Record.create(body); await audit('admin', 'record.create', String(created._id)); return NextResponse.json({ id: created._id }, { status: 201 }); }
  catch (e: unknown) { const msg = e instanceof Error ? e.message : 'Datos inválidos'; return NextResponse.json({ error: msg.includes('duplicate') ? 'Ya existe un registro con ese documento y fecha de nacimiento' : 'No se pudo guardar el registro' }, { status: 400 }); }
}
