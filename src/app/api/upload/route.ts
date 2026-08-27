import { NextResponse } from 'next/server';
import { saveMediaAsset } from '@/lib/storage';
import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

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
    const ext = file.name.split('.').pop() || 'jpg';
    const safeFileName = `${Date.now()}_${nanoid(6)}.${ext}`;

    // 1. Try to save file to public/uploads directory for fast direct serving
    let fileUrl = '';
    try {
      const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }
      const filePath = path.join(publicUploadsDir, safeFileName);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/uploads/${safeFileName}`;
    } catch {
      // Fallback to data URL if filesystem is read-only
      fileUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
    }

    const newAsset = saveMediaAsset({
      id: `media-${nanoid(6)}`,
      fileName: file.name || safeFileName,
      url: fileUrl,
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
