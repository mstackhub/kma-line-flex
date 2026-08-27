'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CampaignWizard } from '@/components/builder/CampaignWizard';
import { Campaign } from '@/types/message';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/campaigns/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('ไม่พบข้อมูลแคมเปญ');
          return res.json();
        })
        .then((data) => setCampaign(data))
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#06C755]" />
        <span>กำลังโหลดแคมเปญ...</span>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="rounded-2xl bg-white p-8 border border-slate-200 text-center space-y-4 max-w-md mx-auto my-12">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">เกิดข้อผิดพลาด</h2>
        <p className="text-xs text-slate-600">{error || 'ไม่พบข้อมูลแคมเปญนี้ในระบบ'}</p>
        <Link
          href="/broadcasts"
          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>กลับไปยังรายการแคมเปญ</span>
        </Link>
      </div>
    );
  }

  return <CampaignWizard initialCampaign={campaign} />;
}
