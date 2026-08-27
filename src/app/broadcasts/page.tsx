'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  PlusCircle,
  Search,
  Filter,
  Copy,
  Trash2,
  FileEdit,
  Send,
  Radio,
  Clock,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { Campaign, CampaignStatus, MessageType } from '@/types/message';
import { cn } from '@/lib/utils';

export default function BroadcastsListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCampaigns = () => {
    setIsLoading(true);
    fetch('/api/campaigns')
      .then((res) => res.json())
      .then((data) => setCampaigns(Array.isArray(data) ? data : []))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        fetchCampaigns();
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการคัดลอก');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`คุณต้องการลบแคมเปญ "${name}" ใช่หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCampaigns();
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการลบแคมเปญ');
    }
  };

  // Filtered campaigns
  const filtered = campaigns.filter((cmp) => {
    const matchesSearch = (cmp.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cmp.status === statusFilter;
    const matchesType = typeFilter === 'all' || cmp.messageType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">รายการแคมเปญ Broadcast ทั้งหมด</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {filtered.length} แคมเปญ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการ แก้ไข ทำสำเนา และตรวจสอบประวัติการส่งข้อความ
          </p>
        </div>

        <Link
          href="/broadcasts/new"
          className="flex items-center gap-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ สร้าง Broadcast ใหม่</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อแคมเปญ..."
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3.5 py-2 text-xs focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-[#06C755] outline-none bg-white text-slate-700 font-medium"
            >
              <option value="all">ทุกสถานะ (All Status)</option>
              <option value="draft">Draft (แบบร่าง)</option>
              <option value="ready">Ready (พร้อมส่ง)</option>
              <option value="test_sent">Test Sent (ทดสอบแล้ว)</option>
              <option value="sent">Sent (Broadcast แล้ว)</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="sm:col-span-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-[#06C755] outline-none bg-white text-slate-700 font-medium"
            >
              <option value="all">ทุกรูปแบบข้อความ (All Types)</option>
              <option value="flex_carousel">Flex Carousel</option>
              <option value="flex_card">Flex Card</option>
              <option value="imagemap">Imagemap</option>
              <option value="hero_carousel">Hero + Carousel</option>
              <option value="image">Single Image</option>
              <option value="text">Text Message</option>
              <option value="mixed">Mixed Message</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table List */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Layers className="h-8 w-8 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">ไม่พบแคมเปญตามเงื่อนไขที่ค้นหา</p>
            <p>ลองปรับคำค้นหา หรือสร้างแคมเปญใหม่</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4">ชื่อแคมเปญ</th>
                  <th className="py-3.5 px-4">รูปแบบ</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4">UTM Tracking</th>
                  <th className="py-3.5 px-4">แก้ไขล่าสุด</th>
                  <th className="py-3.5 px-4 text-right">การกระทำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((cmp) => (
                  <tr key={cmp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <Link href={`/broadcasts/${cmp.id}/edit`} className="hover:text-[#06C755] block">
                        {cmp.name}
                      </Link>
                      {cmp.internalNote && (
                        <span className="text-[11px] text-slate-400 font-normal truncate block max-w-xs">
                          {cmp.internalNote}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                        {cmp.messageType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5',
                          cmp.status === 'sent'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cmp.status === 'scheduled'
                            ? 'bg-indigo-100 text-indigo-800'
                            : cmp.status === 'test_sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        )}
                      >
                        <span
                          className={cn(
                            'h-1.5 w-1.5 rounded-full',
                            cmp.status === 'sent'
                              ? 'bg-emerald-600'
                              : cmp.status === 'scheduled'
                              ? 'bg-indigo-600 animate-pulse'
                              : cmp.status === 'test_sent'
                              ? 'bg-blue-600'
                              : 'bg-amber-600'
                          )}
                        />
                        <span>
                          {cmp.status === 'scheduled' && cmp.scheduledAt
                            ? `⏰ ${new Date(cmp.scheduledAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`
                            : cmp.status}
                        </span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {cmp.utm?.enabled ? (
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                          ✓ {cmp.utm.campaign || 'enabled'}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">ปิด</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-500 font-normal">
                      {new Date(cmp.updatedAt).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-4 px-4 text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(cmp.id)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                        title="ทำสำเนาแคมเปญ (Duplicate)"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <Link
                        href={`/broadcasts/${cmp.id}/edit`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold transition-colors"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                        <span>แก้ไข</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(cmp.id, cmp.name)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded hover:bg-red-50 transition-colors"
                        title="ลบแคมเปญ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
