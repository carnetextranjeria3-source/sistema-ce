
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const form = await req.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No se recibió ningún archivo' },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo supera los 5 MB' },
        { status: 400 }
      );
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return NextResponse.json(
        { error: 'Formato no permitido. Usa JPG, PNG o WEBP.' },
        { status: 400 }
      );
    }

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error('Faltan variables de entorno de Cloudinary');

      return NextResponse.json(
        { error: 'Falta configurar Cloudinary en el servidor' },
        { status: 500 }
      );
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'portal-ce-private',
          type: 'authenticated',
          resource_type: 'image',
          allowed_formats: ['jpg', 'png', 'webp']
        },
        (error, uploaded) => {
          if (error) {
            reject(error);
          } else {
            resolve(uploaded);
          }
        }
      ).end(bytes);
    });

    return NextResponse.json({
      publicId: result.public_id,
      format: result.format
    });

  } catch (error: any) {
    console.error('ERROR REAL DE CLOUDINARY:', error);

    return NextResponse.json(
      {
        error: error?.message || 'Error al subir el archivo'
      },
      { status: 500 }
    );
  }
}
