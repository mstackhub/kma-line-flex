import { MixedMessageContent, UtmConfig } from '@/types/message';
import { LineMessage } from '@/types/line';
import { renderText } from './renderText';
import { renderImage } from './renderImage';
import { renderImagemap } from './renderImagemap';
import { renderFlexCard } from './renderFlexCard';
import { renderFlexCarousel } from './renderFlexCarousel';

export function renderMixedMessage(
  content: MixedMessageContent,
  utm?: UtmConfig
): LineMessage[] {
  const messages: LineMessage[] = [];

  for (const block of content.blocks || []) {
    switch (block.type) {
      case 'text':
        messages.push(renderText(block.content as any));
        break;
      case 'image':
        messages.push(renderImage(block.content as any));
        break;
      case 'imagemap':
        messages.push(renderImagemap(block.content as any, utm));
        break;
      case 'flex_card':
        messages.push({
          type: 'flex',
          altText: content.altText || (block.content as any).headline || 'ข้อมูลพิเศษ',
          contents: renderFlexCard(block.content as any, utm),
        });
        break;
      case 'flex_carousel':
        messages.push(
          renderFlexCarousel(
            {
              altText: content.altText || 'รายการสินค้า',
              cards: (block.content as any).cards || [],
            },
            utm
          )
        );
        break;
    }
  }

  return messages;
}
