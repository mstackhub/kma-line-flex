import { FlexCarouselContent, UtmConfig } from '@/types/message';
import { LineFlexMessage } from '@/types/line';
import { renderFlexCard } from './renderFlexCard';

export function renderFlexCarousel(
  content: FlexCarouselContent,
  utm?: UtmConfig
): LineFlexMessage {
  const cards = content.cards && content.cards.length > 0 ? content.cards : [];
  const bubbles = cards.map((card, index) => renderFlexCard(card, utm, index));

  return {
    type: 'flex',
    altText: content.altText || 'รายการสินค้าแนะนำ',
    contents: {
      type: 'carousel',
      contents: bubbles,
    },
  };
}
