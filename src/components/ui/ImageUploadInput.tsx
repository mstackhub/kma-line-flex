'use client';

import React, { useState, useRef } from 'react';
import { Upload, FolderOpen, Link as LinkIcon, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { MediaPickerModal } from '@/components/modals/MediaPickerModal';
import { compressImageFile } from '@/lib/imageCompressor';
import { cn } from '@/lib/utils';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
}

export function ImageUploadInput({
  value,
  onChange,
  label = 'รูปภาพ',
  placeholder = 'https://example.com/image.jpg หรืออัปโหลดจากเครื่อง',
  required = false,
  helperText,
}: ImageUploadInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Auto compress to max 1040px with high quality JPEG (100KB-200KB)
      const compressedFile = await compressImageFile(file, 1040, 1040, 0.85);

      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Quick Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center gap-1.5">
          {/* Pick from local file button */}
          <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#06C755] text-xs font-bold border border-emerald-200 cursor-pointer transition-colors">
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            <span>{isUploading ? 'กำลังอัปโหลด...' : 'เลือกรูปจากเครื่อง'}</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={isUploading}
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Pick from Media Library button */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <FolderOpen className="h-3.5 w-3.5 text-slate-500" />
            <span>คลังรูปภาพ</span>
          </button>
        </div>
      </div>

      {/* Input / Preview Box */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-300 pl-8 pr-8 py-2 text-xs font-mono focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
          />
          <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="ล้างค่า"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Thumbnail Preview Popup */}
        {value && (
          <div className="h-9 w-9 rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shrink-0 relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-400">{helperText}</p>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => onChange(url)}
      />
    </div>
  );
}
