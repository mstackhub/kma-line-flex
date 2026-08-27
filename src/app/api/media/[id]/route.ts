import { NextResponse } from 'next/server';
import { deleteMediaAsset } from '@/lib/storage';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const success = deleteMediaAsset(params.id);
    if (!success) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
