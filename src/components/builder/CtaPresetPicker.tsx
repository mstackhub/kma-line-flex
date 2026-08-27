'use client';

import React from 'react';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CtaPresetPickerProps {
  value: string;
  onChange: (label: string) => void;
  ctaColor?: string;
  onColorChange?: (color: string) => void;
}

const PRESETS = [
  'ช้อปเลย',
  'ดูสินค้า',
  'ดูรายละเอียด',
  'รับโปรเลย',
  'ดูโปรโมชั่น',
  'เลือกสี',
  'ดูเพิ่มเติม',
  'สั่งซื้อทันที',
];

const COLOR_PRESETS = [
  { label: 'LINE Green', value: '#06C755' },
  { label: 'Deep Emerald', value: '#059669' },
  { label: 'Ruby Red', value: '#DC2626' },
  { label: 'Sunset Amber', value: '#D97706' },
  { label: 'Indigo Blue', value: '#4F46E5' },
  { label: 'Midnight Black', value: '#111827' },
];

export function CtaPresetPicker({
  value,
  onChange,
  ctaColor = '#06C755',
  onColorChange,
}: CtaPresetPickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>ข้อความบนปุ่ม (CTA Label) <span className="text-red-500">*</span></span>
          <span className="text-[11px] font-normal text-slate-400">เลือกข้อความด่วนด้านล่าง</span>
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="เช่น ช้อปเลย, ดูสินค้า"
          className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
        />

        {/* Preset Badges */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs transition-colors border',
                value === preset
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Button Color Preset */}
      {onColorChange && (
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            สีของปุ่มกด (Button Color)
          </label>
          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((col) => (
              <button
                key={col.value}
                type="button"
                onClick={() => onColorChange(col.value)}
                title={col.label}
                className={cn(
                  'h-6 w-6 rounded-full border-2 transition-all',
                  ctaColor === col.value
                    ? 'border-slate-900 scale-110 shadow-xs'
                    : 'border-white hover:scale-105'
                )}
                style={{ backgroundColor: col.value }}
              />
            ))}
            <input
              type="color"
              value={ctaColor}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-6 w-8 p-0 border border-slate-300 rounded cursor-pointer ml-2"
              title="เลือกสีแบบ Custom"
            />
          </div>
        </div>
      )}
    </div>
  );
}
