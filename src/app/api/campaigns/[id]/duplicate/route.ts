import { NextResponse } from 'next/server';
import { getCampaignById, saveCampaign } from '@/lib/storage';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const original = getCampaignById(params.id);
    if (!original) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const duplicated = saveCampaign({
      ...original,
      id: `cmp-${nanoid(8)}`,
      name: `${original.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(duplicated, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
