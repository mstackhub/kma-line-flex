import { NextResponse } from 'next/server';
import { Campaign } from '@/types/message';
import { validateCampaign } from '@/lib/validation';
import { renderLineMessages } from '@/lib/line';
import { sendLinePushMessage } from '@/lib/line/client';
import { logBroadcast, saveCampaign, getSettings } from '@/lib/storage';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const campaign: Campaign = body.campaign;
    const recipientUserId: string = body.recipientUserId || '';

    if (!recipientUserId || recipientUserId.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'กรุณาระบุ LINE User ID ของผู้รับการทดสอบ' },
        { status: 400 }
      );
    }

    const errors = validateCampaign(campaign);
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'ข้อมูลแคมเปญไม่ผ่านการตรวจสอบ กรุณาแก้ไขข้อผิดพลาดก่อนส่งทดสอบ',
          errors,
        },
        { status: 422 }
      );
    }

    const messages = renderLineMessages(campaign);
    const settings = getSettings();

    const result = await sendLinePushMessage(recipientUserId.trim(), messages);

    logBroadcast({
      id: `log-${nanoid(8)}`,
      campaignId: campaign.id,
      campaignName: campaign.name,
      type: 'test',
      recipient: recipientUserId,
      environmentMode: settings.environmentMode,
      status: result.success ? 'success' : 'failed',
      errorMessage: result.success ? undefined : result.message,
      sentAt: new Date().toISOString(),
      messagesCount: messages.length,
    });

    if (result.success && campaign.id) {
      saveCampaign({
        ...campaign,
        status: 'test_sent',
        lastTestRecipient: recipientUserId,
      });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: `ส่งข้อความไม่สำเร็จ: ${err.message}` },
      { status: 500 }
    );
  }
}
