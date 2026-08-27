'use client';

import React, { useState } from 'react';
import { MixedMessageContent, MixedBlock } from '@/types/message';
import { TextForm } from './TextForm';
import { ImageForm } from './ImageForm';
import { ImagemapForm } from './ImagemapForm';
import { FlexCardForm } from './FlexCardForm';
import { FlexCarouselForm } from './FlexCarouselForm';
import {
  Plus,
  Trash2,
  Layers,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Image as ImageIcon,
  LayoutGrid,
  CreditCard,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';

interface MixedMessageFormProps {
  content: MixedMessageContent;
  onChange: (updated: MixedMessageContent) => void;
}

export function MixedMessageForm({ content, onChange }: MixedMessageFormProps) {
  const blocks = content.blocks || [];
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);

  const safeIndex = Math.min(Math.max(0, activeBlockIndex), Math.max(0, blocks.length - 1));
  const currentBlock = blocks[safeIndex];

  const handleAddBlock = (type: MixedBlock['type']) => {
    if (blocks.length >= 5) {
      alert('LINE รองรับการส่งข้อความพร้อมกันได้สูงสุด 5 บล็อกต่อ 1 การ Broadcast');
      return;
    }

    let defaultContent: any = {};
    if (type === 'text') defaultContent = { text: 'ข้อความใหม่...' };
    if (type === 'image')
      defaultContent = {
        originalContentUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1040&auto=format&fit=crop&q=80',
        previewImageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
        altText: 'รูปภาพโปรโมชั่น',
      };
    if (type === 'imagemap')
      defaultContent = {
        baseUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1040&auto=format&fit=crop&q=80',
        altText: 'Imagemap โปรโมชั่น',
        baseSize: { width: 1040, height: 1040 },
        actions: [],
      };
    if (type === 'flex_card')
      defaultContent = {
        badge: 'NEW',
        headline: 'สินค้าแนะนำ',
        originalPrice: '1,290',
        salePrice: '890',
        ctaLabel: 'ช้อปเลย',
        ctaUrl: 'https://myshop.line.me',
      };
    if (type === 'flex_carousel')
      defaultContent = {
        altText: 'รายการสินค้า',
        cards: [
          {
            badge: 'HOT',
            headline: 'สินค้าที่ 1',
            originalPrice: '1,590',
            salePrice: '990',
            ctaLabel: 'ช้อปเลย',
            ctaUrl: 'https://myshop.line.me',
          },
        ],
      };

    const newBlock: MixedBlock = {
      id: `block-${nanoid(6)}`,
      type,
      content: defaultContent,
    };

    const updated = [...blocks, newBlock];
    onChange({ ...content, blocks: updated });
    setActiveBlockIndex(updated.length - 1);
  };

  const handleDeleteBlock = (index: number) => {
    if (blocks.length <= 1) {
      alert('Mixed Message ต้องมีบล็อกข้อความอย่างน้อย 1 บล็อก');
      return;
    }
    const updated = blocks.filter((_, i) => i !== index);
    onChange({ ...content, blocks: updated });
    setActiveBlockIndex(Math.max(0, index - 1));
  };

  const handleMoveBlock = (fromIndex: number, direction: 'up' | 'down') => {
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, moved);

    onChange({ ...content, blocks: newBlocks });
    setActiveBlockIndex(toIndex);
  };

  const updateCurrentBlockContent = (updatedBlockContent: any) => {
    const updatedBlocks = [...blocks];
    updatedBlocks[safeIndex] = {
      ...updatedBlocks[safeIndex],
      content: updatedBlockContent,
    };
    onChange({ ...content, blocks: updatedBlocks });
  };

  return (
    <div className="space-y-6">
      {/* Alt Text Header */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          ข้อความแจ้งเตือน (Alt Text) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={content.altText || ''}
          onChange={(e) => onChange({ ...content, altText: e.target.value })}
          placeholder="เช่น รวมข้อเสนอพิเศษประจำสัปดาห์"
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
        />
      </div>

      {/* Blocks Sequence Manager */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-[#06C755]" />
            <span className="font-bold text-slate-900 text-sm">
              ลำดับบล็อกข้อความ ({blocks.length} / 5 บล็อก)
            </span>
          </div>

          {/* Add Block Types Picker */}
          {blocks.length < 5 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 mr-1">+ เพิ่ม:</span>
              <button
                type="button"
                onClick={() => handleAddBlock('text')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('image')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('imagemap')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Imagemap
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('flex_card')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#06C755]"
              >
                Flex Card
              </button>
              <button
                type="button"
                onClick={() => handleAddBlock('flex_carousel')}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#06C755]"
              >
                Flex Carousel
              </button>
            </div>
          )}
        </div>

        {/* Blocks Horizontal Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 line-chat-scroll">
          {blocks.map((block, idx) => {
            const isActive = idx === safeIndex;
            return (
              <button
                key={block.id || idx}
                type="button"
                onClick={() => setActiveBlockIndex(idx)}
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
                <span className="uppercase">{block.type.replace('_', ' ')}</span>
              </button>
            );
          })}
        </div>

        {/* Current Active Block Reorder and Actions */}
        {currentBlock && (
          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl text-xs">
            <div className="font-semibold text-slate-700">
              บล็อกที่ {safeIndex + 1}: <span className="uppercase text-[#06C755] font-bold">{currentBlock.type}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMoveBlock(safeIndex, 'up')}
                disabled={safeIndex === 0}
                className="p-1 text-slate-500 hover:text-slate-900 rounded disabled:opacity-30"
                title="เลื่อนขึ้น"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveBlock(safeIndex, 'down')}
                disabled={safeIndex === blocks.length - 1}
                className="p-1 text-slate-500 hover:text-slate-900 rounded disabled:opacity-30"
                title="เลื่อนลง"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-slate-300 mx-1" />
              <button
                type="button"
                onClick={() => handleDeleteBlock(safeIndex)}
                className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                title="ลบบล็อกนี้"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>ลบ</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render Active Sub-Form */}
      {currentBlock && (
        <div>
          {currentBlock.type === 'text' && (
            <TextForm
              content={currentBlock.content as any}
              onChange={updateCurrentBlockContent}
            />
          )}
          {currentBlock.type === 'image' && (
            <ImageForm
              content={currentBlock.content as any}
              onChange={updateCurrentBlockContent}
            />
          )}
          {currentBlock.type === 'imagemap' && (
            <ImagemapForm
              content={currentBlock.content as any}
              onChange={updateCurrentBlockContent}
            />
          )}
          {currentBlock.type === 'flex_card' && (
            <FlexCardForm
              card={currentBlock.content as any}
              onChange={updateCurrentBlockContent}
            />
          )}
          {currentBlock.type === 'flex_carousel' && (
            <FlexCarouselForm
              content={currentBlock.content as any}
              onChange={updateCurrentBlockContent}
            />
          )}
        </div>
      )}
    </div>
  );
}
