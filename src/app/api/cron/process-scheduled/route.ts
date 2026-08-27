import { NextResponse } from 'next/server';
import { getCampaigns, saveCampaign, logBroadcast, getSettings } from '@/lib/storage';
import { renderLineMessages } from '@/lib/line';
import { sendLineBroadcastMessage } from '@/lib/line/client';
import { nanoid } from 'nanoid';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const campaigns = getCampaigns();
    const now = new Date();
    const settings = getSettings();

    const dueCampaigns = campaigns.filter(
      (c) => c.status === 'scheduled' && c.scheduledAt && new Date(c.scheduledAt) <= now
    );

    const results = [];

    for (const campaign of dueCampaigns) {
      if (settings.environmentMode !== 'production') {
        logBroadcast({
          id: `log-${nanoid(8)}`,
          campaignId: campaign.id,
          campaignName: campaign.name,
          type: 'broadcast',
          environmentMode: settings.environmentMode,
          status: 'failed',
          errorMessage: 'Skipped: Environment mode was not set to production at scheduled time',
          sentAt: now.toISOString(),
          messagesCount: 0,
        });
        saveCampaign({
          ...campaign,
          status: 'failed',
        });
        results.push({ id: campaign.id, name: campaign.name, status: 'skipped_not_prod' });
        continue;
      }

      const messages = renderLineMessages(campaign);
      const res = await sendLineBroadcastMessage(messages);

      logBroadcast({
        id: `log-${nanoid(8)}`,
        campaignId: campaign.id,
        campaignName: campaign.name,
        type: 'broadcast',
        environmentMode: settings.environmentMode,
        status: res.success ? 'success' : 'failed',
        errorMessage: res.success ? undefined : res.message,
        sentAt: now.toISOString(),
        messagesCount: messages.length,
      });

      saveCampaign({
        ...campaign,
        status: res.success ? 'sent' : 'failed',
        sentAt: res.success ? now.toISOString() : undefined,
      });

      results.push({
        id: campaign.id,
        name: campaign.name,
        success: res.success,
        message: res.message,
      });
    }

    return NextResponse.json({
      success: true,
      processed: dueCampaigns.length,
      results,
      checkedAt: now.toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
