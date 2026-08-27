import { NextResponse } from 'next/server';
import { Campaign } from '@/types/message';
import { validateCampaign } from '@/lib/validation';
import { renderLineMessages } from '@/lib/line';
import { sendLineBroadcastMessage } from '@/lib/line/client';
import { logBroadcast, saveCampaign, getSettings } from '@/lib/storage';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const campaign: Campaign = await req.json();
    const settings = getSettings();

    // 1. Environment Safety Check (Requirement 17)
    if (settings.environmentMode !== 'production') {
      return NextResponse.json(
        {
          success: false,
          message:
            'ระบบอยู่ในโหมด [DEVELOPMENT] เพื่อความปลอดภัยจึงไม่อนุญาตให้ Broadcast จริงสู่ผู้ติดตามทั้งหมด กรุณาทดสอบด้วย "Send Test" หรือสลับโหมดเป็น PRODUCTION ในหน้า Settings',
        },
        { status: 403 }
      );
    }

    // 2. Validation
    const errors = validateCampaign(campaign);
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'ข้อมูลแคมเปญไม่ผ่านการตรวจสอบ กรุณาแก้ไขข้อผิดพลาดก่อนส่ง',
          errors,
        },
        { status: 422 }
      );
    }

    // 3. Render and Send
    const messages = renderLineMessages(campaign);
    const result = await sendLineBroadcastMessage(messages);

    // 4. Log
    logBroadcast({
      id: `log-${nanoid(8)}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      type: 'broadcast',
      environmentMode: settings.environmentMode,
      status: result.success ? 'success' : 'failed',
      errorMessage: result.success ? undefined : result.message,
      sentAt: new Date().toISOString(),
      messagesCount: messages.length,
    });

    // 5. Update campaign
    if (result.success && campaign.id) {
      saveCampaign({
        ...campaign,
        status: 'sent',
        sentAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: `เกิดข้อผิดพลาดในการ Broadcast: ${err.message}` },
      { status: 500 }
    );
  }
}
