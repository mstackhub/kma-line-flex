'use client';

import React from 'react';
import { TextMessageContent } from '@/types/message';

interface TextFormProps {
  content: TextMessageContent;
  onChange: (updated: TextMessageContent) => void;
}

export function TextForm({ content, onChange }: TextFormProps) {
  const text = content.text || '';
  const charCount = text.length;

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            ข้อความ Broadcast (Text Message) <span className="text-red-500">*</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {charCount.toLocaleString()} / 5,000 ตัวอักษร
          </span>
        </div>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          placeholder="พิมพ์ข้อความที่ต้องการส่งถึงผู้ติดตามของคุณที่นี่..."
          className="w-full rounded-xl border border-slate-300 p-3.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none leading-relaxed"
        />
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2">
        <span>💡</span>
        <div>
          <span className="font-semibold block">คำแนะนำ:</span>
          <span>
            สามารถใส่อิโมจิ เว้นวรรค หรือขึ้นบรรทัดใหม่ได้ตามต้องการ เพื่อให้อ่านง่ายและดึงดูดความสนใจ
          </span>
        </div>
      </div>
    </div>
  );
}
