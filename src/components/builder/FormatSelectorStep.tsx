'use client';

import React, { useState } from 'react';
import { MessageType } from '@/types/message';
import {
  MessageSquare,
  Image as ImageIcon,
  LayoutGrid,
  CreditCard,
  Layers,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormatSelectorStepProps {
  selectedType: MessageType;
  onSelect: (type: MessageType) => void;
  onOpenAiHelper?: () => void;
}

const FORMAT_OPTIONS: {
  type: MessageType;
  title: string;
  badge?: string;
  description: string;
  icon: any;
  suitableFor: string;
}[] = [
  {
    type: 'text',
    title: 'Text Message',
    badge: 'ธรรมดา',
    description: 'ข้อความตัวอักษร Broadcast แจ้งเตือนสั้นๆ หรือข่าวสารทั่วไป',
    icon: MessageSquare,
    suitableFor: 'ประกาศสั้น, แจ้งเตือนด่วน, แจ้งวันหยุด',
  },
  {
    type: 'image',
    title: 'Single Image',
    badge: 'รูปเดียว',
    description: 'รูปภาพโปสเตอร์หรือแบนเนอร์เดี่ยวขนาดใหญ่ พร้อม Alt Text',
    icon: ImageIcon,
    suitableFor: 'โปสเตอร์โปรโมชั่น, ภาพงานอีเวนต์, Artwork เดี่ยว',
  },
  {
    type: 'image_carousel',
    title: 'Image Carousel',
    badge: 'ภาพชุดสไลด์ 🖼️',
    description: 'รูปภาพล้วนแบบเลื่อนสไลด์ (1:1 Square, 16:9 Banner) แตะที่รูปเพื่อเปิดลิงก์',
    icon: LayoutGrid,
    suitableFor: 'Lookbook แฟชั่น, คอลเลกชันภาพชุด, Multi-Poster เลื่อนดู',
  },
  {
    type: 'imagemap',
    title: 'Imagemap',
    badge: 'หลายจุดคลิก',
    description: 'ภาพเดียวแบ่งหลายพื้นที่คลิก แต่ละจุดแยกไปคนละ URL ได้',
    icon: LayoutGrid,
    suitableFor: 'Catalog ภาพเดียว, 4 สินค้าขายดี, เมนูโปรโมชั่นแยกหมวด',
  },
  {
    type: 'flex_card',
    title: 'Flex Single Card',
    badge: 'การ์ดเดี่ยว',
    description: 'การ์ดสินค้าเน้นไฮไลต์ พร้อมรูป ป้ายโปร ราคา และปุ่มช้อปเลย',
    icon: CreditCard,
    suitableFor: 'เปิดตัวสินค้าใหม่ 1 ตัว, Flash Deal ไฮไลต์เดี่ยว',
  },
  {
    type: 'flex_carousel',
    title: 'Flex Carousel',
    badge: 'ยอดนิยม 🌟',
    description: 'แคตตาล็อกสินค้าแบบเลื่อนสไลด์ (Swipe) สวยงาม รองรับ 1-12 การ์ด',
    icon: Layers,
    suitableFor: 'Payday, รวมสินค้าใหม่, สินค้าขายดี 4-10 รายการ',
  },
  {
    type: 'hero_carousel',
    title: 'Hero + Carousel',
    badge: 'แคมเปญใหญ่',
    description: 'ลำดับ 2 ข้อความ: ภาพ Banner ใหญ่ด้านบน + การ์ดสินค้าสไลด์ตามติด',
    icon: Sparkles,
    suitableFor: '9.9 / 11.11, Payday Sale, Mid Month Big Sale',
  },
  {
    type: 'mixed',
    title: 'Mixed Message',
    badge: 'Advanced',
    description: 'จัดลำดับอิสระได้สูงสุด 5 บล็อกข้อความ (Text, Image, Flex)',
    icon: Layers,
    suitableFor: 'ทักทาย + แจกโค้ด + โปสเตอร์ + รายการสินค้า',
  },
];

export function FormatSelectorStep({
  selectedType,
  onSelect,
  onOpenAiHelper,
}: FormatSelectorStepProps) {
  const [showHelperModal, setShowHelperModal] = useState(false);

  // Questionnaire Helper States
  const [qProductCount, setQProductCount] = useState<string>('multiple');
  const [qSwipe, setQSwipe] = useState<string>('yes');
  const [qArtworkZones, setQArtworkZones] = useState<string>('no');
  const [qHeroBanner, setQHeroBanner] = useState<string>('no');

  // Compute recommended format from questionnaire
  let suggestedFormat: MessageType = 'flex_carousel';
  let suggestionReason = '';

  if (qProductCount === 'none') {
    suggestedFormat = 'text';
    suggestionReason = 'ไม่มีรูปสินค้า ต้องการส่งข้อความประกาศข่าวสาร';
  } else if (qProductCount === 'single') {
    suggestedFormat = 'flex_card';
    suggestionReason = 'มีสินค้าเดี่ยว 1 รายการ แนะนำ Flex Single Card เพื่อให้เห็นปุ่มสั่งซื้อชัดเจน';
  } else if (qArtworkZones === 'yes') {
    suggestedFormat = 'imagemap';
    suggestionReason = 'มี Artwork ภาพเดียวแต่ต้องการให้กดแยกหลายจุด แนะนำ Imagemap';
  } else if (qHeroBanner === 'yes') {
    suggestedFormat = 'hero_carousel';
    suggestionReason = 'มีภาพ Banner ประจำแคมเปญและสินค้าหลายชิ้น แนะนำ Hero + Carousel';
  } else {
    suggestedFormat = 'flex_carousel';
    suggestionReason = 'สินค้าหลายรายการและต้องการให้ลูกค้าเลื่อนดู แนะนำ Flex Carousel';
  }

  return (
    <div className="space-y-6">
      {/* Helper Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#06C755] flex items-center justify-center text-white shrink-0 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">ไม่แน่ใจว่าควรเลือกรูปแบบไหนดี?</h3>
            <p className="text-xs text-slate-600">
              ตอบคำถามสั้นๆ 3 ข้อ หรือพิมพ์รายละเอียดให้ AI ช่วยวิเคราะห์รูปแบบที่เหมาะสมที่สุด
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHelperModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-800 hover:bg-slate-50 text-xs font-bold border border-slate-300 shadow-2xs transition-colors"
          >
            <HelpCircle className="h-4 w-4 text-[#06C755]" />
            <span>ตอบแบบสอบถามช่วยเลือก</span>
          </button>

          {onOpenAiHelper && (
            <button
              type="button"
              onClick={onOpenAiHelper}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#06C755] text-white hover:bg-[#05B04B] text-xs font-bold shadow-2xs transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Content Assistant</span>
            </button>
          )}
        </div>
      </div>

      {/* Format Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FORMAT_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedType === opt.type;

          return (
            <div
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              className={cn(
                'group relative rounded-2xl border p-5 transition-all cursor-pointer flex flex-col justify-between hover:shadow-md',
                isSelected
                  ? 'bg-white border-[#06C755] shadow-sm ring-2 ring-[#06C755]/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              )}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={cn(
                      'h-11 w-11 rounded-xl flex items-center justify-center transition-colors',
                      isSelected
                        ? 'bg-[#06C755] text-white'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-[#06C755]'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {opt.badge && (
                    <span
                      className={cn(
                        'text-[11px] font-bold px-2 py-0.5 rounded-md',
                        isSelected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      )}
                    >
                      {opt.badge}
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-slate-900 text-base mb-1 group-hover:text-[#06C755] transition-colors">
                  {opt.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {opt.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate max-w-[180px]">เหมาะกับ: {opt.suitableFor}</span>
                {isSelected ? (
                  <CheckCircle2 className="h-4 w-4 text-[#06C755] shrink-0" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Helper Modal */}
      {showHelperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#06C755]" />
                <h3 className="font-bold text-slate-900 text-base">ตัวช่วยเลือกรูปแบบข้อความ (Format Helper)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelperModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Questions */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1.5">
                  1. คุณมีสินค้าหรือเนื้อหาที่จะส่งกี่รายการ?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'multiple', label: 'หลายสินค้า (2-12 ชิ้น)' },
                    { id: 'single', label: 'สินค้าเดียว (1 ชิ้น)' },
                    { id: 'none', label: 'ไม่มี (ข้อความอย่างเดียว)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setQProductCount(item.id)}
                      className={cn(
                        'p-2.5 rounded-xl border text-center font-medium transition-all',
                        qProductCount === item.id
                          ? 'border-[#06C755] bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {qProductCount !== 'none' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1.5">
                      2. เป็น Artwork ภาพเดียว แต่ต้องการให้กดแยกหลายจุดหรือไม่?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'no', label: 'ไม่ใช่ (แยกรูปแต่ละสินค้า)' },
                        { id: 'yes', label: 'ใช่ (ภาพเดียวหลายโซนคลิก)' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setQArtworkZones(item.id)}
                          className={cn(
                            'p-2.5 rounded-xl border text-center font-medium transition-all',
                            qArtworkZones === item.id
                              ? 'border-[#06C755] bg-emerald-50 text-emerald-800 font-bold'
                              : 'border-slate-200 bg-slate-50 text-slate-600'
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {qArtworkZones === 'no' && (
                    <div>
                      <label className="block font-semibold text-slate-800 mb-1.5">
                        3. ต้องการภาพ Banner แคมเปญใหญ่ด้านบน แล้วตามด้วยรายการสินค้าหรือไม่?
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'yes', label: 'ต้องการ (Hero Banner + สินค้า)' },
                          { id: 'no', label: 'ไม่ต้อง (แสดงเฉพาะการ์ดสินค้า)' },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setQHeroBanner(item.id)}
                            className={cn(
                              'p-2.5 rounded-xl border text-center font-medium transition-all',
                              qHeroBanner === item.id
                                ? 'border-[#06C755] bg-emerald-50 text-emerald-800 font-bold'
                                : 'border-slate-200 bg-slate-50 text-slate-600'
                            )}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Recommendation Result */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                  ✓ รูปแบบที่ระบบแนะนำสำหรับคุณ:
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-xs">
                  {suggestedFormat.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                {suggestionReason}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowHelperModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                ปิด
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelect(suggestedFormat);
                  setShowHelperModal(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] text-white text-xs font-bold shadow-xs"
              >
                <span>เลือกรูปแบบนี้และเริ่มสร้าง</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
