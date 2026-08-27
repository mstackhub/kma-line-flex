import { ImageCarouselContent, UtmConfig } from '@/types/message';
import { LineFlexMessage, LineFlexBubble } from '@/types/line';
import { applyUtmTracking } from '@/lib/utm';
import { sanitizeLineImageUrl } from './imageUrlHelper';

export function renderImageCarousel(
  content: ImageCarouselContent,
  utm?: UtmConfig
): LineFlexMessage {
  const cards = content.cards || [];
  const aspectRatio = content.aspectRatio || '1:1';

  const bubbles: LineFlexBubble[] = cards.map((card, index) => {
    let action: any = undefined;

    if (card.actionType === 'uri' && card.uri && card.uri.trim() !== '') {
      const finalUri = applyUtmTracking(
        card.uri.trim(),
        utm,
        `image_card_${index + 1}_${(card.label || 'item').toLowerCase().replace(/[^a-z0-9]/g, '_')}`
      );
      action = {
        type: 'uri',
        label: card.label || `Image ${index + 1}`,
        uri: finalUri,
      };
    } else if (card.actionType === 'message' && card.text && card.text.trim() !== '') {
      action = {
        type: 'message',
        label: card.label || `Image ${index + 1}`,
        text: card.text.trim(),
      };
    }

    const safeImageUrl = sanitizeLineImageUrl(
      card.imageUrl,
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80'
    );

    // Giga size (Maximum size supported by LINE Flex) + Pure full-bleed image (No body / No yellow bar)
    return {
      type: 'bubble',
      size: 'giga',
      hero: {
        type: 'image',
        url: safeImageUrl,
        size: 'full',
        aspectRatio,
        aspectMode: 'cover',
        action,
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
