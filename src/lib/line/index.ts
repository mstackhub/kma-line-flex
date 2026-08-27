import { Campaign } from '@/types/message';
import { LineMessage } from '@/types/line';
import { renderText } from './renderText';
import { renderImage } from './renderImage';
import { renderImagemap } from './renderImagemap';
import { renderFlexCard } from './renderFlexCard';
import { renderFlexCarousel } from './renderFlexCarousel';
import { renderHeroCarousel } from './renderHeroCarousel';
import { renderMixedMessage } from './renderMixedMessage';

export function renderLineMessages(campaign: Campaign): LineMessage[] {
  const { messageType, content, utm } = campaign;

  switch (messageType) {
    case 'text':
      return [renderText(content as any)];

    case 'image':
      return [renderImage(content as any)];

    case 'imagemap':
      return [renderImagemap(content as any, utm)];

    case 'flex_card': {
      const card = content as any;
      return [
        {
          type: 'flex',
          altText: card.headline || 'โปรโมชั่นพิเศษ',
          contents: renderFlexCard(card, utm),
        },
      ];
    }

    case 'flex_carousel':
      return [renderFlexCarousel(content as any, utm)];

    case 'hero_carousel':
      return renderHeroCarousel(content as any, utm);

    case 'mixed':
      return renderMixedMessage(content as any, utm);

    default:
      return [];
  }
}

export * from './renderText';
export * from './renderImage';
export * from './renderImagemap';
export * from './renderFlexCard';
export * from './renderFlexCarousel';
export * from './renderHeroCarousel';
export * from './renderMixedMessage';
