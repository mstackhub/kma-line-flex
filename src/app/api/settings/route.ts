import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/storage';

export async function GET() {
  try {
    const settings = getSettings();
    // Mask sensitive keys
    const maskedToken = settings.channelAccessToken
      ? '••••••••' + settings.channelAccessToken.slice(-4)
      : '';
    const maskedSecret = settings.channelSecret
      ? '••••••••' + settings.channelSecret.slice(-4)
      : '';
    const maskedGemini = settings.geminiApiKey
      ? '••••••••' + settings.geminiApiKey.slice(-4)
      : '';

    return NextResponse.json({
      channelId: settings.channelId,
      channelSecret: maskedSecret,
      channelAccessToken: maskedToken,
      hasAccessToken: Boolean(settings.channelAccessToken),
      hasSecret: Boolean(settings.channelSecret),
      hasGeminiKey: Boolean(settings.geminiApiKey),
      geminiApiKey: maskedGemini,
      environmentMode: settings.environmentMode,
      defaultTestUserId: settings.defaultTestUserId,
      isConnected: settings.isConnected,
      lastCheckedAt: settings.lastCheckedAt,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const current = getSettings();

    const updates: any = {};
    if (body.channelId !== undefined) updates.channelId = body.channelId;
    if (body.environmentMode !== undefined) updates.environmentMode = body.environmentMode;
    if (body.defaultTestUserId !== undefined) updates.defaultTestUserId = body.defaultTestUserId;

    // Only update secrets if non-masked real strings were provided
    if (body.channelSecret && !body.channelSecret.startsWith('••••')) {
      updates.channelSecret = body.channelSecret;
    }
    if (body.channelAccessToken && !body.channelAccessToken.startsWith('••••')) {
      updates.channelAccessToken = body.channelAccessToken;
    }
    if (body.geminiApiKey && !body.geminiApiKey.startsWith('••••')) {
      updates.geminiApiKey = body.geminiApiKey;
    }

    const saved = saveSettings(updates);

    return NextResponse.json({
      success: true,
      environmentMode: saved.environmentMode,
      channelId: saved.channelId,
      defaultTestUserId: saved.defaultTestUserId,
      hasAccessToken: Boolean(saved.channelAccessToken),
      hasSecret: Boolean(saved.channelSecret),
      hasGeminiKey: Boolean(saved.geminiApiKey),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
