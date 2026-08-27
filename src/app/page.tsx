'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Send,
  Radio,
  FileEdit,
  LayoutTemplate,
  PlusCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Copy,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { Campaign, Template } from '@/types/message';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/campaigns').then((r) => r.json()),
      fetch('/api/templates').then((r) => r.json()),
    ])
      .then(([cmpData, tplData]) => {
        setCampaigns(Array.isArray(cmpData) ? cmpData : []);
        setTemplates(Array.isArray(tplData) ? tplData : []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const sentCampaigns = campaigns.filter((c) => c.status === 'sent');
  const draftCampaigns = campaigns.filter((c) => c.status === 'draft' || c.status === 'ready' || c.status === 'test_sent');

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        const duplicated = await res.json();
        setCampaigns([duplicated, ...campaigns]);
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการคัดลอกแคมเปญ');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Hero Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#06C755]/10 blur-3xl" />
        <div className="absolute left-1/2 bottom-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Structured Message Builder + Template Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            LINE OA Flex Broadcast Manager
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            สร้างและส่งข้อความโปรโมชั่น LINE Flex Messages, Carousels, Imagemaps ได้อย่างรวดเร็ว โดยไม่ต้องเขียน LINE JSON ด้วยตนเอง และปรับแต่งได้ผ่าน Template สำเร็จรูป
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/broadcasts/new"
              className="flex items-center gap-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-green-900/30 transition-all hover:scale-102 active:scale-98"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ สร้าง Broadcast ใหม่</span>
            </Link>

            <Link
              href="/templates"
              className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-semibold text-white border border-white/20 backdrop-blur-xs transition-colors"
            >
              <LayoutTemplate className="h-4 w-4 text-emerald-400" />
              <span>เลือกจาก Templates ({templates.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">แคมเปญทั้งหมด</span>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{campaigns.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Total Campaigns Created</div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Broadcast สำเร็จ</span>
            <Radio className="h-4 w-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{sentCampaigns.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">✓ Sent to Followers</div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">แคมเปญแบบร่าง</span>
            <FileEdit className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{draftCampaigns.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Draft & Ready to send</div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Templates สำเร็จรูป</span>
            <LayoutTemplate className="h-4 w-4 text-[#06C755]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{templates.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Built-in & Custom</div>
        </div>
      </div>

      {/* Featured Templates Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Templates ยอดนิยม (Quick Start)</h2>
            <p className="text-xs text-slate-500">เลือก Template สำเร็จรูปเพื่อเริ่มต้นสร้างแคมเปญได้ทันที</p>
          </div>
          <Link
            href="/templates"
            className="flex items-center gap-1 text-xs font-bold text-[#06C755] hover:text-[#05B04B]"
          >
            <span>ดูทั้งหมด</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.slice(0, 3).map((tpl) => (
            <div
              key={tpl.id}
              className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {tpl.thumbnailUrl && (
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tpl.thumbnailUrl}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {tpl.messageType.replace('_', ' ')}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#06C755] transition-colors">
                    {tpl.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {tpl.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{tpl.category}</span>
                <Link
                  href={`/broadcasts/new?templateId=${tpl.id}`}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
                >
                  <span>ใช้ Template นี้</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">แคมเปญล่าสุด (Recent Broadcasts)</h2>
            <p className="text-xs text-slate-500">จัดการ แคมเปญ แก้ไข หรือทำสำเนาเพื่อใช้งานซ้ำ</p>
          </div>
          <Link
            href="/broadcasts"
            className="text-xs font-bold text-[#06C755] hover:text-[#05B04B]"
          >
            ดูแคมเปญทั้งหมด →
          </Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            ยังไม่มีแคมเปญ กดปุ่ม "+ สร้าง Broadcast ใหม่" เพื่อเริ่มต้น
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="pb-3">ชื่อแคมเปญ</th>
                  <th className="pb-3">รูปแบบ</th>
                  <th className="pb-3">สถานะ</th>
                  <th className="pb-3">วันที่แก้ไข</th>
                  <th className="pb-3 text-right">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.slice(0, 5).map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-slate-900">
                      <Link href={`/broadcasts/${cmp.id}/edit`} className="hover:text-[#06C755]">
                        {cmp.name}
                      </Link>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {cmp.messageType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[10px] font-bold uppercase',
                          cmp.status === 'sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cmp.status === 'test_sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        {cmp.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(cmp.updatedAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="py-3 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(cmp.id)}
                        className="px-2 py-1 text-slate-600 hover:text-slate-900 rounded bg-slate-100 hover:bg-slate-200"
                        title="คัดลอกแคมเปญ"
                      >
                        คัดลอก
                      </button>
                      <Link
                        href={`/broadcasts/${cmp.id}/edit`}
                        className="px-2 py-1 text-emerald-700 hover:text-emerald-800 rounded bg-emerald-50 hover:bg-emerald-100 font-bold"
                      >
                        แก้ไข
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
