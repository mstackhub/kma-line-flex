import { ImageCarouselContent, UtmConfig } from '@/types/message';
import { LineFlexMessage, LineFlexBubble } from '@/types/line';
import { applyUtmTracking } from '@/lib/utm';

export function renderImageCarousel(
  content: ImageCarouselContent,
  utm?: UtmConfig
): LineFlexMessage {
  const cards = content.cards || [];
  const aspectRatio = content.aspectRatio || '1:1';

  const bubbles: LineFlexBubble[] = cards.map((card, index) => {
    let action: any = undefined;

    if (card.actionType === 'uri' && card.uri) {
      const finalUri = applyUtmTracking(
        card.uri,
        utm,
        `image_card_${index + 1}_${(card.label || 'item').toLowerCase().replace(/[^a-z0-9]/g, '_')}`
      );
      action = {
        type: 'uri',
        label: card.label || `Image ${index + 1}`,
        uri: finalUri,
      };
    } else if (card.actionType === 'message' && card.text) {
      action = {
        type: 'message',
        label: card.label || `Image ${index + 1}`,
        text: card.text,
      };
    }

    return {
      type: 'bubble',
      size: 'mega',
      hero: {
        type: 'image',
        url: card.imageUrl || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
        size: 'full',
        aspectRatio,
        aspectMode: 'cover',
        action,
      },
      // Invisible spacer body required by some LINE Flex parsers
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'filler',
          },
        ],
        paddingAll: '0px',
      },
      styles: {
        body: {
          backgroundColor: '#FFFFFF00',
        },
      },
    };
  });

  return {
    type: 'flex',
    altText: content.altText || 'โปรโมชั่นภาพชุดพิเศษ',
    contents: {
      type: 'carousel',
      contents: bubbles.length > 0 ? bubbles : [],
    },
  };
}
