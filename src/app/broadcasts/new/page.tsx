'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CampaignWizard } from '@/components/builder/CampaignWizard';
import { Template } from '@/types/message';
import { Loader2 } from 'lucide-react';

function NewCampaignContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(Boolean(templateId));

  useEffect(() => {
    if (templateId) {
      fetch('/api/templates')
        .then((res) => res.json())
        .then((templates: Template[]) => {
          const found = templates.find((t) => t.id === templateId);
          if (found) setTemplate(found);
        })
        .finally(() => setIsLoading(false));
    }
  }, [templateId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
        <Loader2 className="h-6 w-6 animate-spin text-[#06C755]" />
        <span>กำลังโหลดข้อมูล Template...</span>
      </div>
    );
  }

  return <CampaignWizard initialTemplate={template} />;
}

export default function NewCampaignPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-[#06C755]" />
          <span>กำลังเตรียมระบบ Builder...</span>
        </div>
      }
    >
      <NewCampaignContent />
    </Suspense>
  );
}
