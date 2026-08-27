import { NextResponse } from 'next/server';
import { verifyLineConnection } from '@/lib/line/client';
import { saveSettings } from '@/lib/storage';

export async function POST() {
  try {
    const result = await verifyLineConnection();
    saveSettings({
      isConnected: result.success,
      lastCheckedAt: new Date().toISOString(),
    });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
