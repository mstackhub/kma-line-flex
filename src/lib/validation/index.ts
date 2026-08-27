import {
  Campaign,
  ValidationError,
  TextMessageContent,
  SingleImageContent,
  ImagemapMessageContent,
  FlexCardContent,
  FlexCarouselContent,
  HeroCarouselContent,
  MixedMessageContent,
} from '@/types/message';

function isValidHttpsUrl(urlString?: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const url = new URL(urlString.trim());
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateFlexCard(
  card: FlexCardContent,
  indexLabel: string = 'การ์ด'
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!card.headline || card.headline.trim() === '') {
    errors.push({
      field: 'headline',
      message: `${indexLabel}: กรุณาระบุหัวข้อหลัก (Headline)`,
    });
  }

  if (card.heroImage && card.heroImage.trim() !== '') {
    if (!isValidHttpsUrl(card.heroImage)) {
      errors.push({
        field: 'heroImage',
        message: `${indexLabel}: ลิงก์รูปภาพหลักต้องเป็น HTTPS (https://...)`,
      });
    }
  }

  if (card.ctaLabel && card.ctaLabel.trim() !== '') {
    if (!card.ctaUrl || card.ctaUrl.trim() === '') {
      errors.push({
        field: 'ctaUrl',
        message: `${indexLabel}: มีการใส่ปุ่ม "${card.ctaLabel}" แต่ยังไม่ได้ระบุลิงก์ปลายทาง (CTA URL)`,
      });
    } else if (!isValidHttpsUrl(card.ctaUrl)) {
      errors.push({
        field: 'ctaUrl',
        message: `${indexLabel}: ลิงก์ปุ่มกด (CTA URL) ต้องขึ้นต้นด้วย https://`,
      });
    }
  }

  return errors;
}

