'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagemapVisualEditor } from '@/components/imagemap/ImagemapVisualEditor';
import { ImagemapMessageContent } from '@/types/message';
import { LinePreview } from '@/components/preview/LinePreview';
import { PlusCircle, Sparkles, Send, ArrowRight, Code2 } from 'lucide-react';
import { nanoid } from 'nanoid';

export default function ImagemapStudioPage() {
  const router = useRouter();

  const [content, setContent] = useState<ImagemapMessageContent>({
    baseUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1040&auto=format&fit=crop&q=80',
    altText: 'แคมเปญ 4 สินค้าขายดีประจำสัปดาห์',
    baseSize: {
      width: 1040,
      height: 1040,
    },
    actions: [
      {
        id: 'zone-1',
        label: 'สินค้า A (บนซ้าย)',
        x: 0,
        y: 0,
        width: 520,
        height: 520,
        actionType: 'uri',
        uri: 'https://myshop.line.me/product-a',
      },
      {
        id: 'zone-2',
        label: 'สินค้า B (บนขวา)',
        x: 520,
        y: 0,
        width: 520,
        height: 520,
        actionType: 'uri',
        uri: 'https://myshop.line.me/product-b',
      },
    ],
  });

  const handleCreateCampaign = () => {
    // Save as campaign directly
    const campaignData = {
      id: `cmp-${nanoid(8)}`,
      name: 'แคมเปญ Imagemap Artwork',
      messageType: 'imagemap',
      content,
      utm: {
        enabled: true,
        source: 'line',
        medium: 'broadcast',
        campaign: 'imagemap_promo',
        content: '',
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData),
    })
      .then((res) => res.json())
      .then((saved) => {
        router.push(`/broadcasts/${saved.id}/edit`);
      });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">Imagemap Studio</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Visual Canvas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            วาดและกำหนดพื้นที่คลิกบนภาพ Artwork ความละเอียดสูงเพื่อส่งไปยังหลายลิงก์สินค้า
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateCampaign}
          className="flex items-center gap-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
        >
          <span>สร้างแคมเปญจาก Imagemap นี้</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <ImagemapVisualEditor content={content} onChange={setContent} />
        </div>

        <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
          <LinePreview
            campaign={{
              id: 'preview-imagemap',
              name: 'Imagemap Preview',
              messageType: 'imagemap',
              content,
              utm: { enabled: false, source: '', medium: '', campaign: '', content: '' },
              status: 'draft',
              createdAt: '',
              updatedAt: '',
            }}
          />
        </div>
      </div>
    </div>
  );
}
