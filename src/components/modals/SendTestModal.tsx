'use client';

import React, { useState, useEffect } from 'react';
import { Send, Loader2, CheckCircle2, AlertCircle, User, Info } from 'lucide-react';
import { Campaign } from '@/types/message';

interface SendTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  onSuccess?: () => void;
}

export function SendTestModal({ isOpen, onClose, campaign, onSuccess }: SendTestModalProps) {
  const [recipientUserId, setRecipientUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; errors?: any[] } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setResult(null);
      // Fetch default test User ID from settings
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data?.defaultTestUserId) {
            setRecipientUserId(campaign.lastTestRecipient || data.defaultTestUserId);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, campaign]);

  if (!isOpen) return null;

  const handleSendTest = async () => {
    if (!recipientUserId.trim()) return;
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/line/send-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign,
          recipientUserId: recipientUserId.trim(),
        }),
      });

      let data: any;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = {
          success: false,
          message: res.status === 413
            ? 'ขนาดรูปภาพหรือข้อมูลใหญ่เกินไป กรุณาใช้ไฟล์ภาพขนาดเล็กลง หรือใช้ HTTPS URL'
            : `เซิร์ฟเวอร์ส่งข้อผิดพลาด (${res.status}): ${text.slice(0, 150)}`,
        };
      }

      setResult(data);

      if (data.success && onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">ทดสอบส่งข้อความ (Send Test)</h3>
              <p className="text-[11px] text-slate-500">ส่งข้อความเข้าห้องแชตจริงเพื่อตรวจความถูกต้อง</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Campaign Brief */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">ชื่อแคมเปญ:</span>
            <span className="font-bold text-slate-900">{campaign.name || 'ไม่มีชื่อ'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">รูปแบบ:</span>
            <span className="font-semibold text-slate-700 uppercase">{campaign.messageType}</span>
          </div>
        </div>

        {/* Recipient User ID Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            LINE User ID ผู้รับการทดสอบ <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={recipientUserId}
              onChange={(e) => setRecipientUserId(e.target.value)}
              placeholder="U1234567890abcdef1234567890abcdef"
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3.5 py-2.5 text-xs font-mono focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <User className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>สามารถดู User ID ของบัญชีตนเองได้ในหน้า LINE Developers Console</span>
          </p>
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
                  <span>✓ ส่งข้อความทดสอบสำเร็จเรียบร้อยแล้ว</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                  <span>เกิดข้อผิดพลาดในการส่งทดสอบ</span>
                </>
              )}
            </div>
            <p className="text-[11px] leading-relaxed">{result.message}</p>
            {result.errors && result.errors.length > 0 && (
              <ul className="list-disc pl-4 text-[11px] text-red-700 mt-1">
                {result.errors.map((err, i) => (
                  <li key={i}>{err.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            ปิด
          </button>
          <button
            type="button"
            onClick={handleSendTest}
            disabled={isLoading || !recipientUserId.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>กำลังส่งข้อความ...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>ส่งข้อความทดสอบเดี๋ยวนี้</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
