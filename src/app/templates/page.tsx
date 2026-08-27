'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutTemplate,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Copy,
  Layers,
  CreditCard,
  Image as ImageIcon,
  MessageSquare,
  Search,
} from 'lucide-react';
import { Template } from '@/types/message';
import { cn } from '@/lib/utils';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/templates')
      .then((res) => res.json())
      .then((data) => setTemplates(Array.isArray(data) ? data : []))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'ทั้งหมด (All)' },
    { id: 'promotion', label: 'โปรโมชั่น & ลดราคา' },
    { id: 'product', label: 'สินค้าเดี่ยว' },
    { id: 'ecommerce', label: 'E-Commerce Carousel' },
    { id: 'announcement', label: 'ประกาศข่าวสาร' },
  ];

  const filtered = templates.filter((t) => {
    const matchesCat = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch =
      (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">คลังเทมเพลต (Templates Catalog)</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {templates.length} รูปแบบ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            เลือกเทมเพลตสำเร็จรูปที่ออกแบบตามมาตรฐาน LINE Flex มาเริ่มสร้างแคมเปญใหม่ได้ทันที
          </p>
        </div>

        <Link
          href="/broadcasts/new"
          className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          <span>สร้างแคมเปญเปล่า</span>
        </Link>
      </div>

      {/* Category Pills & Search */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 line-chat-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0',
                  activeCategory === cat.id
                    ? 'bg-[#06C755] text-white border-[#06C755] shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาเทมเพลต..."
              className="w-full rounded-xl border border-slate-300 pl-8 pr-3 py-1.5 text-xs focus:border-[#06C755] outline-none"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    tpl.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80'
                  }
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {tpl.messageType.replace('_', ' ')}
                  </span>
                  {tpl.isBuiltIn && (
                    <span className="bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Official
                    </span>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#06C755] transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {tpl.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400 capitalize font-medium">
                {tpl.category}
              </span>
              <Link
                href={`/broadcasts/new?templateId=${tpl.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] text-white text-xs font-bold shadow-xs hover:shadow-green-100 transition-all active:scale-98"
              >
                <span>ใช้ Template นี้</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
