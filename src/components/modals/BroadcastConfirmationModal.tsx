'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  Radio,
  Loader2,
  CheckCircle2,
  Clock,
  Calendar,
  Send,
  Zap,
} from 'lucide-react';
import { Campaign } from '@/types/message';
import { cn } from '@/lib/utils';

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
  const [broadcastType, setBroadcastType] = useState<'immediate' | 'scheduled'>('immediate');

  // Default schedule time: 1 hour in the future, rounded to next 15 mins
  const [scheduledDateTime, setScheduledDateTime] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 1);
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
    d.setSeconds(0);
    d.setMilliseconds(0);
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  // Calculate card/message counts
  let cardCount = 0;
  if (campaign.messageType === 'flex_card') cardCount = 1;
  if (campaign.messageType === 'flex_carousel' || campaign.messageType === 'image_carousel')
    cardCount = ((campaign.content as any)?.cards || []).length;
  if (campaign.messageType === 'hero_carousel')
    cardCount = ((campaign.content as any)?.cards || []).length;

  const handleAction = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      if (broadcastType === 'immediate') {
        // Send Immediately
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
      } else {
        // Schedule Broadcast
        const res = await fetch('/api/campaigns/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaign,
            scheduledAt: new Date(scheduledDateTime).toISOString(),
          }),
        });

        const data = await res.json();
        setResult(data);

        if (data.success && onSuccess) {
          onSuccess();
        }
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

  const formattedScheduledText = () => {
    try {
      const d = new Date(scheduledDateTime);
      return d.toLocaleString('th-TH', {
        dateStyle: 'full',
        timeStyle: 'short',
      });
    } catch {
      return scheduledDateTime;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className={cn(
            'h-10 w-10 rounded-xl flex items-center justify-center shrink-0',
            broadcastType === 'immediate' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
          )}>
            {broadcastType === 'immediate' ? (
              <Radio className="h-5 w-5 animate-pulse" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {broadcastType === 'immediate' ? 'ส่ง Broadcast สู่ผู้ติดตามทั้งหมด' : 'ตั้งเวลาส่ง Broadcast ล่วงหน้า'}
            </h3>
            <p className="text-xs text-slate-500">
              {broadcastType === 'immediate'
                ? 'ข้อความนี้จะถูกส่งถึงผู้ติดตาม LINE Official Account ทุกคนทันที'
                : 'ระบบจะส่งข้อความอัตโนมัติเมื่อถึงวันและเวลาที่กำหนด'}
            </p>
          </div>
        </div>

        {/* Broadcast Type Selector (Tabs) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setBroadcastType('immediate')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all',
              broadcastType === 'immediate'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span>ส่งทันที (Immediately)</span>
          </button>

          <button
            type="button"
            onClick={() => setBroadcastType('scheduled')}
            className={cn(
              'flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all',
              broadcastType === 'scheduled'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Clock className="h-3.5 w-3.5 text-blue-600" />
            <span>ตั้งเวลาล่วงหน้า (Schedule)</span>
          </button>
        </div>

        {/* Schedule Date Time Input Section */}
        {broadcastType === 'scheduled' && (
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3 animate-in fade-in">
            <label className="block text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span>กำหนดวันและเวลาที่ต้องการให้ส่งข้อความ:</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledDateTime}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              className="w-full rounded-xl border border-blue-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="text-[11px] text-blue-800 bg-white/80 p-2 rounded-lg border border-blue-200">
              📅 <strong>กำหนดการ:</strong> {formattedScheduledText()}
            </div>
          </div>
        )}

        {/* Campaign Summary Checklist */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
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

          <div className="flex justify-between py-1">
            <span className="text-slate-500">กลุ่มเป้าหมาย:</span>
            <span className="font-bold text-slate-900">ผู้ติดตามทั้งหมด (All Followers)</span>
          </div>
        </div>

        {/* Safety Warning */}
        {broadcastType === 'immediate' && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">คำเตือนความปลอดภัย:</span>
              <span className="leading-relaxed text-[11px]">
                เมื่อกดยืนยันแล้วจะไม่สามารถยกเลิกข้อความระหว่างทางได้ แนะนำให้ใช้ <strong>Send Test</strong> ตรวจสอบก่อนส่งเสมอ
              </span>
            </div>
          </div>
        )}

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
                  <span>
                    {broadcastType === 'scheduled'
                      ? '✓ ตั้งเวลาส่ง Broadcast เรียบร้อยแล้ว'
                      : '✓ Broadcast สำเร็จเรียบร้อยแล้ว'}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>เกิดข้อผิดพลาด</span>
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
            ปิด
          </button>
          <button
            type="button"
            onClick={handleAction}
            disabled={isLoading}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-all disabled:opacity-50',
              broadcastType === 'immediate'
                ? 'bg-red-600 hover:bg-red-700 hover:shadow-red-200'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>กำลังดำเนินการ...</span>
              </>
            ) : broadcastType === 'immediate' ? (
              <>
                <Radio className="h-3.5 w-3.5" />
                <span>ยืนยันส่ง Broadcast ทันที</span>
              </>
            ) : (
              <>
                <Clock className="h-3.5 w-3.5" />
                <span>บันทึกการตั้งเวลาส่ง</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
