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

    let publicUrl = '';

    // 1. Upload to FreeImage Public Cloud Storage for permanent LINE-accessible HTTPS URL
    try {
      const cloudFormData = new FormData();
      const blob = new Blob([buffer], { type: mimeType });
      cloudFormData.append('source', blob, safeFileName);
      cloudFormData.append('key', '6d207e02198a847aa98d0a2a901485a5');
      cloudFormData.append('action', 'upload');
      cloudFormData.append('format', 'json');

      const cloudRes = await fetch('https://freeimage.host/api/1/upload', {
        method: 'POST',
        body: cloudFormData,
      });

      if (cloudRes.ok) {
        const cloudData = await cloudRes.json();
        if (cloudData?.image?.url) {
          publicUrl = cloudData.image.url;
        }
      }
    } catch {
      // Cloud upload failed, continue with local fallback
    }

    // 2. Local filesystem storage fallback
    if (!publicUrl) {
      try {
        const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(publicUploadsDir)) {
          fs.mkdirSync(publicUploadsDir, { recursive: true });
        }
        const filePath = path.join(publicUploadsDir, safeFileName);
        fs.writeFileSync(filePath, buffer);
        publicUrl = `/uploads/${safeFileName}`;
      } catch {
        publicUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
      }
    }

    const newAsset = saveMediaAsset({
      id: `media-${nanoid(6)}`,
      fileName: file.name || safeFileName,
      url: publicUrl,
      fileSize: file.size || buffer.length,
      width: 1040,
      height: 1040,
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
