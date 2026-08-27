'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Send,
  Layers,
  Wand2,
  ExternalLink,
} from 'lucide-react';
import { MessageType, Campaign } from '@/types/message';
import { AiStructuredContentResult } from '@/lib/ai/assistant';
import { cn } from '@/lib/utils';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (structuredData: AiStructuredContentResult) => void;
}

export function AiAssistantModal({ isOpen, onClose, onApply }: AiAssistantModalProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AiStructuredContentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('ไม่สามารถประมวลผลคำขอได้');
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseQuickPrompt = (sampleText: string) => {
    setPrompt(sampleText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#06C755] to-emerald-400 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">AI Content Assistant (ตัวช่วยแปลงข้อความเป็น Structured Data)</h3>
              <p className="text-xs text-slate-500">
                พิมพ์รายละเอียดสินค้าหรือแคมเปญของคุณ AI จะช่วยจัดเตรียมข้อมูลลง Form ให้ทันที
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Input Prompt Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              อธิบายรายละเอียดแคมเปญหรือสินค้าที่คุณต้องการส่ง:
            </label>
            <span className="text-[11px] text-slate-400">ภาษาไทยหรืออังกฤษ</span>
          </div>

          <textarea
            rows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ตัวอย่าง:&#10;แคมเปญ Payday มีสินค้า 3 ชิ้น&#10;1. หูฟังไร้สาย ราคา 1,890 จาก 2,990 ลิงก์ https://myshop.line.me/headphone&#10;2. สมาร์ทวอทช์ ราคา 1,290 จาก 1,990 ลิงก์ https://myshop.line.me/watch&#10;3. เคสกันกระแทก ราคา 490 จาก 790 ลิงก์ https://myshop.line.me/case&#10;ต้องการรูปแบบ Carousel โทนพรีเมียม ปุ่ม 'ช้อปเลย'"
            className="w-full rounded-xl border border-slate-300 p-3.5 text-xs focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none leading-relaxed"
          />

          {/* Quick Prompts Samples */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400">ลองตัวอย่าง:</span>
            <button
              type="button"
              onClick={() =>
                handleUseQuickPrompt(
                  'แคมเปญ Payday Sale สิ้นเดือนนี้ มีสินค้า 3 ตัว ได้แก่ เคสไอโฟน 790.-, สายชาร์จ 390.-, ฟิล์มกระจก 290.- ทำเป็น Carousel ปุ่มช้อปเลย ลิงก์ https://myshop.line.me'
                )
              }
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
            >
              Payday 3 สินค้า
            </button>
            <button
              type="button"
              onClick={() =>
                handleUseQuickPrompt(
                  'เปิดตัวรองเท้าวิ่งรุ่นใหม่ Nike Air Max Red Edition ราคาโปร 3,290 ปกติ 4,500 บาท มีปุ่มสั่งซื้อด่วน ลิงก์ https://myshop.line.me/nike'
                )
              }
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
            >
              เปิดตัวสินค้าเดี่ยว
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#06C755] hover:bg-[#05B04B] text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>กำลังวิเคราะห์และจัดโครงสร้าง...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>ประมวลผล Structured Data</span>
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
            {error}
          </div>
        )}

        {/* Generated Structured Data Preview */}
        {result && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-bold text-xs text-slate-900">
                  โครงสร้างข้อมูลที่ AI ช่วยจัดเตรียม:
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-white font-bold text-[10px] uppercase">
                {result.messageType.replace('_', ' ')}
              </span>
            </div>

            {/* Missing Info Rule Check */}
            {result.missingInformation && result.missingInformation.length > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>ข้อมูลที่ยังขาด (AI จะไม่สุ่มสร้าง URL ปลอม):</span>
                </div>
                <ul className="list-disc pl-5 text-amber-700 text-[11px] space-y-0.5">
                  {result.missingInformation.map((info, i) => (
                    <li key={i}>{info}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Summary Information */}
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">ชื่อแคมเปญ:</span>
                  <span className="font-bold text-slate-800">{result.campaignName || 'แคมเปญโปรโมชั่น'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Alt Text (ข้อความแจ้งเตือน):</span>
                  <span className="font-bold text-slate-800">{result.altText || '-'}</span>
                </div>
              </div>

              {/* Cards Summary */}
              {result.cards && result.cards.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-semibold text-slate-700 text-[11px] block">
                    รายการการ์ด ({result.cards.length} รายการ):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.cards.map((c, i) => (
                      <div key={i} className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-900 truncate max-w-[140px]">
                            {i + 1}. {c.headline}
                          </span>
                          {c.badge && (
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold text-[9px] rounded">
                              {c.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 truncate">{c.subheadline || c.description}</div>
                        <div className="mt-1 flex items-center justify-between text-slate-700 font-medium">
                          <span>฿{c.salePrice || c.originalPrice || '-'}</span>
                          <span className="text-emerald-600 font-semibold">{c.ctaLabel || 'ช้อปเลย'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Apply Button */}
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply(result);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] text-white text-xs font-bold shadow-xs"
              >
                <span>นำข้อมูลลงฟอร์ม Builder (Populate into Form)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
