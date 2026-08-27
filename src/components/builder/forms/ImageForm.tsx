'use client';

import React from 'react';
import { SingleImageContent } from '@/types/message';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import { Link as LinkIcon } from 'lucide-react';

interface ImageFormProps {
  content: SingleImageContent;
  onChange: (updated: SingleImageContent) => void;
}

export function ImageForm({ content, onChange }: ImageFormProps) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
      {/* Image Upload Input */}
      <ImageUploadInput
        label="รูปภาพโปรโมชั่น (Image)"
        required
        value={content.originalContentUrl || ''}
        onChange={(url) =>
          onChange({
            ...content,
            originalContentUrl: url,
            previewImageUrl: url,
          })
        }
        placeholder="https://example.com/banner.jpg หรืออัปโหลดจากเครื่อง"
        helperText="รองรับไฟล์ภาพ JPG, PNG ความละเอียดสูง"
      />

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          ข้อความแจ้งเตือน (Alt Text) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={content.altText || ''}
          onChange={(e) => onChange({ ...content, altText: e.target.value })}
          placeholder="เช่น โปสเตอร์กิจกรรมพิเศษประจำสัปดาห์"
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          ข้อความที่จะแสดงในแถบแจ้งเตือนของมือถือ (Notification) เมื่อส่งข้อความ
        </p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          ลิงก์ปลายทางเมื่อเปิดดู (Optional Destination Link)
        </label>
        <div className="relative">
          <input
            type="url"
            value={content.destinationUrl || ''}
            onChange={(e) => onChange({ ...content, destinationUrl: e.target.value })}
            placeholder="https://myshop.line.me/campaign"
            className="w-full rounded-xl border border-slate-300 pl-3.5 pr-10 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <LinkIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
