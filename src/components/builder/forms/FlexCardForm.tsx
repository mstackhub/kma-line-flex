'use client';

import React, { useState } from 'react';
import { FlexCardContent } from '@/types/message';
import { CtaPresetPicker } from '@/components/builder/CtaPresetPicker';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import { Sparkles, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface FlexCardFormProps {
  card: FlexCardContent;
  onChange: (updated: FlexCardContent) => void;
  indexLabel?: string;
}

const BADGE_PRESETS = ['NEW', 'HOT', 'BEST SELLER', 'SALE 50%', '1 แถม 1', 'LIMITED', 'RECOMMENDED'];

export function FlexCardForm({ card, onChange, indexLabel = 'การ์ดสินค้า' }: FlexCardFormProps) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-5">
      {/* Hero Image Section with Local Upload */}
      <div className="space-y-3">
        <ImageUploadInput
          label="รูปภาพหลัก (Hero Image)"
          value={card.heroImage || ''}
          onChange={(url) => onChange({ ...card, heroImage: url })}
          placeholder="วาง URL หรือคลิก 'เลือกรูปจากเครื่อง' ด้านขวา"
          helperText="ขนาดแนะนำ 800x520 px (สัดส่วน 20:13) หรือรูปสี่เหลี่ยมจัตุรัส"
        />

        {/* Clickable Image Checkbox Option */}
        {card.heroImage && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={card.enableImageClick !== false}
                onChange={(e) => onChange({ ...card, enableImageClick: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-[#06C755] focus:ring-[#06C755]"
              />
              <span>✓ ให้คลิกที่รูปภาพเพื่อเปิดลิงก์ได้ด้วย (Clickable Image)</span>
            </label>

            {card.enableImageClick !== false && (
              <span className="text-[11px] text-slate-500">
                (แตะที่รูปภาพจะเปิดลิงก์เดียวกับปุ่ม CTA อัตโนมัติ)
              </span>
            )}
          </div>
        )}
      </div>

      {/* Badge Section */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-slate-700">
            ป้ายกำกับโปรโมชั่น (Badge) <span className="text-[11px] font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <span className="text-[11px] text-slate-400">เช่น NEW, SALE</span>
        </div>
        <input
          type="text"
          value={card.badge || ''}
          onChange={(e) => onChange({ ...card, badge: e.target.value })}
          placeholder="NEW ARRIVAL หรือ SALE 30%"
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none uppercase font-semibold text-[#06C755]"
        />
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {BADGE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange({ ...card, badge: preset })}
              className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 border border-slate-200 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Headline & Subheadline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ชื่อสินค้า / หัวข้อหลัก (Headline) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={card.headline || ''}
            onChange={(e) => onChange({ ...card, headline: e.target.value })}
            placeholder="เช่น หูฟังไร้สาย Wireless Pro"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            หัวข้อย่อย (Subheadline) <span className="text-[11px] font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <input
            type="text"
            value={card.subheadline || ''}
            onChange={(e) => onChange({ ...card, subheadline: e.target.value })}
            placeholder="เช่น ตัดเสียงรบกวน แบต 40 ชม."
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none text-slate-600"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          รายละเอียดสินค้า (Description) <span className="text-[11px] font-normal text-slate-400">(ไม่บังคับ)</span>
        </label>
        <textarea
          rows={2}
          value={card.description || ''}
          onChange={(e) => onChange({ ...card, description: e.target.value })}
          placeholder="ระบุจุดเด่นสำคัญ หรือเงื่อนไขโปรโมชั่นสั้นๆ..."
          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none text-slate-700"
        />
      </div>

      {/* Price Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ราคาโปรโมชั่น (Sale Price)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">฿</span>
            <input
              type="text"
              value={card.salePrice || ''}
              onChange={(e) => onChange({ ...card, salePrice: e.target.value })}
              placeholder="1,290"
              className="w-full rounded-xl border border-slate-300 pl-8 pr-3.5 py-2 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none font-bold text-red-600 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ราคาเดิมก่อนลด (Original Price)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">฿</span>
            <input
              type="text"
              value={card.originalPrice || ''}
              onChange={(e) => onChange({ ...card, originalPrice: e.target.value })}
              placeholder="1,990"
              className="w-full rounded-xl border border-slate-300 pl-8 pr-3.5 py-2 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none text-slate-400 bg-white"
            />
          </div>
        </div>
      </div>

      {/* CTA Button Config */}
      <div className="pt-2 border-t border-slate-100 space-y-4">
        <CtaPresetPicker
          value={card.ctaLabel || 'ช้อปเลย'}
          onChange={(label) => onChange({ ...card, ctaLabel: label })}
          ctaColor={card.ctaColor || '#06C755'}
          onColorChange={(color) => onChange({ ...card, ctaColor: color })}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ลิงก์เมื่อกดปุ่ม (Destination URL) <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={card.ctaUrl || ''}
            onChange={(e) => onChange({ ...card, ctaUrl: e.target.value })}
            placeholder="https://myshop.line.me/product-slug"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
          />
        </div>
      </div>
    </div>
  );
}
