import { NextResponse } from 'next/server';
import { Campaign } from '@/types/message';
import { validateCampaign } from '@/lib/validation';
import { saveCampaign, getSettings } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const campaign: Campaign = body.campaign;
    const scheduledAt: string = body.scheduledAt;

    if (!campaign || !campaign.id) {
      return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลแคมเปญ' }, { status: 400 });
    }

    if (!scheduledAt) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุวันและเวลาที่ต้องการส่ง' }, { status: 400 });
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json({ success: false, message: 'รูปแบบวันและเวลาไม่ถูกต้อง' }, { status: 400 });
    }

    const errors = validateCampaign(campaign);
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'ข้อมูลแคมเปญไม่ผ่านการตรวจสอบ กรุณาแก้ไขข้อผิดพลาดก่อนตั้งเวลาส่ง',
          errors,
        },
        { status: 422 }
      );
    }

    const settings = getSettings();
    if (settings.environmentMode !== 'production') {
      return NextResponse.json(
        {
          success: false,
          message: 'ระบบอยู่ในโหมด DEVELOPMENT กรุณาสลับเป็น PRODUCTION MODE ก่อนตั้งเวลาส่งจริง',
        },
        { status: 403 }
      );
    }

    const updated = saveCampaign({
      ...campaign,
      status: 'scheduled',
      scheduledAt: scheduledDate.toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const formattedTime = scheduledDate.toLocaleString('th-TH', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    return NextResponse.json({
      success: true,
      message: `ตั้งเวลาส่งแคมเปญเรียบร้อยแล้ว: จะส่งอัตโนมัติในวันที่ ${formattedTime}`,
      campaign: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