export function validateCampaign(campaign: Campaign): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!campaign.name || campaign.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'กรุณาระบุชื่อแคมเปญ (Campaign Name)',
    });
  }

  const { messageType, content } = campaign;

  switch (messageType) {
    case 'text': {
      const textContent = content as TextMessageContent;
      if (!textContent.text || textContent.text.trim() === '') {
        errors.push({
          field: 'text',
          message: 'กรุณากรอกข้อความที่ต้องการส่ง',
        });
      } else if (textContent.text.length > 5000) {
        errors.push({
          field: 'text',
          message: 'ข้อความยาวเกินขีดจำกัดของ LINE (สูงสุด 5,000 ตัวอักษร)',
        });
      }
      break;
    }

    case 'image': {
      const imgContent = content as SingleImageContent;
      if (!imgContent.originalContentUrl || imgContent.originalContentUrl.trim() === '') {
        errors.push({
          field: 'originalContentUrl',
          message: 'กรุณาระบุลิงก์รูปภาพ (Image URL)',
        });
      } else if (!isValidHttpsUrl(imgContent.originalContentUrl)) {
        errors.push({
          field: 'originalContentUrl',
          message: 'ลิงก์รูปภาพต้องเป็น HTTPS เท่านั้นตามมาตรฐาน LINE',
        });
      }
      break;
    }

    case 'imagemap': {
      const mapContent = content as ImagemapMessageContent;
      if (!mapContent.baseUrl || mapContent.baseUrl.trim() === '') {
        errors.push({
          field: 'baseUrl',
          message: 'กรุณาระบุลิงก์รูปภาพ Artwork (Base URL)',
        });
      } else if (!isValidHttpsUrl(mapContent.baseUrl)) {
        errors.push({
          field: 'baseUrl',
          message: 'ลิงก์รูปภาพ Imagemap ต้องเป็น HTTPS เท่านั้น',
        });
      }

      if (!mapContent.altText || mapContent.altText.trim() === '') {
        errors.push({
          field: 'altText',
          message: 'กรุณาระบุข้อความแจ้งเตือนแทนรูปภาพ (Alt Text)',
        });
      }

      if (!mapContent.actions || mapContent.actions.length === 0) {
        errors.push({
          field: 'actions',
          message: 'กรุณาสร้างพื้นที่คลิกอย่างน้อย 1 จุดบนรูปภาพ Artwork',
        });
      } else {
        mapContent.actions.forEach((act, idx) => {
          const zoneLabel = act.label ? `จุดที่ ${idx + 1} (${act.label})` : `จุดที่ ${idx + 1}`;
          if (act.actionType === 'uri') {
            if (!act.uri || act.uri.trim() === '') {
              errors.push({
                field: `actions.${idx}.uri`,
                message: `${zoneLabel}: กรุณาระบุลิงก์ปลายทาง (URL)`,
              });
            } else if (!isValidHttpsUrl(act.uri)) {
              errors.push({
                field: `actions.${idx}.uri`,
                message: `${zoneLabel}: ลิงก์ปลายทางต้องเป็น HTTPS เท่านั้น`,
              });
            }
          } else if (act.actionType === 'message') {
            if (!act.text || act.text.trim() === '') {
              errors.push({
                field: `actions.${idx}.text`,
                message: `${zoneLabel}: กรุณาระบุข้อความที่จะส่งเมื่อกด`,
              });
            }
          }
        });
      }
      break;
    }

    case 'flex_card': {
      const card = content as FlexCardContent;
      errors.push(...validateFlexCard(card, 'Flex Card'));
      break;
    }

    case 'flex_carousel': {
      const carousel = content as FlexCarouselContent;
      if (!carousel.altText || carousel.altText.trim() === '') {
        errors.push({
          field: 'altText',
          message: 'กรุณาระบุข้อความแจ้งเตือน (Alt Text) สำหรับ Carousel',
        });
      }

      const cards = carousel.cards || [];
      if (cards.length === 0) {
        errors.push({
          field: 'cards',
          message: 'Carousel ต้องมีการ์ดอย่างน้อย 1 การ์ด',
        });
      } else if (cards.length > 12) {
        errors.push({
          field: 'cards',
          message: `LINE รองรับ Carousel ได้สูงสุด 12 การ์ด (ปัจจุบันมี ${cards.length} การ์ด)`,
        });
      } else {
        cards.forEach((card, idx) => {
          errors.push(...validateFlexCard(card, `การ์ดที่ ${idx + 1}`));
        });
      }
      break;
    }

    case 'hero_carousel': {
      const hero = content as HeroCarouselContent;
      if (!hero.heroArtworkUrl || hero.heroArtworkUrl.trim() === '') {
        errors.push({
          field: 'heroArtworkUrl',
          message: 'กรุณาระบุรูปภาพ Campaign Hero Artwork',
        });
      } else if (!isValidHttpsUrl(hero.heroArtworkUrl)) {
        errors.push({
          field: 'heroArtworkUrl',
          message: 'รูปภาพ Campaign Hero ต้องเป็น HTTPS เท่านั้น',
        });
      }

      if (!hero.altText || hero.altText.trim() === '') {
        errors.push({
          field: 'altText',
          message: 'กรุณาระบุข้อความแจ้งเตือน (Alt Text)',
        });
      }

      const cards = hero.cards || [];
      if (cards.length === 0) {
        errors.push({
          field: 'cards',
          message: 'กรุณาเพิ่มการ์ดสินค้าอย่างน้อย 1 การ์ด',
        });
      } else if (cards.length > 12) {
        errors.push({
          field: 'cards',
          message: `LINE รองรับ Carousel ได้สูงสุด 12 การ์ด (ปัจจุบันมี ${cards.length} การ์ด)`,
        });
      } else {
        cards.forEach((card, idx) => {
          errors.push(...validateFlexCard(card, `สินค้าที่ ${idx + 1}`));
        });
      }
      break;
    }

    case 'mixed': {
      const mixed = content as MixedMessageContent;
      const blocks = mixed.blocks || [];
      if (blocks.length === 0) {
        errors.push({
          field: 'blocks',
          message: 'กรุณาเพิ่มบล็อกข้อความอย่างน้อย 1 บล็อก',
        });
      } else if (blocks.length > 5) {
        errors.push({
          field: 'blocks',
          message: `LINE รองรับการส่งพร้อมกันได้สูงสุด 5 บล็อกข้อความต่อ 1 บรอดแคสต์ (ปัจจุบันมี ${blocks.length} บล็อก)`,
        });
      }
      break;
    }
  }

  return errors;
}
