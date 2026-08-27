'use client';

import React, { useState } from 'react';
import { FlexCarouselContent, FlexCardContent } from '@/types/message';
import { FlexCardForm } from './FlexCardForm';
import {
  Plus,
  Copy,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';

interface FlexCarouselFormProps {
  content: FlexCarouselContent;
  onChange: (updated: FlexCarouselContent) => void;
}

export function FlexCarouselForm({ content, onChange }: FlexCarouselFormProps) {
  const cards = content.cards && content.cards.length > 0 ? content.cards : [];
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const safeIndex = Math.min(Math.max(0, activeCardIndex), Math.max(0, cards.length - 1));
  const currentCard = cards[safeIndex] || {
    id: `card-${nanoid(6)}`,
    headline: '',
    ctaLabel: 'ช้อปเลย',
    ctaUrl: 'https://',
  };

  const handleAddCard = () => {
    if (cards.length >= 12) {
      alert('LINE รองรับ Carousel ได้สูงสุด 12 การ์ด');
      return;
    }
    const newCard: FlexCardContent = {
      id: `card-${nanoid(6)}`,
      badge: 'NEW',
      headline: `สินค้าใหม่ ${cards.length + 1}`,
      subheadline: 'รายละเอียดจุดเด่นสินค้า',
      originalPrice: '1,590',
      salePrice: '990',
      currencySymbol: '฿',
      ctaLabel: 'ช้อปเลย',
      ctaUrl: 'https://myshop.line.me',
      ctaColor: '#06C755',
    };
    const updated = [...cards, newCard];
    onChange({ ...content, cards: updated });
    setActiveCardIndex(updated.length - 1);
  };

  const handleDuplicateCard = (index: number) => {
    if (cards.length >= 12) {
      alert('LINE รองรับ Carousel ได้สูงสุด 12 การ์ด');
      return;
    }
    const target = cards[index];
    const duplicated: FlexCardContent = {
      ...target,
      id: `card-${nanoid(6)}`,
      headline: `${target.headline || 'สินค้า'} (Copy)`,
    };
    const updated = [...cards.slice(0, index + 1), duplicated, ...cards.slice(index + 1)];
    onChange({ ...content, cards: updated });
    setActiveCardIndex(index + 1);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      alert('Carousel ต้องมีการ์ดอย่างน้อย 1 การ์ด');
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

  const updateCurrentCard = (updatedCard: FlexCardContent) => {
    const updatedCards = [...cards];
    updatedCards[safeIndex] = updatedCard;
    onChange({ ...content, cards: updatedCards });
  };

  return (
    <div className="space-y-6">
      {/* Alt Text Header */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          ข้อความแจ้งเตือนแทนรูปภาพ (Alt Text) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={content.altText || ''}
          onChange={(e) => onChange({ ...content, altText: e.target.value })}
          placeholder="เช่น รายการสินค้าไฮไลต์พิเศษลดสูงสุด 50%"
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
        />
        <p className="text-[11px] text-slate-400 mt-1">
          จำเป็นสำหรับ LINE Flex Messages เพื่อแสดงผลในการแจ้งเตือนบนหน้าจอมือถือ
        </p>
      </div>

      {/* Card Navigation & Management Tabs */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#06C755]" />
            <span className="font-bold text-slate-900 text-sm">
              จัดการการ์ดใน Carousel ({cards.length} / 12 การ์ด)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddCard}
              disabled={cards.length >= 12}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-[#06C755] hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>+ เพิ่มการ์ดใหม่</span>
            </button>
          </div>
        </div>

        {/* Carousel Tabs Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 line-chat-scroll">
          {cards.map((card, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={card.id || idx}
                type="button"
                onClick={() => setActiveCardIndex(idx)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0',
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                )}
              >
                <span
                  className={cn(
                    'h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold',
                    isActive ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-700'
                  )}
                >
                  {idx + 1}
                </span>
                <span className="max-w-[100px] truncate">{card.headline || `การ์ดที่ ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>

        {/* Current Active Card Controls */}
        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <span>กำลังแก้ไข:</span>
            <span className="text-[#06C755]">การ์ดที่ {safeIndex + 1} ({currentCard.headline || 'ยังไม่มีชื่อ'})</span>
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
              title="ทำสำเนาการ์ดนี้"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>คัดลอก</span>
            </button>
            <button
              type="button"
              onClick={() => handleDeleteCard(safeIndex)}
              className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
              title="ลบการ์ดนี้"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>ลบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Card Form Editor */}
      <FlexCardForm
        card={currentCard}
        onChange={updateCurrentCard}
        indexLabel={`การ์ดที่ ${safeIndex + 1}`}
      />
    </div>
  );
}
