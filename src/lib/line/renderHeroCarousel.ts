import { HeroCarouselContent, UtmConfig } from '@/types/message';
import { LineMessage } from '@/types/line';
import { renderImage } from './renderImage';
import { renderFlexCarousel } from './renderFlexCarousel';

export function renderHeroCarousel(
  content: HeroCarouselContent,
  utm?: UtmConfig
): LineMessage[] {
  const messages: LineMessage[] = [];

  // 1. Hero Artwork Image
  if (content.heroArtworkUrl) {
    messages.push(
      renderImage({
        originalContentUrl: content.heroArtworkUrl,
        previewImageUrl: content.heroArtworkUrl,
        altText: content.altText || 'Campaign Hero Banner',
        destinationUrl: content.heroDestinationUrl,
      })
    );
  }

  // 2. Product Carousel
  if (content.cards && content.cards.length > 0) {
    messages.push(
      renderFlexCarousel(
        {
          altText: content.altText || 'สินค้าแนะนำประจำแคมเปญ',
          cards: content.cards,
        },
        utm
      )
    );
  }

  return messages;
}
