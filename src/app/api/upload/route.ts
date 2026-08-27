import { NextResponse } from 'next/server';
import { saveMediaAsset } from '@/lib/storage';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;

    const newAsset = saveMediaAsset({
      id: `media-${nanoid(6)}`,
      fileName: file.name || 'uploaded_image.jpg',
      url: base64,
      fileSize: file.size || buffer.length,
      width: 1040,
      height: 650,
      mimeType,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      url: newAsset.url,
      fileName: newAsset.fileName,
      asset: newAsset,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
