import { NextResponse } from 'next/server';
import { analyzeCampaignIntent } from '@/lib/ai/assistant';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const recommendation = await analyzeCampaignIntent(prompt);
    return NextResponse.json(recommendation);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
