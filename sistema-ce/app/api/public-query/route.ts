import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Record from '@/models/Record';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  try {
    const { documentNumber, birthDate } = await req.json();
    if (typeof documentNumber !== 'string' || typeof birthDate !== 'string' || documentNumber.length > 32) return NextResponse.json({ error: 'Completa los datos solicitados' }, { status: 400 });
    await connectDB(); const date = new Date(`${birthDate}T00:00:00.000Z`);
    if (Number.isNaN(date.getTime())) return NextResponse.json({ error: 'Fecha inválida' }, { status: 400 });
    const r = await Record.findOne({ documentNumber: documentNumber.trim().toUpperCase(), birthDate: date, active: true }).select('documentType documentNumber firstNames surnames nationality birthDate sex migrationStatus certificateNumber issueDate expiryDate residenceExpiry').lean();
    if (!r) return NextResponse.json({ error: 'No se encontró un registro coincidente. Verifica los datos o contacta al administrador.' }, { status: 404 });
    return NextResponse.json({ record: r, notice: 'Ficha informativa de un registro privado. No constituye documento oficial ni verificación de una autoridad migratoria.' });
  } catch { return NextResponse.json({ error: 'No se pudo realizar la consulta' }, { status: 500 }); }
}
