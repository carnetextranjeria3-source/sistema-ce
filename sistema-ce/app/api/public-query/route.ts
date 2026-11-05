import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Record from '@/models/Record';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

function getSignedImage(asset: any) {
  if (!asset?.publicId) return '';

  return cloudinary.url(asset.publicId, {
    secure: true,
    type: 'authenticated',
    sign_url: true,
    resource_type: 'image',
    format: asset.format || undefined,
  });
}

export async function POST(req: Request) {
  try {
    const { documentNumber, birthDate } = await req.json();

    if (
      typeof documentNumber !== 'string' ||
      typeof birthDate !== 'string' ||
      documentNumber.length > 32
    ) {
      return NextResponse.json(
        { error: 'Completa los datos solicitados' },
        { status: 400 }
      );
    }

    await connectDB();

    const date = new Date(`${birthDate}T00:00:00.000Z`);

    if (Number.isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Fecha inválida' },
        { status: 400 }
      );
    }

    const r: any = await Record.findOne({
      documentNumber: documentNumber.trim().toUpperCase(),
      birthDate: date,
      active: true,
    })
      .select(
        'documentType documentNumber firstNames surnames nationality birthDate sex migrationStatus certificateNumber issueDate expiryDate residenceExpiry photo signature biometricFile'
      )
      .lean();

    if (!r) {
      return NextResponse.json(
        { error: 'No se encontró un registro coincidente.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      record: {
        ...r,
        photoUrl: getSignedImage(r.photo),
        signatureUrl: getSignedImage(r.signature),
        biometricFileUrl: getSignedImage(r.biometricFile),
      },
      notice:
        'Ficha informativa de un registro privado. No constituye documento oficial ni verificación de una autoridad migratoria.',
    });
  } catch (error) {
    console.error('ERROR EN CONSULTA:', error);

    return NextResponse.json(
      { error: 'No se pudo realizar la consulta' },
      { status: 500 }
    );
  }
}
