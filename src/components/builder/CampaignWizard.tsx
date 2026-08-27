'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Campaign,
  MessageType,
  ValidationError,
  Template,
} from '@/types/message';
import { FormatSelectorStep } from './FormatSelectorStep';
import { TextForm } from './forms/TextForm';
import { ImageForm } from './forms/ImageForm';
import { ImageCarouselForm } from './forms/ImageCarouselForm';
import { ImagemapForm } from './forms/ImagemapForm';
import { FlexCardForm } from './forms/FlexCardForm';
import { FlexCarouselForm } from './forms/FlexCarouselForm';
import { HeroCarouselForm } from './forms/HeroCarouselForm';
import { MixedMessageForm } from './forms/MixedMessageForm';
import { UtmBuilder } from './UtmBuilder';
import { LinePreview } from '@/components/preview/LinePreview';
import { AiAssistantModal } from '@/components/ai/AiAssistantModal';
import { SendTestModal } from '@/components/modals/SendTestModal';
import { BroadcastConfirmationModal } from '@/components/modals/BroadcastConfirmationModal';
import { SaveTemplateModal } from '@/components/modals/SaveTemplateModal';
import { validateCampaign } from '@/lib/validation';
import {
  Save,
  Send,
  Radio,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  BookmarkPlus,
  Layers,
  LayoutTemplate,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';

interface CampaignWizardProps {
  initialCampaign?: Campaign;
  initialTemplate?: Template;
}

const STEPS = [
  { id: 1, label: 'ข้อมูลแคมเปญ' },
  { id: 2, label: 'เลือกรูปแบบ' },
  { id: 3, label: 'ปรับแต่งเนื้อหา' },
  { id: 4, label: 'ตรวจสอบ & สรุป' },
];

export function CampaignWizard({ initialCampaign, initialTemplate }: CampaignWizardProps) {
  const router = useRouter();

  // Initialize campaign state
  const [campaign, setCampaign] = useState<Campaign>(() => {
    if (initialCampaign) return initialCampaign;

    if (initialTemplate) {
      return {
        id: `cmp-${nanoid(8)}`,
        name: `แคมเปญจาก ${initialTemplate.name}`,
        messageType: initialTemplate.messageType,
        content: JSON.parse(JSON.stringify(initialTemplate.defaultContent)),
        utm: {
          enabled: true,
          source: 'line',
          medium: 'broadcast',
          campaign: initialTemplate.name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 25),
          content: '',
        },
        status: 'draft',
        templateId: initialTemplate.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      id: `cmp-${nanoid(8)}`,
      name: 'แคมเปญโปรโมชั่นใหม่',
      internalNote: '',
      messageType: 'flex_carousel',
      content: {
        altText: 'รวมสินค้าไฮไลต์พิเศษประจำเดือน',
        cards: [
          {
            id: `card-${nanoid(6)}`,
            heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
            badge: 'NEW',
            headline: 'Nike Air Max Red Edition',
            subheadline: 'รองเท้าวิ่งรุ่นใหม่ล่าสุด เบาสบาย',
            description: 'นุ่มกระชับเท้า รับประกันของแท้ 100% พร้อมส่งฟรี',
            originalPrice: '4,500',
            salePrice: '3,290',
            currencySymbol: '฿',
            ctaLabel: 'ช้อปเลย',
            ctaUrl: 'https://myshop.line.me/nike-air-max',
            ctaColor: '#06C755',
          },
          {
            id: `card-${nanoid(6)}`,
            heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            badge: 'HOT',
            headline: 'Wireless Headphones Pro',
            subheadline: 'หูฟังตัดเสียงรบกวน แบตอึด 40 ชม.',
            description: 'คุณภาพเสียงระดับ Hi-Res Audio พกพาสะดวก',
            originalPrice: '2,990',
            salePrice: '1,890',
            currencySymbol: '฿',
            ctaLabel: 'ช้อปเลย',
            ctaUrl: 'https://myshop.line.me/headphones',
            ctaColor: '#06C755',
          },
        ],
      },
      utm: {
        enabled: true,
        source: 'line',
        medium: 'broadcast',
        campaign: 'promo_aug_2026',
        content: '',
      },
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  const [currentStep, setCurrentStep] = useState(initialTemplate ? 3 : 1);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessBanner, setSaveSuccessBanner] = useState(false);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSendTestOpen, setIsSendTestOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);

  // Run validation whenever campaign content changes
  useEffect(() => {
    const errors = validateCampaign(campaign);
    setValidationErrors(errors);
  }, [campaign]);

  // Handle format switch with intelligent default content fallback
  const handleSelectFormat = (type: MessageType) => {
    if (type === campaign.messageType) return;

    let newContent: any = {};
    switch (type) {
      case 'text':
        newContent = { text: 'สวัสดีค่ะ! มีโปรโมชั่นพิเศษสำหรับคุณวันนี้...' };
        break;
      case 'image':
        newContent = {
          originalContentUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1040&auto=format&fit=crop&q=80',
          previewImageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
          altText: 'โปรโมชั่นพิเศษประจำเดือน',
          destinationUrl: 'https://myshop.line.me',
        };
        break;
      case 'image_carousel':
        newContent = {
          altText: 'คอลเลกชันภาพโปรโมชั่นชุดพิเศษ',
          aspectRatio: '1:1',
          cards: [
            {
              id: `img-card-${nanoid(6)}`,
              imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
              actionType: 'uri',
              uri: 'https://myshop.line.me/shoes',
              label: 'สินค้า 1',
            },
            {
              id: `img-card-${nanoid(6)}`,
              imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
              actionType: 'uri',
              uri: 'https://myshop.line.me/headphones',
              label: 'สินค้า 2',
            },
            {
              id: `img-card-${nanoid(6)}`,
              imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
              actionType: 'uri',
              uri: 'https://myshop.line.me/smartwatch',
              label: 'สินค้า 3',
            },
          ],
        };
        break;
      case 'imagemap':
        newContent = {
          baseUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1040&auto=format&fit=crop&q=80',
          altText: 'แคมเปญ 4 สินค้าขายดี',
          baseSize: { width: 1040, height: 1040 },
          actions: [
            {
              id: 'zone-1',
              label: 'สินค้า 1',
              x: 0,
              y: 0,
              width: 520,
              height: 520,
              actionType: 'uri',
              uri: 'https://myshop.line.me',
            },
            {
              id: 'zone-2',
              label: 'สินค้า 2',
              x: 520,
              y: 0,
              width: 520,
              height: 520,
              actionType: 'uri',
              uri: 'https://myshop.line.me',
            },
          ],
        };
        break;
      case 'flex_card':
        newContent = {
          heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
          badge: 'NEW',
          headline: 'ชื่อสินค้าพิเศษ',
          subheadline: 'จุดเด่นของสินค้า',
          description: 'รายละเอียดและคุณสมบัติสินค้า',
          originalPrice: '2,500',
          salePrice: '1,790',
          currencySymbol: '฿',
          ctaLabel: 'ช้อปเลย',
          ctaUrl: 'https://myshop.line.me',
          ctaColor: '#06C755',
        };
        break;
      case 'flex_carousel':
        newContent = {
          altText: 'รายการสินค้าแนะนำ',
          cards: [
            {
              id: `card-${nanoid(6)}`,
              heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
              badge: 'NEW',
              headline: 'สินค้าที่ 1',
              subheadline: 'คำอธิบายสั้น',
              originalPrice: '1,500',
              salePrice: '990',
              ctaLabel: 'ช้อปเลย',
              ctaUrl: 'https://myshop.line.me',
            },
            {
              id: `card-${nanoid(6)}`,
              heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
              badge: 'HOT',
              headline: 'สินค้าที่ 2',
              subheadline: 'คำอธิบายสั้น',
              originalPrice: '1,990',
              salePrice: '1,290',
              ctaLabel: 'ช้อปเลย',
              ctaUrl: 'https://myshop.line.me',
            },
          ],
        };
        break;
      case 'hero_carousel':
        newContent = {
          heroArtworkUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1040&auto=format&fit=crop&q=80',
          heroDestinationUrl: 'https://myshop.line.me',
          altText: 'แคมเปญใหญ่ประจำเดือน',
          cards: [
            {
              id: `card-${nanoid(6)}`,
              badge: 'DEAL',
              headline: 'สินค้าประจำแคมเปญ',
              salePrice: '1,190',
              ctaLabel: 'ช้อปเลย',
              ctaUrl: 'https://myshop.line.me',
            },
          ],
        };
        break;
      case 'mixed':
        newContent = {
          altText: 'รวมข้อเสนอพิเศษ',
          blocks: [
            {
              id: `block-${nanoid(6)}`,
              type: 'text',
              content: { text: 'ยินดีต้อนรับสู่แคมเปญพิเศษ!' },
            },
            {
              id: `block-${nanoid(6)}`,
              type: 'image',
              content: {
                originalContentUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1040&auto=format&fit=crop&q=80',
                altText: 'Banner',
              },
            },
          ],
        };
        break;
    }

    setCampaign({
      ...campaign,
      messageType: type,
      content: newContent,
    });
  };

  // Apply AI assistant structured data directly into the campaign
  const handleApplyAiData = (data: any) => {
    const updated: Campaign = {
      ...campaign,
      name: data.campaignName || campaign.name,
      messageType: data.messageType || campaign.messageType,
      content: {
        altText: data.altText || 'ข้อความโปรโมชั่น',
        cards: data.cards || [],
        text: data.textContent || '',
      },
    };
    setCampaign(updated);
    setCurrentStep(3); // Jump directly to content step
  };

  // Save campaign draft to API
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign),
      });

      if (res.ok) {
        setSaveSuccessBanner(true);
        setTimeout(() => setSaveSuccessBanner(false), 2500);
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการบันทึก Draft');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/broadcasts')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                {campaign.name || 'สร้างแคมเปญ Broadcast ใหม่'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 uppercase">
                {campaign.messageType.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              สร้าง ตรวจสอบ และทดสอบข้อความก่อนส่งจริงสู่ผู้ติดตาม LINE OA
            </p>
          </div>
        </div>

        {/* Global Action CTAs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Assistant Button */}
          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 text-[#06C755] hover:bg-emerald-100 border border-emerald-300 text-xs font-bold transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Content Assistant</span>
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 text-xs font-bold shadow-2xs transition-colors"
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 text-slate-500" />
            )}
            <span>{saveSuccessBanner ? '✓ บันทึกแล้ว' : 'บันทึก Draft'}</span>
          </button>

          {/* Save as Template */}
          <button
            type="button"
            onClick={() => setIsSaveTemplateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 text-xs font-semibold shadow-2xs transition-colors"
            title="บันทึกโครงสร้างนี้เป็น Template"
          >
            <BookmarkPlus className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">เก็บเป็น Template</span>
          </button>

          {/* Send Test Button */}
          <button
            type="button"
            onClick={() => setIsSendTestOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send Test</span>
          </button>

          {/* Final Broadcast Button */}
          <button
            type="button"
            onClick={() => setIsBroadcastOpen(true)}
            disabled={validationErrors.length > 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-md hover:shadow-red-100 disabled:opacity-40 transition-all"
          >
            <Radio className="h-4 w-4" />
            <span>Broadcast</span>
          </button>
        </div>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-4 gap-2">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={cn(
                  'flex items-center gap-2 p-2.5 rounded-xl text-left transition-all',
                  isActive
                    ? 'bg-slate-900 text-white font-bold shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                )}
              >
                <div
                  className={cn(
                    'h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    isActive
                      ? 'bg-[#06C755] text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  )}
                >
                  {isCompleted ? '✓' : step.id}
                </div>
                <span className="text-xs truncate hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Desktop Grid Layout (Left: Form Builder, Right: Live Mobile Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Step Builder (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Campaign Information & UTM */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
                <h3 className="font-bold text-slate-900 text-base">
                  ข้อมูลพื้นฐานของแคมเปญ (Campaign Information)
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ชื่อแคมเปญ (Campaign Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={campaign.name || ''}
                    onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                    placeholder="เช่น KMA Payday August 2026"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    บันทึกภายในทีม (Internal Note) <span className="text-[11px] font-normal text-slate-400">(ไม่ส่งให้ลูกค้า)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={campaign.internalNote || ''}
                    onChange={(e) => setCampaign({ ...campaign, internalNote: e.target.value })}
                    placeholder="ระบุหมายเหตุ เช่น ยิงเฉพาะวันเสาร์ 20:00 น. หรือกลุ่มลูกค้า VIP..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-xs focus:border-[#06C755] focus:ring-1 focus:ring-[#06C755] outline-none"
                  />
                </div>
              </div>

              {/* UTM Builder */}
              <UtmBuilder
                utm={campaign.utm}
                onChange={(utm) => setCampaign({ ...campaign, utm })}
                campaignName={campaign.name}
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>ถัดไป: เลือกรูปแบบข้อความ</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Choose Message Format */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <FormatSelectorStep
                selectedType={campaign.messageType}
                onSelect={(type) => {
                  handleSelectFormat(type);
                  setCurrentStep(3);
                }}
                onOpenAiHelper={() => setIsAiModalOpen(true)}
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>ย้อนกลับ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>ถัดไป: กรอกเนื้อหา</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Structured Content Builder */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              {campaign.messageType === 'text' && (
                <TextForm
                  content={campaign.content as any}
                  onChange={(c) => setCampaign({ ...campaign, content: c })}
                />
              )}

              {campaign.messageType === 'image' && (
                <ImageForm
                  content={campaign.content as any}
                  onChange={(c) => setCampaign({ ...campaign, content: c })}
                />
              )}

              {campaign.messageType === 'image_carousel' && (
                <ImageCarouselForm
                  content={campaign.content as any}
                  onChange={(c) => setCampaign({ ...campaign, content: c })}
                />
              )}

              {campaign.messageType === 'imagemap' && (
                <ImagemapForm
                  content={campaign.content as any}
                  onChange={(c) => setCampaign({ ...campaign, content: c })}
                />
              )}

              {campaign.messageType === 'flex_card' && (
                <FlexCardForm
                  card={campaign.content as any}
                  onChange={(card) => setCampaign({ ...campaign, content: card })}
                />
              )}

              {campaign.messageType === 'flex_carousel' && (
                <FlexCarouselForm
                  content={campaign.content as any}
                  onChange={(c) => setCampaign({ ...campaign, content: c })}
                />
              )}

              {campaign.messageType === 'hero_carousel' && (
                <HeroCarouselForm
                  content={campaign.content as any}
                  onChange={(c) => setCampaign({ ...campaign, content: c })}
                />
              )}

              {campaign.messageType === 'mixed' && (
                <MixedMessageForm
                  content={campaign.content as any}
                  onChange={(c) => setCampaign({ ...campaign, content: c })}
                />
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>เปลี่ยนรูปแบบ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <span>ถัดไป: ตรวจสอบและทดสอบส่ง</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review, Validation Check & Send Test */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              {/* Validation Status Card */}
              <div
                className={`rounded-2xl border p-5 shadow-2xs space-y-3 ${
                  validationErrors.length === 0
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-red-50/70 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {validationErrors.length === 0 ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <h3 className="font-bold text-emerald-950 text-sm">
                        ✓ ข้อมูลแคมเปญถูกต้องสมบูรณ์ พร้อมส่งทดสอบและ Broadcast
                      </h3>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <h3 className="font-bold text-red-950 text-sm">
                        พบข้อผิดพลาดที่ต้องแก้ไข ({validationErrors.length} รายการ):
                      </h3>
                    </>
                  )}
                </div>

                {validationErrors.length > 0 && (
                  <ul className="list-disc pl-5 text-xs text-red-800 space-y-1">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err.message}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Ready to Send Action Box */}
              <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs space-y-4">
                <h4 className="font-bold text-slate-900 text-sm">ขั้นตอนการส่งข้อความ:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSendTestOpen(true)}
                    className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-left space-y-1 group transition-colors"
                  >
                    <div className="flex items-center justify-between text-blue-700 font-bold text-xs">
                      <span>1. ส่งทดสอบ (Send Test)</span>
                      <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-600">
                      ยิงเข้า User ID บัญชีของทีมงานเพื่อตรวจการแสดงผลบน LINE จริง
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsBroadcastOpen(true)}
                    disabled={validationErrors.length > 0}
                    className="p-4 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-left space-y-1 group transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between text-red-700 font-bold text-xs">
                      <span>2. ส่ง Broadcast จริง</span>
                      <Radio className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </div>
                    <p className="text-[11px] text-slate-600">
                      ส่งหาผู้ติดตามทั้งหมด (ระบบจะเปิด Modal ยืนยันก่อนยิงเสมอ)
                    </p>
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>กลับไปแก้ไขเนื้อหา</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Live Mobile Preview (5 Cols Sticky) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <LinePreview campaign={campaign} />
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApply={handleApplyAiData}
      />

      {/* Send Test Modal */}
      <SendTestModal
        isOpen={isSendTestOpen}
        onClose={() => setIsSendTestOpen(false)}
        campaign={campaign}
        onSuccess={() => {
          setCampaign({ ...campaign, status: 'test_sent' });
        }}
      />

      {/* Broadcast Confirmation Modal */}
      <BroadcastConfirmationModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        campaign={campaign}
        onSuccess={() => {
          setCampaign({ ...campaign, status: 'sent' });
        }}
      />

      {/* Save Template Modal */}
      <SaveTemplateModal
        isOpen={isSaveTemplateOpen}
        onClose={() => setIsSaveTemplateOpen(false)}
        campaign={campaign}
      />
    </div>
  );
}
