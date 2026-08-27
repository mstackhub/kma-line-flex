'use client';

import React, { useState } from 'react';
import { ImageCarouselContent, ImageCarouselCard } from '@/types/message';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import {
  Plus,
  Trash2,
  Copy,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Images,
  Layers,
  Sparkles,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';

interface ImageCarouselFormProps {
  content: ImageCarouselContent;
  onChange: (updated: ImageCarouselContent) => void;
}

const ASPECT_RATIOS: { id: ImageCarouselContent['aspectRatio']; label: string; desc: string }[] = [
  { id: '1:1', label: '1:1 Square', desc: 'สี่เหลี่ยมจัตุรัส เหมาะสำหรับ Lookbook และสินค้าเด่น' },
  { id: '20:13', label: '20:13 Standard', desc: 'มาตรฐาน LINE Flex สัดส่วนทั่วไป' },
  { id: '16:9', label: '16:9 Banner', desc: 'แบนเนอร์แนวนอนกว้าง' },
  { id: '9:16', label: '9:16 Portrait', desc: 'แนวตั้งแบบ Story/Poster' },
];

export function ImageCarouselForm({ content, onChange }: ImageCarouselFormProps) {
  const cards = content.cards || [];
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const safeIndex = Math.min(Math.max(0, activeCardIndex), Math.max(0, cards.length - 1));
  const currentCard = cards[safeIndex] || {
    id: `img-card-${nanoid(6)}`,
    imageUrl: '',
    actionType: 'uri',
    uri: 'https://',
    label: 'รูปภาพ',
  };

  const handleAddCard = () => {
    if (cards.length >= 12) {
      alert('LINE รองรับ Carousel ได้สูงสุด 12 ภาพ');
      return;
    }
    const newCard: ImageCarouselCard = {
      id: `img-card-${nanoid(6)}`,
      imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
      actionType: 'uri',
      uri: 'https://myshop.line.me',
      label: `โปรโมชั่น ${cards.length + 1}`,
    };
    const updated = [...cards, newCard];
    onChange({ ...content, cards: updated });
    setActiveCardIndex(updated.length - 1);
  };

  const handleDuplicateCard = (index: number) => {
    if (cards.length >= 12) {
      alert('LINE รองรับ Carousel ได้สูงสุด 12 ภาพ');
      return;
    }
    const target = cards[index];
    const duplicated: ImageCarouselCard = {
      ...target,
      id: `img-card-${nanoid(6)}`,
      label: `${target.label || 'ภาพ'} (Copy)`,
    };
    const updated = [...cards.slice(0, index + 1), duplicated, ...cards.slice(index + 1)];
    onChange({ ...content, cards: updated });
    setActiveCardIndex(index + 1);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      alert('Image Carousel ต้องมีรูปภาพอย่างน้อย 1 ภาพ');
      return;
    }
    const updated = cards.filter((_, i) => i !== index);
    onChange({ ...content, cards: updated });
    setActiveCardIndex(Math.max(0, index - 1));
  };

  const handleMoveCard = (fromIndex: number, direction: 'left' | 'right') => {
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= cards.length) return;

    const newCards = [...cards];
    const [moved] = newCards.splice(fromIndex, 1);
    newCards.splice(toIndex, 0, moved);

    onChange({ ...content, cards: newCards });
    setActiveCardIndex(toIndex);
  };

  const updateCurrentCard = (updates: Partial<ImageCarouselCard>) => {
    const updatedCards = [...cards];
    updatedCards[safeIndex] = { ...updatedCards[safeIndex], ...updates };
    onChange({ ...content, cards: updatedCards });
  };

  return (
    <div className="space-y-6">
      {/* Header & Aspect Ratio Settings */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            ข้อความแจ้งเตือนแทนรูปภาพ (Alt Text) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={content.altText || ''}
            onChange={(e) => onChange({ ...content, altText: e.target.value })}
            placeholder="เช่น รวมภาพโปรโมชั่นและสินค้าไฮไลต์ประจำสัปดาห์"
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
          />
        </div>

        {/* Aspect Ratio Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            สัดส่วนรูปภาพ (Aspect Ratio)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ASPECT_RATIOS.map((ratio) => {
              const isSelected = (content.aspectRatio || '1:1') === ratio.id;
              return (
                <button
                  key={ratio.id}
                  type="button"
                  onClick={() => onChange({ ...content, aspectRatio: ratio.id })}
                  className={cn(
                    'p-2.5 rounded-xl border text-left transition-all',
                    isSelected
                      ? 'border-[#06C755] bg-emerald-50 text-emerald-900 font-bold shadow-2xs'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <div className="text-xs">{ratio.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                    {ratio.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards Strip & Selector */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Images className="h-5 w-5 text-[#06C755]" />
            <span className="font-bold text-slate-900 text-sm">
              จัดการภาพใน Carousel ({cards.length} / 12 ภาพ)
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddCard}
            disabled={cards.length >= 12}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#06C755] hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            <span>+ เพิ่มภาพใหม่</span>
          </button>
        </div>

        {/* Thumbnail Navigation Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 line-chat-scroll">
          {cards.map((card, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={card.id || idx}
                type="button"
                onClick={() => setActiveCardIndex(idx)}
                className={cn(
                  'flex items-center gap-2 p-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0',
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                )}
              >
                {card.imageUrl ? (
                  <div className="h-7 w-7 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <span
                    className={cn(
                      'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                      isActive ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
                    )}
                  >
                    {idx + 1}
                  </span>
                )}
                <span className="max-w-[80px] truncate">{card.label || `ภาพที่ ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>

        {/* Current Active Card Controls */}
        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <span>กำลังแก้ไข:</span>
            <span className="text-[#06C755]">ภาพที่ {safeIndex + 1} ({currentCard.label || 'ยังไม่ได้ตั้งชื่อ'})</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleMoveCard(safeIndex, 'left')}
              disabled={safeIndex === 0}
              className="p-1 text-slate-500 hover:text-slate-900 rounded disabled:opacity-30"
              title="เลื่อนไปทางซ้าย"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleMoveCard(safeIndex, 'right')}
              disabled={safeIndex === cards.length - 1}
              className="p-1 text-slate-500 hover:text-slate-900 rounded disabled:opacity-30"
              title="เลื่อนไปทางขวา"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={() => handleDuplicateCard(safeIndex)}
              className="flex items-center gap-1 px-2 py-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-200 transition-colors"
              title="ทำสำเนาภาพนี้"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>คัดลอก</span>
            </button>
            <button
              type="button"
              onClick={() => handleDeleteCard(safeIndex)}
              className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
              title="ลบภาพนี้"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>ลบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Image Card Form */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            ชื่ออ้างอิงภาพ (Label) <span className="text-[11px] font-normal text-slate-400">(สำหรับจำง่าย)</span>
          </label>
          <input
            type="text"
            value={currentCard.label || ''}
            onChange={(e) => updateCurrentCard({ label: e.target.value })}
            placeholder={`เช่น แบนเนอร์ ${safeIndex + 1}`}
            className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-[#06C755] outline-none font-medium"
          />
        </div>

        {/* Local File Upload / URL input */}
        <ImageUploadInput
          label="ไฟล์รูปภาพ (Image)"
          required
          value={currentCard.imageUrl || ''}
          onChange={(url) => updateCurrentCard({ imageUrl: url })}
          placeholder="วาง URL หรือคลิก 'เลือกรูปจากเครื่อง'"
          helperText={`สัดส่วนที่เลือกไว้คือ ${content.aspectRatio || '1:1'}`}
        />

        {/* Action Type when Tapping Image */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            การกระทำเมื่อผู้ใช้แตะที่รูป (Action on Tap)
          </label>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => updateCurrentCard({ actionType: 'uri' })}
              className={cn(
                'flex items-center justify-center gap-1.5 py-2 rounded-xl border font-medium transition-colors',
                currentCard.actionType === 'uri'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>เปิดลิงก์ URL</span>
            </button>

            <button
              type="button"
              onClick={() => updateCurrentCard({ actionType: 'message' })}
              className={cn(
                'flex items-center justify-center gap-1.5 py-2 rounded-xl border font-medium transition-colors',
                currentCard.actionType === 'message'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              )}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>ส่งข้อความแทน</span>
            </button>
          </div>

          {currentCard.actionType === 'uri' ? (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                ลิงก์ปลายทาง (Destination URL)
              </label>
              <input
                type="url"
                value={currentCard.uri || ''}
                onChange={(e) => updateCurrentCard({ uri: e.target.value })}
                placeholder="https://myshop.line.me/product"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-[#06C755] outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                ข้อความที่จะส่งตอบกลับเมื่อแตะรูป
              </label>
              <input
                type="text"
                value={currentCard.text || ''}
                onChange={(e) => updateCurrentCard({ text: e.target.value })}
                placeholder="เช่น สนใจโปรโมชั่นภาพนี้"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs focus:border-[#06C755] outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
