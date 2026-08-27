import { NextResponse } from 'next/server';
import { getMediaAssets, saveMediaAsset } from '@/lib/storage';
import { MediaAsset } from '@/types/message';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    const assets = getMediaAssets();
    return NextResponse.json(assets);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newAsset: MediaAsset = {
      id: `media-${nanoid(6)}`,
      fileName: body.fileName || 'artwork.jpg',
      url: body.url,
      fileSize: body.fileSize || 102400,
      width: body.width || 1040,
      height: body.height || 650,
      mimeType: body.mimeType || 'image/jpeg',
      createdAt: new Date().toISOString(),
    };

    const saved = saveMediaAsset(newAsset);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
