import { FlexCardContent, UtmConfig } from '@/types/message';
import { LineFlexBubble } from '@/types/line';
import { applyUtmTracking } from '@/lib/utm';
import { sanitizeLineImageUrl } from './imageUrlHelper';

export function renderFlexCard(
  card: FlexCardContent,
  utm?: UtmConfig,
  cardIndex?: number
): LineFlexBubble {
  const contentOverride = card.headline
    ? `card_${(cardIndex !== undefined ? cardIndex + 1 : 1)}_${card.headline.slice(0, 15).toLowerCase().replace(/[^a-z0-9]/g, '_')}`
    : undefined;

  const finalCtaUrl = applyUtmTracking(card.ctaUrl || 'https://example.com', utm, contentOverride);

  // 1. Hero Block (Optional)
  let hero: any = undefined;
  if (card.heroImage && card.heroImage.trim() !== '') {
    const isImageClickable = card.enableImageClick !== false;
    const heroActionUrl = card.imageClickUrl ? applyUtmTracking(card.imageClickUrl, utm, contentOverride) : finalCtaUrl;

    hero = {
      type: 'image',
      url: sanitizeLineImageUrl(card.heroImage),
      size: 'full',
      aspectRatio: card.heroAspectRatio || '20:13',
      aspectMode: 'cover',
      action: isImageClickable && (card.ctaUrl || card.imageClickUrl)
        ? {
            type: 'uri',
            uri: heroActionUrl,
            label: card.ctaLabel || 'ดูรายละเอียด',
          }
        : undefined,
    };
  }

  // 2. Body Contents
  const bodyContents: any[] = [];

  // Badge (e.g. "NEW", "HOT", "SALE 50%")
  if (card.badge && card.badge.trim() !== '') {
    bodyContents.push({
      type: 'box',
      layout: 'baseline',
      spacing: 'none',
      contents: [
        {
          type: 'text',
          text: card.badge.trim().toUpperCase(),
          size: 'xxs',
          weight: 'bold',
          color: '#06C755',
          flex: 0,
        },
      ],
      backgroundColor: '#E7F8EE',
      paddingAll: '4px',
      cornerRadius: '4px',
      margin: 'none',
    });
  }

  // Headline
  if (card.headline && card.headline.trim() !== '') {
    bodyContents.push({
      type: 'text',
      text: card.headline.trim(),
      weight: 'bold',
      size: 'md',
      wrap: true,
      color: '#111827',
      margin: card.badge ? 'sm' : 'none',
    });
  }

  // Subheadline
  if (card.subheadline && card.subheadline.trim() !== '') {
    bodyContents.push({
      type: 'text',
      text: card.subheadline.trim(),
      size: 'xs',
      color: '#6B7280',
      wrap: true,
      margin: 'xs',
    });
  }

  // Description
  if (card.description && card.description.trim() !== '') {
    bodyContents.push({
      type: 'text',
      text: card.description.trim(),
      size: 'xs',
      color: '#4B5563',
      wrap: true,
      margin: 'sm',
    });
  }

  // Price Section
  const hasOriginalPrice = card.originalPrice !== undefined && card.originalPrice !== null && card.originalPrice !== '';
  const hasSalePrice = card.salePrice !== undefined && card.salePrice !== null && card.salePrice !== '';
  const currency = card.currencySymbol || '฿';

  if (hasOriginalPrice || hasSalePrice) {
    const priceBoxContents: any[] = [];

    if (hasSalePrice) {
      priceBoxContents.push({
        type: 'text',
        text: `${currency}${Number(card.salePrice).toLocaleString()}`,
        size: 'lg',
        weight: 'bold',
        color: '#DC2626',
        flex: 0,
      });
    }

    if (hasOriginalPrice) {
      priceBoxContents.push({
        type: 'text',
        text: `${currency}${Number(card.originalPrice).toLocaleString()}`,
        size: 'xs',
        color: '#9CA3AF',
        decoration: 'line-through',
        align: 'start',
        gravity: 'bottom',
        margin: 'sm',
      });
    }

    bodyContents.push({
      type: 'box',
      layout: 'baseline',
      spacing: 'sm',
      margin: 'md',
      contents: priceBoxContents,
    });
  }

  // 3. Footer (CTA Button)
  let footer: any = undefined;
  if (card.ctaLabel && card.ctaLabel.trim() !== '') {
    footer = {
      type: 'box',
      layout: 'vertical',
      spacing: 'sm',
      contents: [
        {
          type: 'button',
          style: 'primary',
          height: 'sm',
          action: {
            type: 'uri',
            label: card.ctaLabel.trim(),
            uri: finalCtaUrl,
          },
          color: card.ctaColor || '#06C755',
        },
      ],
      paddingAll: '12px',
      paddingTop: '0px',
    };
  }

  const bubble: LineFlexBubble = {
    type: 'bubble',
    size: 'mega',
    hero,
    body: {
      type: 'box',
      layout: 'vertical',
      contents: bodyContents.length > 0 ? bodyContents : [{ type: 'text', text: ' ' }],
      paddingAll: '16px',
      paddingTop: hero ? '14px' : '16px',
    },
    footer,
  };

  return bubble;
}
