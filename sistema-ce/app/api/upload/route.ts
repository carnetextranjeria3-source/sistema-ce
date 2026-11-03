import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';
export const runtime = 'nodejs';
export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  try {
    const form = await req.formData(); const file = form.get('file'); const kind = String(form.get('kind') || '');
    if (!(file instanceof File) || !['photo', 'signature', 'biometricFile'].includes(kind)) return NextResponse.json({ error: 'Archivo o categoría inválida' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'El archivo supera 5 MB' }, { status: 400 });
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Solo se permiten imágenes JPG, PNG o WEBP' }, { status: 400 });
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await new Promise<any>((resolve, reject) => cloudinary.uploader.upload_stream({ folder: 'portal-ce-private', type: 'authenticated', resource_type: 'image', allowed_formats: ['jpg', 'png', 'webp'] }, (err, value) => err ? reject(err) : resolve(value)).end(bytes));
    return NextResponse.json({ publicId: result.public_id, format: result.format });
  } catch { return NextResponse.json({ error: 'No se pudo subir el archivo' }, { status: 500 }); }
}
