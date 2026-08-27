'use client';

import React from 'react';
import { HeroCarouselContent } from '@/types/message';
import { FlexCarouselForm } from './FlexCarouselForm';
import { Image as ImageIcon, Sparkles, Layers } from 'lucide-react';

interface HeroCarouselFormProps {
  content: HeroCarouselContent;
  onChange: (updated: HeroCarouselContent) => void;
}

export function HeroCarouselForm({ content, onChange }: HeroCarouselFormProps) {
  return (
    <div className="space-y-6">
      {/* Step 1: Hero Artwork Section */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-white text-xs font-bold">
            1
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">ข้อความที่ 1: Campaign Hero Artwork (ภาพแบนเนอร์หลัก)</h3>
            <p className="text-xs text-slate-500">ภาพแบนเนอร์ใหญ่ด้านบนสำหรับดึงดูดสายตาลูกค้า</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ลิงก์รูปภาพ Hero Artwork (HTTPS) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={content.heroArtworkUrl || ''}
                onChange={(e) => onChange({ ...content, heroArtworkUrl: e.target.value })}
                placeholder="https://example.com/hero-banner.jpg"
                className="w-full rounded-xl border border-slate-300 pl-3.5 pr-10 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <ImageIcon className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              ลิงก์เมื่อกดที่ภาพ Hero (Optional Link)
            </label>
            <input
              type="url"
              value={content.heroDestinationUrl || ''}
              onChange={(e) => onChange({ ...content, heroDestinationUrl: e.target.value })}
              placeholder="https://myshop.line.me/payday-campaign"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Product Carousel Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#06C755] text-white text-xs font-bold">
            2
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">ข้อความที่ 2: Flex Product Carousel (รายการสินค้าเลื่อนสไลด์)</h3>
            <p className="text-xs text-slate-500">แคตตาล็อกสินค้าที่ส่งตามติดทันทีหลังจากภาพ Banner</p>
          </div>
        </div>

        <FlexCarouselForm
          content={{
            altText: content.altText || 'รายการสินค้าประจำแคมเปญ',
            cards: content.cards || [],
          }}
          onChange={(carouselUpdated) =>
            onChange({
              ...content,
              altText: carouselUpdated.altText,
              cards: carouselUpdated.cards,
            })
          }
        />
      </div>
    </div>
  );
}
