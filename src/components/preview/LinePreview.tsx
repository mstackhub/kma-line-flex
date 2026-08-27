'use client';

import React, { useState } from 'react';
import {
  Smartphone,
  Code2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Bell,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Campaign, FlexCardContent, ImagemapArea } from '@/types/message';
import { renderLineMessages } from '@/lib/line';
import { DraggableScrollContainer } from './DraggableScrollContainer';
import { cn } from '@/lib/utils';

interface LinePreviewProps {
  campaign: Campaign;
  className?: string;
}

export function LinePreview({ campaign, className }: LinePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'json'>('preview');
  const [copied, setCopied] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeZoneTooltip, setActiveZoneTooltip] = useState<string | null>(null);

  // Generate LINE messages JSON
  let renderedMessages: any[] = [];
  let jsonString = '';
  try {
    renderedMessages = renderLineMessages(campaign);
    jsonString = JSON.stringify(renderedMessages, null, 2);
  } catch (err: any) {
    jsonString = `Error generating JSON: ${err.message}`;
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { messageType, content } = campaign;

  return (
    <div className={cn('flex flex-col bg-slate-900/5 rounded-2xl border border-slate-200 p-4', className)}>
      {/* Header bar with tabs and actions */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
        <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.2 rounded-lg text-xs font-semibold transition-all',
              viewMode === 'preview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>LINE Mobile Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('json')}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.2 rounded-lg text-xs font-semibold transition-all',
              viewMode === 'json'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            )}
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>LINE JSON Payload</span>
          </button>
        </div>

        {viewMode === 'json' && (
          <button
            type="button"
            onClick={handleCopyJson}
            className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy JSON</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* JSON Viewer Mode */}
      {viewMode === 'json' ? (
        <div className="relative flex-1 min-h-[520px] rounded-xl bg-slate-950 p-4 text-xs font-mono text-emerald-400 overflow-auto max-h-[680px]">
          <pre>{jsonString}</pre>
        </div>
      ) : (
        /* Mobile Simulator Phone Container */
        <div className="flex flex-col items-center justify-center py-2">
          {/* Notification Banner Simulator */}
          <div className="w-[340px] mb-2 px-3 py-2 bg-white/95 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2.5 text-xs text-slate-700">
            <div className="h-6 w-6 rounded-lg bg-[#06C755] flex items-center justify-center text-white shrink-0">
              <Bell className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-slate-900 truncate">LINE OA Notification</div>
              <div className="text-[11px] text-slate-500 truncate">
                {(content as any)?.altText || (content as any)?.headline || (content as any)?.text || 'มีข้อความใหม่จาก Official Account'}
              </div>
            </div>
          </div>

          {/* Smartphone Frame */}
          <div className="relative w-[340px] h-[640px] rounded-[40px] bg-slate-900 p-3 shadow-2xl ring-1 ring-slate-800/80">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30" />

            {/* Inner Screen */}
            <div className="w-full h-full rounded-[30px] overflow-hidden bg-[#8cabd9] flex flex-col relative font-sans">
              {/* LINE Chat Room Header */}
              <div className="bg-[#24354c] text-white px-3 pt-6 pb-2.5 flex items-center justify-between shrink-0 shadow-xs">
                <div className="flex items-center gap-2">
                  <ChevronLeft className="h-5 w-5 text-white/80" />
                  <div className="h-8 w-8 rounded-full bg-[#06C755] flex items-center justify-center text-white font-bold text-xs">
                    OA
                  </div>
                  <div className="leading-tight">
                    <div className="font-bold text-xs flex items-center gap-1">
                      <span>Brand Official</span>
                      <span className="bg-emerald-500 text-[9px] px-1 rounded-xs text-white">✓</span>
                    </div>
                    <div className="text-[10px] text-slate-300">Official Account</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <span className="text-[10px]">12:45</span>
                </div>
              </div>

              {/* Chat Message Scrollable Container */}
              <div className="flex-1 overflow-y-auto p-3 line-chat-scroll flex flex-col gap-3">
                {/* Simulated Timestamp */}
                <div className="text-center my-1">
                  <span className="bg-black/20 text-white text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                    Today 12:45 PM
                  </span>
                </div>

                {/* Render Based on Message Type */}
                {messageType === 'text' && (
                  <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {(content as any)?.text || 'ตัวอย่างข้อความ Broadcast...'}
                  </div>
                )}

                {messageType === 'image' && (
                  <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-xs overflow-hidden shadow-xs">
                    {(content as any)?.originalContentUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={(content as any).originalContentUrl}
                        alt={(content as any).altText || 'Artwork'}
                        className="w-full h-auto object-cover max-h-[360px]"
                      />
                    ) : (
                      <div className="h-44 bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <Info className="h-6 w-6 mb-1" />
                        <span className="text-xs">ยังไม่ได้ใส่รูปภาพ Artwork</span>
                      </div>
                    )}
                  </div>
                )}

                {messageType === 'imagemap' && (
                  <div className="w-full bg-white rounded-2xl rounded-tl-xs overflow-hidden shadow-xs relative group">
                    {(content as any)?.baseUrl ? (
                      <div className="relative w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={(content as any).baseUrl}
                          alt={(content as any).altText || 'Imagemap'}
                          className="w-full h-auto block"
                        />
                        {/* Interactive Clickable Area Overlays */}
                        {((content as any).actions || []).map((action: ImagemapArea, idx: number) => {
                          const baseW = (content as any).baseSize?.width || 1040;
                          const baseH = (content as any).baseSize?.height || 1040;
                          const leftPct = `${(action.x / baseW) * 100}%`;
                          const topPct = `${(action.y / baseH) * 100}%`;
                          const widthPct = `${(action.width / baseW) * 100}%`;
                          const heightPct = `${(action.height / baseH) * 100}%`;

                          return (
                            <div
                              key={action.id || idx}
                              onMouseEnter={() => setActiveZoneTooltip(action.label || `Zone ${idx + 1}: ${action.uri || action.text}`)}
                              onMouseLeave={() => setActiveZoneTooltip(null)}
                              onClick={() => {
                                if (action.uri) window.open(action.uri, '_blank');
                              }}
                              style={{
                                left: leftPct,
                                top: topPct,
                                width: widthPct,
                                height: heightPct,
                              }}
                              className="absolute border border-dashed border-emerald-400/80 bg-emerald-500/15 hover:bg-emerald-500/35 cursor-pointer transition-all flex items-center justify-center"
                              title={action.label || action.uri}
                            >
                              <span className="bg-slate-900/80 text-white text-[9px] px-1 rounded font-medium shadow-xs">
                                {idx + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="h-44 bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                        <Info className="h-6 w-6 mb-1" />
                        <span className="text-xs">กรุณาระบุ Artwork สำหรับ Imagemap</span>
                      </div>
                    )}
                    {activeZoneTooltip && (
                      <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 text-white text-[10px] p-1.5 rounded-lg text-center truncate">
                        🔗 {activeZoneTooltip}
                      </div>
                    )}
                  </div>
                )}

                {messageType === 'flex_card' && (
                  <div className="w-[270px]">
                    <SingleFlexCardPreview card={content as FlexCardContent} />
                  </div>
                )}

                {messageType === 'image_carousel' && (
                  <div className="w-full">
                    {/* Image Carousel Horizontal Swipe with Mouse Drag + Touchpad */}
                    {((content as any)?.cards || []).length > 0 ? (
                      <DraggableScrollContainer className="pb-1">
                        {((content as any).cards as any[]).map((card, idx) => (
                          <div
                            key={card.id || idx}
                            onClick={() => {
                              if (card.actionType === 'uri' && card.uri) {
                                window.open(card.uri, '_blank');
                              }
                            }}
                            className={cn(
                              'shrink-0 snap-start bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 cursor-pointer group relative transition-transform duration-150',
                              (content as any)?.aspectRatio === '1:1'
                                ? 'w-[220px] aspect-square'
                                : (content as any)?.aspectRatio === '16:9'
                                ? 'w-[245px] aspect-[16/9]'
                                : (content as any)?.aspectRatio === '9:16'
                                ? 'w-[170px] aspect-[9/16]'
                                : 'w-[220px] aspect-[20/13]'
                            )}
                          >
                            {card.imageUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={card.imageUrl}
                                alt={card.label || 'Image'}
                                draggable={false}
                                className="w-full h-full object-cover pointer-events-none group-hover:scale-102 transition-transform duration-200"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-2 text-center text-xs">
                                <Info className="h-5 w-5 mb-1" />
                                <span>ยังไม่ได้เลือกรูป</span>
                              </div>
                            )}

                            {/* Hover info badge */}
                            <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity truncate flex items-center justify-between pointer-events-none">
                              <span className="truncate">{card.label || `Image ${idx + 1}`}</span>
                              {card.actionType === 'uri' && <ExternalLink className="h-3 w-3 shrink-0 ml-1" />}
                            </div>
                          </div>
                        ))}
                      </DraggableScrollContainer>
                    ) : (
                      <div className="bg-white rounded-2xl p-4 text-center text-xs text-slate-500">
                        ยังไม่มีรูปภาพใน Carousel กรุณาเพิ่มรูปภาพ
                      </div>
                    )}
                  </div>
                )}

                {messageType === 'flex_carousel' && (
                  <div className="w-full">
                    {/* Carousel Horizontal Scroll View with Mouse Drag + Touchpad */}
                    <div className="relative">
                      {((content as any)?.cards || []).length > 0 ? (
                        <DraggableScrollContainer className="pb-1">
                          {((content as any).cards as FlexCardContent[]).map((card, idx) => (
                            <div key={card.id || idx} className="w-[205px] shrink-0 snap-start">
                              <SingleFlexCardPreview card={card} isCarousel />
                            </div>
                          ))}
                        </DraggableScrollContainer>
                      ) : (
                        <div className="bg-white rounded-2xl p-4 text-center text-xs text-slate-500">
                          ไม่มีการ์ดใน Carousel กรุณาเพิ่มการ์ดสินค้า
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {messageType === 'hero_carousel' && (
                  <div className="flex flex-col gap-2 w-full">
                    {/* Hero Artwork Banner */}
                    {(content as any)?.heroArtworkUrl && (
                      <div className="w-full bg-white rounded-2xl rounded-tl-xs overflow-hidden shadow-xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={(content as any).heroArtworkUrl}
                          alt="Hero Banner"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    {/* Followed by Product Carousel */}
                    <DraggableScrollContainer className="pb-1">
                      {((content as any)?.cards || []).map((card: FlexCardContent, idx: number) => (
                        <div key={card.id || idx} className="w-[200px] shrink-0 snap-start">
                          <SingleFlexCardPreview card={card} isCarousel />
                        </div>
                      ))}
                    </DraggableScrollContainer>
                  </div>
                )}

                {messageType === 'mixed' && (
                  <div className="flex flex-col gap-2.5 w-full">
                    {((content as any)?.blocks || []).map((block: any, idx: number) => (
                      <div key={block.id || idx} className="w-full">
                        {block.type === 'text' && (
                          <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs text-xs text-slate-800 whitespace-pre-wrap">
                            {block.content?.text}
                          </div>
                        )}
                        {block.type === 'image' && (
                          <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-xs overflow-hidden shadow-xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={block.content?.originalContentUrl}
                              alt="Block image"
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                        {block.type === 'flex_card' && (
                          <div className="w-[260px]">
                            <SingleFlexCardPreview card={block.content} />
                          </div>
                        )}
                        {block.type === 'flex_carousel' && (
                          <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory line-chat-scroll">
                            {(block.content?.cards || []).map((card: FlexCardContent, cIdx: number) => (
                              <div key={card.id || cIdx} className="w-[220px] shrink-0 snap-start">
                                <SingleFlexCardPreview card={card} isCarousel />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Room Footer Simulator */}
              <div className="bg-[#f7f7f8] border-t border-slate-200 p-2 flex items-center gap-2 shrink-0">
                <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs">
                  +
                </div>
                <div className="flex-1 bg-white border border-slate-300 rounded-full px-3 py-1 text-[11px] text-slate-400">
                  พิมพ์ข้อความ...
                </div>
                <div className="h-7 w-7 rounded-full bg-[#06C755] flex items-center justify-center text-white text-xs">
                  ➤
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Single Flex Card Simulator inside LINE Preview
function SingleFlexCardPreview({
  card,
  isCarousel = false,
}: {
  card: FlexCardContent;
  isCarousel?: boolean;
}) {
  const hasPrice =
    (card.salePrice !== undefined && card.salePrice !== '') ||
    (card.originalPrice !== undefined && card.originalPrice !== '');

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-100 flex flex-col font-sans">
      {/* Hero Image */}
      {card.heroImage && card.heroImage.trim() !== '' ? (
        <div
          onClick={() => {
            const url = card.imageClickUrl || card.ctaUrl;
            if (card.enableImageClick !== false && url) {
              window.open(url, '_blank');
            }
          }}
          className={cn(
            'relative w-full bg-slate-100 overflow-hidden aspect-[20/13] group/hero',
            card.enableImageClick !== false && (card.ctaUrl || card.imageClickUrl)
              ? 'cursor-pointer'
              : ''
          )}
          title={
            card.enableImageClick !== false && (card.ctaUrl || card.imageClickUrl)
              ? 'แตะที่ภาพเพื่อเปิดลิงก์'
              : undefined
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={card.heroImage}
            alt={card.headline || 'Product'}
            className="w-full h-full object-cover group-hover/hero:scale-102 transition-transform duration-200"
          />
          {card.enableImageClick !== false && (card.ctaUrl || card.imageClickUrl) && (
            <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white opacity-0 group-hover/hero:opacity-100 transition-opacity">
              <ExternalLink className="h-3 w-3" />
            </div>
          )}
        </div>
      ) : null}

      {/* Body Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Badge */}
        {card.badge && card.badge.trim() !== '' && (
          <div className="inline-flex self-start px-2 py-0.5 rounded bg-emerald-50 text-[#06C755] text-[10px] font-bold tracking-wide uppercase mb-1.5">
            {card.badge}
          </div>
        )}

        {/* Headline */}
        <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
          {card.headline || 'หัวข้อสินค้า/โปรโมชั่น'}
        </h4>

        {/* Subheadline */}
        {card.subheadline && card.subheadline.trim() !== '' && (
          <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
            {card.subheadline}
          </p>
        )}

        {/* Description */}
        {card.description && card.description.trim() !== '' && (
          <p className="text-[10px] text-slate-600 leading-relaxed mt-1 line-clamp-2">
            {card.description}
          </p>
        )}

        {/* Price Section */}
        {hasPrice && (
          <div className="mt-2.5 flex items-baseline gap-1.5">
            {card.salePrice && (
              <span className="text-red-600 font-extrabold text-sm">
                {card.currencySymbol || '฿'}{Number(card.salePrice).toLocaleString()}
              </span>
            )}
            {card.originalPrice && (
              <span className="text-slate-400 text-[10px] line-through">
                {card.currencySymbol || '฿'}{Number(card.originalPrice).toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* CTA Footer Button */}
      {card.ctaLabel && card.ctaLabel.trim() !== '' && (
        <div className="px-3 pb-3 pt-0">
          <button
            type="button"
            style={{ backgroundColor: card.ctaColor || '#06C755' }}
            className="w-full py-1.5 rounded-lg text-white font-semibold text-xs shadow-xs hover:opacity-95 transition-opacity truncate"
          >
            {card.ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}
