import { LineMessage } from '@/types/line';
import { getSettings } from '@/lib/storage';

const LINE_API_BASE = 'https://api.line.me/v2/bot';

export interface LineApiResponse {
  success: boolean;
  message?: string;
  statusCode?: number;
  data?: any;
}

export async function verifyLineConnection(): Promise<LineApiResponse> {
  const settings = getSettings();
  const token = settings.channelAccessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!token) {
    return {
      success: false,
      message: 'ไม่พบคีย์ LINE Channel Access Token กรุณาตั้งค่าในหน้า Settings',
      statusCode: 401,
    };
  }

  try {
    const res = await fetch(`${LINE_API_BASE}/info`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      return {
        success: false,
        message: err.message || `เชื่อมต่อไม่สำเร็จ (${res.status} ${res.statusText})`,
        statusCode: res.status,
      };
    }

    const data = await res.json();
    return {
      success: true,
      message: `เชื่อมต่อสำเร็จกับ LINE OA: ${data.displayName || 'Official Account'}`,
      data,
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `ไม่สามารถเชื่อมต่อไปยัง LINE API ได้: ${err.message}`,
      statusCode: 500,
    };
  }
}

export async function sendLinePushMessage(
  to: string,
  messages: LineMessage[]
): Promise<LineApiResponse> {
  const settings = getSettings();
  const token = settings.channelAccessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!token) {
    // If no token is provided yet, provide clear feedback
    return {
      success: false,
      message: 'ยังไม่ได้ระบุ LINE Channel Access Token ในระบบ',
      statusCode: 401,
    };
  }

  try {
    const res = await fetch(`${LINE_API_BASE}/message/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to,
        messages,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({ message: res.statusText }));
      const detailMsg = errJson.details?.map((d: any) => d.message).join(', ') || errJson.message || res.statusText;
      return {
        success: false,
        message: `LINE API Error (${res.status}): ${detailMsg}`,
        statusCode: res.status,
      };
    }

    return {
      success: true,
      message: 'ส่งข้อความทดสอบไปยัง LINE สำเร็จเรียบร้อยแล้ว',
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `เกิดข้อผิดพลาดในการส่งข้อความ: ${err.message}`,
      statusCode: 500,
    };
  }
}

export async function sendLineBroadcastMessage(
  messages: LineMessage[]
): Promise<LineApiResponse> {
  const settings = getSettings();
  const token = settings.channelAccessToken || process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (settings.environmentMode !== 'production') {
    return {
      success: false,
      message: 'ระบบอยู่ในโหมด DEVELOPMENT ไม่อนุญาตให้ยิง Broadcast จริง กรุณาใช้ Send Test หรือสลับโหมดเป็น PRODUCTION ใน Settings',
      statusCode: 403,
    };
  }

  if (!token) {
    return {
      success: false,
      message: 'ยังไม่ได้ระบุ LINE Channel Access Token',
      statusCode: 401,
    };
  }

  try {
    const res = await fetch(`${LINE_API_BASE}/message/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages,
      }),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({ message: res.statusText }));
      const detailMsg = errJson.details?.map((d: any) => d.message).join(', ') || errJson.message || res.statusText;
      return {
        success: false,
        message: `LINE Broadcast Error (${res.status}): ${detailMsg}`,
        statusCode: res.status,
      };
    }

    return {
      success: true,
      message: 'ส่ง Broadcast ถึงผู้ติดตามทั้งหมดสำเร็จเรียบร้อยแล้ว',
      statusCode: 200,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `เกิดข้อผิดพลาดในการ Broadcast: ${err.message}`,
      statusCode: 500,
    };
  }
}
