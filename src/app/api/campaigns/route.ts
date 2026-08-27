import { NextResponse } from 'next/server';
import { getCampaigns, saveCampaign } from '@/lib/storage';
import { Campaign } from '@/types/message';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const campaigns = getCampaigns();
    return NextResponse.json(campaigns);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newCampaign: Campaign = {
      ...body,
      id: body.id || `cmp-${nanoid(8)}`,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: body.status || 'draft',
    };

    const saved = saveCampaign(newCampaign);
    return NextResponse.json(saved, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
