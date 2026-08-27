'use client';

import React from 'react';
import { Link2, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { UtmConfig } from '@/types/message';
import { applyUtmTracking } from '@/lib/utm';
import { cn } from '@/lib/utils';

interface UtmBuilderProps {
  utm: UtmConfig;
  onChange: (utm: UtmConfig) => void;
  campaignName?: string;
}

export function UtmBuilder({ utm, onChange, campaignName }: UtmBuilderProps) {
  const sampleUrl = 'https://myshop.line.me/products/item-01';
  const trackedSample = applyUtmTracking(sampleUrl, utm, 'product_01');

  const autoFillFromCampaign = () => {
    if (!campaignName) return;
    const slug = campaignName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .slice(0, 30);
    onChange({
      ...utm,
      campaign: slug || 'promo_campaign',
    });
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-[#06C755]" />
          <div>
            <h4 className="font-bold text-slate-900 text-sm">ระบบติดตามยอดขายและสถิติ (UTM Tracking Builder)</h4>
            <p className="text-xs text-slate-500">
              แนบพารามิเตอร์ UTM ต่อท้ายลิงก์ทุกปุ่มในแคมเปญอัตโนมัติสำหรับ Google Analytics
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => onChange({ ...utm, enabled: !utm.enabled })}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
            utm.enabled
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-slate-100 text-slate-500 border-slate-200'
          )}
        >
          {utm.enabled ? (
            <>
              <span className="h-2 w-2 rounded-full bg-[#06C755]" />
              <span>เปิดใช้งาน UTM</span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>ปิดใช้งาน</span>
            </>
          )}
        </button>
      </div>

      {utm.enabled && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                utm_source (ที่มา)
              </label>
              <input
                type="text"
                value={utm.source || ''}
                onChange={(e) => onChange({ ...utm, source: e.target.value })}
                placeholder="line"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-[#06C755] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                utm_medium (สื่อ)
              </label>
              <input
                type="text"
                value={utm.medium || ''}
                onChange={(e) => onChange({ ...utm, medium: e.target.value })}
                placeholder="broadcast"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-[#06C755] outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  utm_campaign (ชื่อแคมเปญ)
                </label>
                {campaignName && (
                  <button
                    type="button"
                    onClick={autoFillFromCampaign}
                    className="text-[10px] text-[#06C755] hover:underline"
                  >
                    เติมอัตโนมัติ
                  </button>
                )}
              </div>
              <input
                type="text"
                value={utm.campaign || ''}
                onChange={(e) => onChange({ ...utm, campaign: e.target.value })}
                placeholder="payday_aug_2026"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-[#06C755] outline-none"
              />
            </div>
          </div>

          {/* Live tracking preview URL */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-[11px] font-semibold text-slate-600 block mb-1">
              ตัวอย่างลิงก์ที่จะถูกแนบ UTM ปลายทาง:
            </span>
            <div className="text-xs font-mono text-emerald-800 break-all bg-white p-2 rounded-lg border border-slate-200">
              {trackedSample}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
