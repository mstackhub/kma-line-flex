'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Plus,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Upload,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { MediaAsset } from '@/types/message';
import { formatBytes } from '@/lib/utils';

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);

  const fetchAssets = () => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => setAssets(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณต้องการลบรูปภาพนี้ออกจาก Media Library ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAssets();
    } catch {
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const handleDirectLocalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingLocal(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        fetchAssets();
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
    } finally {
      setIsUploadingLocal(false);
      e.target.value = '';
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setIsAdding(true);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newImageUrl.trim(),
          fileName: newFileName.trim() || 'artwork.jpg',
          fileSize: 180000,
          width: 1040,
          height: 650,
          mimeType: 'image/jpeg',
        }),
      });

      if (res.ok) {
        setNewImageUrl('');
        setNewFileName('');
        setShowAddModal(false);
        fetchAssets();
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการบันทึกรูป');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">คลังรูปภาพ (Media Library)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {assets.length} รูป
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดเก็บ อัปโหลดจากเครื่องคอมพิวเตอร์ และนำลิงก์รูปภาพไปใช้ซ้ำในหลายแคมเปญได้อย่างสะดวก
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct upload from local button */}
          <label className="flex items-center gap-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] px-4 py-2 text-xs font-bold text-white shadow-xs cursor-pointer transition-all">
            {isUploadingLocal ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{isUploadingLocal ? 'กำลังอัปโหลด...' : '+ อัปโหลดรูปจากเครื่อง'}</span>
            <input
              type="file"
              accept="image/*"
              disabled={isUploadingLocal}
              onChange={handleDirectLocalUpload}
              className="hidden"
            />
          </label>

          {/* Add by URL */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors"
          >
            <span>ใส่ด้วย URL</span>
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {assets.map((asset) => {
          const isCopied = copiedId === asset.id;

          return (
            <div
              key={asset.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.fileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(asset.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="ลบรูป"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-3.5 space-y-1">
                  <h4 className="font-bold text-xs text-slate-900 truncate" title={asset.fileName}>
                    {asset.fileName}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{asset.width}x{asset.height} px</span>
                    <span>{formatBytes(asset.fileSize)}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 pt-0">
                <button
                  type="button"
                  onClick={() => handleCopy(asset.id, asset.url)}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    isCopied
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>คัดลอก URL แล้ว!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>คัดลอก URL รูป</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Image by URL Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">เพิ่มรูปภาพด้วย URL</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ชื่อไฟล์ (File Name)
                </label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="เช่น banner-summer-sale.jpg"
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:border-[#06C755] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  ลิงก์รูปภาพ (HTTPS Image URL) <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 focus:border-[#06C755] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isAdding || !newImageUrl.trim()}
                  className="px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] text-white font-bold shadow-xs disabled:opacity-50"
                >
                  {isAdding ? 'กำลังบันทึก...' : 'บันทึกรูปภาพ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
