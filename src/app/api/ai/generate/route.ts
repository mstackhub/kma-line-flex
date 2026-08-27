import { NextResponse } from 'next/server';
import { generateStructuredContent } from '@/lib/ai/assistant';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt, targetType } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const structuredResult = await generateStructuredContent(prompt, targetType);
    return NextResponse.json(structuredResult);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
