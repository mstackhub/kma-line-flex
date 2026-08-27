'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { Campaign } from '@/types/message';

interface BroadcastConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  onSuccess?: () => void;
}

export function BroadcastConfirmationModal({
  isOpen,
  onClose,
  campaign,
  onSuccess,
}: BroadcastConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  // Calculate card/message counts
  let cardCount = 0;
  if (campaign.messageType === 'flex_card') cardCount = 1;
  if (campaign.messageType === 'flex_carousel')
    cardCount = ((campaign.content as any)?.cards || []).length;
  if (campaign.messageType === 'hero_carousel')
    cardCount = ((campaign.content as any)?.cards || []).length;

  const handleConfirmBroadcast = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/line/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });

      const data = await res.json();
      setResult(data);

      if (data.success && onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="h-10 w-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              ยืนยันการส่ง Broadcast สู่ผู้ติดตามทั้งหมด
            </h3>
            <p className="text-xs text-slate-500">
              ข้อความนี้จะถูกส่งถึงผู้ติดตาม LINE Official Account ทุกคนทันที
            </p>
          </div>
        </div>

        {/* Campaign Summary Checklist */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">ชื่อแคมเปญ:</span>
            <span className="font-bold text-slate-900">{campaign.name || 'ไม่มีชื่อ'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">รูปแบบข้อความ:</span>
            <span className="font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
              {campaign.messageType.replace('_', ' ')}
            </span>
          </div>

          {cardCount > 0 && (
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">จำนวนการ์ดสินค้า:</span>
              <span className="font-semibold text-slate-800">{cardCount} การ์ด</span>
            </div>
          )}

          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">Alt Text (การแจ้งเตือน):</span>
            <span className="font-medium text-slate-800 truncate max-w-[220px]">
              {(campaign.content as any)?.altText || (campaign.content as any)?.headline || '-'}
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-500">กลุ่มเป้าหมาย (Destination):</span>
            <span className="font-bold text-slate-900">ผู้ติดตามทั้งหมด (All Followers)</span>
          </div>
        </div>

        {/* Safety Warning */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">คำเตือนด้านความปลอดภัย:</span>
            <span className="leading-relaxed">
              เมื่อกดยืนยันแล้วจะไม่สามารถยกเลิกข้อความระหว่างทางได้ กรุณาตรวจสอบความถูกต้องของลิงก์และราคาผ่านฟังก์ชัน <strong>Send Test</strong> ก่อนส่งจริงเสมอ
            </span>
          </div>
        </div>

        {/* Result Message Banner */}
        {result && (
          <div
            className={`p-3.5 rounded-xl text-xs space-y-1 border ${
              result.success
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {result.success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>✓ Broadcast สำเร็จเรียบร้อยแล้ว</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>ไม่สามารถส่ง Broadcast ได้</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed">{result.message}</p>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleConfirmBroadcast}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-red-200 disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>กำลังส่ง Broadcast...</span>
              </>
            ) : (
              <>
                <Radio className="h-3.5 w-3.5" />
                <span>ยืนยันส่ง Broadcast ทันที</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
