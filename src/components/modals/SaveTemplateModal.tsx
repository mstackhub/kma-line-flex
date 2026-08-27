'use client';

import React, { useState } from 'react';
import { LayoutTemplate, Loader2, CheckCircle2, BookmarkPlus } from 'lucide-react';
import { Campaign, Template } from '@/types/message';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign;
  onSuccess?: () => void;
}

export function SaveTemplateModal({
  isOpen,
  onClose,
  campaign,
  onSuccess,
}: SaveTemplateModalProps) {
  const [templateName, setTemplateName] = useState(campaign.name || 'Template ใหม่');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'promotion' | 'product' | 'announcement' | 'ecommerce'>('promotion');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!templateName.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName.trim(),
          description: description.trim() || 'Template บันทึกจากแคมเปญ ' + campaign.name,
          category,
          messageType: campaign.messageType,
          defaultContent: campaign.content,
        }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการบันทึก Template');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-[#06C755] flex items-center justify-center">
              <BookmarkPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">บันทึกเป็น Template ใหม่</h3>
              <p className="text-[11px] text-slate-500">บันทึกโครงสร้างนี้เพื่อนำกลับมาใช้ซ้ำในอนาคต</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm">
            ✕
          </button>
        </div>

        {saved ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-[#06C755] mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-900 text-sm">บันทึก Template สำเร็จ!</h4>
            <p className="text-xs text-slate-500">คุณสามารถเลือกใช้ Template นี้ได้จากหน้าสร้างแคมเปญใหม่</p>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ชื่อ Template <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="เช่น Flash Sale 4 Cards"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:border-[#06C755] outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                หมวดหมู่
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-[#06C755] outline-none bg-white"
              >
                <option value="promotion">โปรโมชั่น (Promotion)</option>
                <option value="product">สินค้าเดี่ยว (Product)</option>
                <option value="ecommerce">E-Commerce & Carousel</option>
                <option value="announcement">ประกาศทั่วไป (Announcement)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                คำอธิบายสั้นๆ
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ระบุจุดประสงค์ของ Template นี้..."
                className="w-full rounded-xl border border-slate-300 p-2.5 focus:border-[#06C755] outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading || !templateName.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] text-white font-bold shadow-xs disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <span>บันทึก Template</span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
