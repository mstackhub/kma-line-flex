'use client';

import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Info,
  MousePointerClick,
} from 'lucide-react';
import { ImagemapArea, ImagemapMessageContent } from '@/types/message';
import { ImageUploadInput } from '@/components/ui/ImageUploadInput';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';

interface ImagemapVisualEditorProps {
  content: ImagemapMessageContent;
  onChange: (updated: ImagemapMessageContent) => void;
}

export function ImagemapVisualEditor({ content, onChange }: ImagemapVisualEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDraw, setCurrentDraw] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const baseWidth = content.baseSize?.width || 1040;
  const baseHeight = content.baseSize?.height || 1040;
  const actions = content.actions || [];

  // Handle Image load to calculate accurate aspect ratio and height
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      const calculatedHeight = Math.round((img.naturalHeight / img.naturalWidth) * 1040);
      onChange({
        ...content,
        baseSize: {
          width: 1040,
          height: calculatedHeight,
        },
      });
    }
  };

  // Convert mouse event position to 1040px normalized coordinate space
  const getCoordinatesFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const mouseY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const normalizedX = Math.round((mouseX / rect.width) * baseWidth);
    const normalizedY = Math.round((mouseY / rect.height) * baseHeight);

    return { x: normalizedX, y: normalizedY };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.zone-card-action')) return;

    const coords = getCoordinatesFromEvent(e);
    setIsDrawing(true);
    setDrawStart(coords);
    setCurrentDraw({ x: coords.x, y: coords.y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !drawStart) return;
    const current = getCoordinatesFromEvent(e);

    const x = Math.min(drawStart.x, current.x);
    const y = Math.min(drawStart.y, current.y);
    const width = Math.abs(current.x - drawStart.x);
    const height = Math.abs(current.y - drawStart.y);

    setCurrentDraw({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentDraw && currentDraw.width > 20 && currentDraw.height > 20) {
      const newAreaId = `area-${nanoid(6)}`;
      const newArea: ImagemapArea = {
        id: newAreaId,
        x: currentDraw.x,
        y: currentDraw.y,
        width: currentDraw.width,
        height: currentDraw.height,
        actionType: 'uri',
        label: `จุดคลิกที่ ${actions.length + 1}`,
        uri: 'https://',
      };

      onChange({
        ...content,
        actions: [...actions, newArea],
      });
      setSelectedAreaId(newAreaId);
    }
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentDraw(null);
  };

  const updateArea = (id: string, updates: Partial<ImagemapArea>) => {
    const updatedActions = actions.map((act) =>
      act.id === id ? { ...act, ...updates } : act
    );
    onChange({ ...content, actions: updatedActions });
  };

  const deleteArea = (id: string) => {
    const filtered = actions.filter((act) => act.id !== id);
    onChange({ ...content, actions: filtered });
    if (selectedAreaId === id) setSelectedAreaId(null);
  };

  // Quick Preset Layout Generator (e.g. 4-zone grid)
  const apply4ZonePreset = () => {
    const halfW = 520;
    const halfH = Math.round(baseHeight / 2);
    const newActions: ImagemapArea[] = [
      {
        id: `area-${nanoid(6)}`,
        x: 0,
        y: 0,
        width: halfW,
        height: halfH,
        actionType: 'uri',
        label: 'สินค้า 1 (บนซ้าย)',
        uri: 'https://myshop.line.me/product-1',
      },
      {
        id: `area-${nanoid(6)}`,
        x: halfW,
        y: 0,
        width: halfW,
        height: halfH,
        actionType: 'uri',
        label: 'สินค้า 2 (บนขวา)',
        uri: 'https://myshop.line.me/product-2',
      },
      {
        id: `area-${nanoid(6)}`,
        x: 0,
        y: halfH,
        width: halfW,
        height: halfH,
        actionType: 'uri',
        label: 'สินค้า 3 (ล่างซ้าย)',
        uri: 'https://myshop.line.me/product-3',
      },
      {
        id: `area-${nanoid(6)}`,
        x: halfW,
        y: halfH,
        width: halfW,
        height: halfH,
        actionType: 'uri',
        label: 'สินค้า 4 (ล่างขวา)',
        uri: 'https://myshop.line.me/product-4',
      },
    ];

    onChange({
      ...content,
      actions: newActions,
    });
  };

  return (
    <div className="space-y-6">
      {/* Artwork Source & Info */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">รูปภาพ Artwork สำหรับ Imagemap</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              รองรับรูปภาพ 1 ภาพที่มีหลายพื้นที่ให้ลูกค้ากดคลิก (ขนาดแนะนำ ความกว้าง 1040px)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={apply4ZonePreset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-[#06C755] hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>สร้างตาราง 4 โซนอัตโนมัติ</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ImageUploadInput
              label="รูปภาพ Artwork"
              required
              value={content.baseUrl || ''}
              onChange={(url) => onChange({ ...content, baseUrl: url })}
              placeholder="วาง URL หรือคลิก 'เลือกรูปจากเครื่อง'"
              helperText="ขนาดแนะนำ กว้าง 1040px"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ข้อความแจ้งเตือน (Alt Text) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={content.altText || ''}
              onChange={(e) => onChange({ ...content, altText: e.target.value })}
              placeholder="เช่น โปรโมชั่นแคมเปญพิเศษ 4 สินค้าขายดี"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Visual Drawing Area Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Top: Interactive Canvas */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-[#06C755]" />
              <span className="font-semibold text-sm text-slate-900">
                Visual Area Editor (ลากเมาส์บนภาพเพื่อสร้างพื้นที่คลิก)
              </span>
            </div>
            <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
              Base: {baseWidth} x {baseHeight} px
            </span>
          </div>

          {content.baseUrl ? (
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="relative w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-100 select-none cursor-crosshair group shadow-inner"
            >
              {/* Image element */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imageRef}
                src={content.baseUrl}
                alt="Imagemap Canvas"
                onLoad={handleImageLoad}
                className="w-full h-auto block pointer-events-none"
              />

              {/* Existing Defined Areas */}
              {actions.map((act, index) => {
                const isSelected = selectedAreaId === act.id;
                const leftPct = `${(act.x / baseWidth) * 100}%`;
                const topPct = `${(act.y / baseHeight) * 100}%`;
                const widthPct = `${(act.width / baseWidth) * 100}%`;
                const heightPct = `${(act.height / baseHeight) * 100}%`;

                return (
                  <div
                    key={act.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAreaId(act.id);
                    }}
                    style={{
                      left: leftPct,
                      top: topPct,
                      width: widthPct,
                      height: heightPct,
                    }}
                    className={cn(
                      'absolute transition-all cursor-pointer flex flex-col items-center justify-center p-1',
                      isSelected
                        ? 'border-2 border-[#06C755] bg-[#06C755]/30 z-20 shadow-md ring-2 ring-[#06C755]/50'
                        : 'border border-dashed border-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/35 z-10'
                    )}
                  >
                    <div className="bg-slate-950/85 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <span>{index + 1}</span>
                      {act.label && <span className="hidden sm:inline font-normal truncate max-w-[80px]">({act.label})</span>}
                    </div>
                  </div>
                );
              })}

              {/* Active Drawing Box */}
              {isDrawing && currentDraw && (
                <div
                  style={{
                    left: `${(currentDraw.x / baseWidth) * 100}%`,
                    top: `${(currentDraw.y / baseHeight) * 100}%`,
                    width: `${(currentDraw.width / baseWidth) * 100}%`,
                    height: `${(currentDraw.height / baseHeight) * 100}%`,
                  }}
                  className="absolute border-2 border-dashed border-amber-500 bg-amber-400/25 pointer-events-none z-30 flex items-center justify-center"
                >
                  <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                    กำลังลากกรอบ...
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Info className="h-8 w-8 mb-2 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">กรุณาใส่หรือเลือกรูปภาพ Artwork ด้านบนก่อน</p>
              <p className="text-xs text-slate-400 mt-1">หลังจากนั้นคุณจะสามารถลากกรอบกำหนดพื้นที่คลิกบนภาพได้ทันที</p>
            </div>
          )}
        </div>

        {/* Right / Bottom: Action Area Configurations */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">
              รายการพื้นที่คลิก ({actions.length} จุด)
            </h4>
            <button
              type="button"
              onClick={() => {
                const newId = `area-${nanoid(6)}`;
                const newArea: ImagemapArea = {
                  id: newId,
                  x: 0,
                  y: 0,
                  width: 520,
                  height: 520,
                  actionType: 'uri',
                  label: `จุดคลิกที่ ${actions.length + 1}`,
                  uri: 'https://',
                };
                onChange({ ...content, actions: [...actions, newArea] });
                setSelectedAreaId(newId);
              }}
              className="flex items-center gap-1 text-xs font-semibold text-[#06C755] hover:text-[#05B04B] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ เพิ่มจุดคลิก</span>
            </button>
          </div>

          {actions.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-xs text-slate-500">
              ยังไม่มีพื้นที่คลิก ลากเมาส์บนรูปภาพด้านซ้าย หรือกดปุ่ม "สร้างตาราง 4 โซนอัตโนมัติ" ด้านบน
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {actions.map((act, index) => {
                const isSelected = selectedAreaId === act.id;

                return (
                  <div
                    key={act.id}
                    onClick={() => setSelectedAreaId(act.id)}
                    className={cn(
                      'rounded-xl border p-4 transition-all space-y-3 cursor-pointer',
                      isSelected
                        ? 'bg-white border-[#06C755] shadow-xs ring-1 ring-[#06C755]/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    )}
                  >
                    {/* Zone Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white text-[11px] font-bold">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={act.label || ''}
                          onChange={(e) => updateArea(act.id, { label: e.target.value })}
                          placeholder={`จุดคลิกที่ ${index + 1}`}
                          className="text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-[#06C755] outline-none px-1 py-0.5 bg-transparent"
                        />
                      </div>

                      <div className="flex items-center gap-1 zone-card-action">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteArea(act.id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="ลบจุดนี้"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Action Type Picker */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => updateArea(act.id, { actionType: 'uri' })}
                        className={cn(
                          'flex items-center justify-center gap-1.5 py-1.5 rounded-lg border font-medium transition-colors',
                          act.actionType === 'uri'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        )}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>เปิดลิงก์ URL</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateArea(act.id, { actionType: 'message' })}
                        className={cn(
                          'flex items-center justify-center gap-1.5 py-1.5 rounded-lg border font-medium transition-colors',
                          act.actionType === 'message'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        )}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>ส่งข้อความแทน</span>
                      </button>
                    </div>

                    {/* Destination Config */}
                    {act.actionType === 'uri' ? (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ลิงก์เมื่อกด (Destination URL) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="url"
                          value={act.uri || ''}
                          onChange={(e) => updateArea(act.id, { uri: e.target.value })}
                          placeholder="https://myshop.line.me/product-1"
                          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          ข้อความที่จะส่งเมื่อผู้ใช้แตะรูป <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={act.text || ''}
                          onChange={(e) => updateArea(act.id, { text: e.target.value })}
                          placeholder="เช่น สนใจโปรโมชั่น 1"
                          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
                        />
                      </div>
                    )}

                    {/* Coordinate details */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg font-mono">
                      <span>X: {act.x}px, Y: {act.y}px</span>
                      <span>กว้าง: {act.width}px, สูง: {act.height}px</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
