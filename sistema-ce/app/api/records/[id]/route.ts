import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Record from '@/models/Record';
import { audit } from '@/lib/audit';
export const runtime = 'nodejs';
export async function PATCH(req: Request, { params }: { params: { id: string } }) { if (!(await requireAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 }); try { await connectDB(); const row = await Record.findByIdAndUpdate(params.id, await req.json(), { new: true, runValidators: true }); if (!row) return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 }); await audit('admin', 'record.update', params.id); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: 'No se pudo actualizar' }, { status: 400 }); } }
export async function DELETE(_req: Request, { params }: { params: { id: string } }) { if (!(await requireAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 }); await connectDB(); const row = await Record.findByIdAndDelete(params.id); if (!row) return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 }); await audit('admin', 'record.delete', params.id); return NextResponse.json({ ok: true }); }
