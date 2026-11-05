
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

const MAX_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const ALLOWED_KINDS = [
  'photo',
  'signature',
  'biometricFile',
];

export async function POST(req: Request) {
  try {
    // Verificar sesión administrativa
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: 'No autorizado. Inicia sesión nuevamente.' },
        { status: 401 }
      );
    }

    // Verificar configuración de Cloudinary
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error('Faltan variables de entorno de Cloudinary.');

      return NextResponse.json(
        {
          error: 'Falta configurar Cloudinary en las variables de Vercel.'
        },
        { status: 500 }
      );
    }

    const form = await req.formData();
    const file = form.get('file');
    const kind = String(form.get('kind') || '');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_KINDS.includes(kind)) {
      return NextResponse.json(
        { error: 'Categoría de archivo inválida.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'El archivo está vacío.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'El archivo supera el límite de 5 MB.' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Usa JPG, PNG o WEBP.' },
        { status: 400 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const result: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'portal-ce-private',
          resource_type: 'image',
          type: 'authenticated',
          allowed_formats: ['jpg', 'png', 'webp'],
          public_id: `${kind}_${Date.now()}`
        },
        (error, uploadedFile) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploadedFile);
          }
        }
      );

      stream.end(bytes);
    });

    return NextResponse.json({
      ok: true,
      publicId: result.public_id,
      format: result.format,
      message: 'Archivo cargado correctamente.'
    });

  } catch (error: any) {
    console.error('ERROR REAL DE CLOUDINARY:', error);

    const detail =
      typeof error?.message === 'string'
        ? error.message
        : 'Error desconocido al procesar el archivo.';

    return NextResponse.json(
      {
        error: `Error al subir archivo: ${detail}`
      },
      { status: 500 }
    );
  }
}
