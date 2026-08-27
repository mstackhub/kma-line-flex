import { NextResponse } from 'next/server';
import { Campaign } from '@/types/message';
import { validateCampaign } from '@/lib/validation';
import { renderLineMessages } from '@/lib/line';

export async function POST(req: Request) {
  try {
    const campaign: Campaign = await req.json();
    const errors = validateCampaign(campaign);
    
    let renderedJson: any = null;
    if (errors.length === 0) {
      try {
        renderedJson = renderLineMessages(campaign);
      } catch (err: any) {
        errors.push({
          message: `เกิดข้อผิดพลาดในการ Render LINE JSON: ${err.message}`,
        });
      }
    }

    return NextResponse.json({
      isValid: errors.length === 0,
      errors,
      renderedJson,
      messageCount: renderedJson ? renderedJson.length : 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
