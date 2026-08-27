'use client';

import React, { useState, useEffect } from 'react';
import { MediaAsset } from '@/types/message';
import { FolderOpen, Check, Upload, Trash2, X, Plus } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

export function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAssets = () => {
    setIsLoading(true);
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => setAssets(Array.isArray(data) ? data : []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchAssets();
    }
  }, [isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onSelect(data.url);
        onClose();
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-[#06C755] flex items-center justify-center">
              <FolderOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">เลือกรูปภาพจากคลัง (Media Library)</h3>
              <p className="text-[11px] text-slate-500">เลือกรูปภาพเดิม หรืออัปโหลดรูปใหม่จากเครื่อง</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Upload from Local button in header */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#06C755] hover:bg-[#05B04B] text-white text-xs font-bold shadow-xs cursor-pointer transition-colors">
              <Upload className="h-3.5 w-3.5" />
              <span>+ อัปโหลดรูปจากเครื่อง</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg text-sm"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {assets.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-3">
              <FolderOpen className="h-10 w-10 mx-auto text-slate-300" />
              <p className="font-medium text-slate-600">ยังไม่มีรูปภาพในคลัง</p>
              <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer">
                <Upload className="h-3.5 w-3.5" />
                <span>เลือกรูปจากเครื่องคอมพิวเตอร์</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelect(asset.url);
                    onClose();
                  }}
                  className="group relative rounded-xl border border-slate-200 overflow-hidden hover:border-[#06C755] hover:shadow-md cursor-pointer transition-all bg-slate-50 flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-200 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.url}
                      alt={asset.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#06C755] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                        เลือกรูปนี้
                      </span>
                    </div>
                  </div>
                  <div className="p-2 bg-white text-[11px]">
                    <div className="font-semibold text-slate-800 truncate" title={asset.fileName}>
                      {asset.fileName}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                      <span>{asset.width}x{asset.height}</span>
                      <span>{formatBytes(asset.fileSize)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
