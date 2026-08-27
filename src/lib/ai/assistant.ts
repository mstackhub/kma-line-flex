import { MessageType, FlexCardContent } from '@/types/message';
import { getSettings } from '@/lib/storage';

export interface AiFormatRecommendation {
  recommendedType: MessageType;
  confidence: number;
  reason: string;
  suggestedCardCount?: number;
}

export interface AiStructuredContentResult {
  messageType: MessageType;
  campaignName?: string;
  altText: string;
  cards?: FlexCardContent[];
  textContent?: string;
  missingInformation: string[];
  notes?: string;
}

export async function analyzeCampaignIntent(userPrompt: string): Promise<AiFormatRecommendation> {
  const lower = userPrompt.toLowerCase();

  // Smart heuristic rule-based intent mapping
  if (
    lower.includes('swipe') ||
    lower.includes('เลื่อน') ||
    lower.includes('carousel') ||
    lower.includes('หลายสินค้า') ||
    lower.includes('4 ตัว') ||
    lower.includes('3 ตัว') ||
    lower.includes('5 ตัว')
  ) {
    return {
      recommendedType: 'flex_carousel',
      confidence: 0.95,
      reason: 'ผู้ใช้ต้องการนำเสนอสินค้าหลายรายการแบบเลื่อนสไลด์ (Swipeable Carousel)',
      suggestedCardCount: 4,
    };
  }

  if (
    lower.includes('imagemap') ||
    lower.includes('ภาพเดียว') ||
    lower.includes('หลายจุด') ||
    lower.includes('หลายพื้นที่') ||
    lower.includes('4 โซน') ||
    lower.includes('artwork เดียว')
  ) {
    return {
      recommendedType: 'imagemap',
      confidence: 0.92,
      reason: 'ต้องการ Artwork ภาพเดียวที่มีหลายพื้นที่กดแยกไปยังหลาย URL',
      suggestedCardCount: 4,
    };
  }

  if (
    lower.includes('hero') ||
    lower.includes('แคมเปญใหญ่') ||
    lower.includes('payday') ||
    lower.includes('9.9') ||
    lower.includes('11.11') ||
    lower.includes('banner')
  ) {
    return {
      recommendedType: 'hero_carousel',
      confidence: 0.9,
      reason: 'แคมเปญขนาดใหญ่ที่ต้องการทั้งภาพ Banner หลักและรายการสินค้าด้านล่าง',
      suggestedCardCount: 3,
    };
  }

  if (
    lower.includes('สินค้าเดียว') ||
    lower.includes('การ์ดเดียว') ||
    lower.includes('card') ||
    lower.includes('สินค้าใหม่ 1 ตัว') ||
    lower.includes('single')
  ) {
    return {
      recommendedType: 'flex_card',
      confidence: 0.9,
      reason: 'การโปรโมทสินค้าเดี่ยวแบบเน้นจุดเด่น พร้อมปุ่มสั่งซื้อ',
      suggestedCardCount: 1,
    };
  }

  if (
    lower.includes('ข้อความ') ||
    lower.includes('ประกาศ') ||
    lower.includes('text') ||
    lower.includes('ทักทาย')
  ) {
    return {
      recommendedType: 'text',
      confidence: 0.85,
      reason: 'ข้อความประกาศแบบ Text ธรรมดา',
    };
  }

  // Default recommendation
  return {
    recommendedType: 'flex_carousel',
    confidence: 0.8,
    reason: 'แนะนำรูปแบบ Flex Carousel เพื่อเพิ่มความน่าสนใจและการมีส่วนร่วมของลูกค้า',
    suggestedCardCount: 3,
  };
}

export async function generateStructuredContent(
  userPrompt: string,
  targetType?: MessageType
): Promise<AiStructuredContentResult> {
  const settings = getSettings();
  const apiKey = settings.geminiApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      // Call Gemini API with Structured JSON Schema output
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const systemInstruction = `
You are a LINE Official Account Marketing Content Assistant.
Your task is to take unstructured user input and convert it into structured LINE broadcast data.
DO NOT generate raw LINE Flex JSON. Only output structured marketing fields according to the schema.
CRITICAL RULES:
1. If the user mentions products but did not provide destination URLs or images, DO NOT hallucinate fake URLs. Instead, put them into the 'missingInformation' array.
2. Provide compelling Thai marketing copy for badges (e.g. NEW, HOT, SALE 50%), headlines, and descriptions.
3. Suggest a concise altText for mobile notifications.
4. Response MUST be valid JSON matching this schema:
{
  "messageType": "flex_carousel" | "flex_card" | "imagemap" | "text" | "hero_carousel" | "image",
  "campaignName": string,
  "altText": string,
  "cards": [
    {
      "heroImage": string,
      "badge": string,
      "headline": string,
      "subheadline": string,
      "description": string,
      "originalPrice": string,
      "salePrice": string,
      "ctaLabel": string,
      "ctaUrl": string
    }
  ],
  "textContent": string,
  "missingInformation": [string],
  "notes": string
}
`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nTarget Message Type: ${targetType || 'auto'}\nUser Prompt:\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return JSON.parse(text) as AiStructuredContentResult;
        }
      }
    } catch {
      // Fall through to smart offline parser
    }
  }

  // Smart Built-in Fallback Parser (offline / without Gemini API key)
  const missing: string[] = [];
  const lines = userPrompt.split('\n').map((l) => l.trim()).filter(Boolean);
  
  const foundUrls = userPrompt.match(/https?:\/\/[^\s]+/g) || [];
  if (foundUrls.length === 0) {
    missing.push('ลิงก์ปลายทาง (Destination URL) สำหรับแต่ละสินค้า');
  }

  const sampleCards: FlexCardContent[] = [
    {
      id: 'ai-card-1',
      heroImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      badge: 'NEW ARRIVAL',
      headline: lines[0] || 'สินค้าแนะนำประจำสัปดาห์',
      subheadline: 'คุณภาพพรีเมียม สั่งซื้อวันนี้รับของแถม',
      description: 'สินค้าลิมิเต็ด ผลิตจากวัสดุคุณภาพสูง รับประกันของแท้ 100%',
      originalPrice: '1,590',
      salePrice: '990',
      currencySymbol: '฿',
      ctaLabel: 'ช้อปเลย',
      ctaUrl: foundUrls[0] || 'https://myshop.line.me',
      ctaColor: '#06C755',
    },
    {
      id: 'ai-card-2',
      heroImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      badge: 'HOT DEAL',
      headline: lines[1] || 'หูฟังบลูทูธไร้สาย',
      subheadline: 'ระบบตัดเสียงรบกวน แบตอึด 40 ชม.',
      description: 'พลังเสียงเบสหนักแน่น พกพาสะดวก เชื่อมต่อง่ายทุกอุปกรณ์',
      originalPrice: '2,490',
      salePrice: '1,790',
      currencySymbol: '฿',
      ctaLabel: 'ช้อปเลย',
      ctaUrl: foundUrls[1] || foundUrls[0] || 'https://myshop.line.me',
      ctaColor: '#06C755',
    },
    {
      id: 'ai-card-3',
      heroImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      badge: 'SALE 40%',
      headline: lines[2] || 'สมาร์ทวอทช์สุขภาพ',
      subheadline: 'กันน้ำ วัดหัวใจ ติดตามการนอน',
      description: 'หน้าจอคมชัดสว่างสู้แดด โหมดออกกำลังกายกว่า 100 โหมด',
      originalPrice: '1,990',
      salePrice: '1,190',
      currencySymbol: '฿',
      ctaLabel: 'ช้อปเลย',
      ctaUrl: foundUrls[2] || foundUrls[0] || 'https://myshop.line.me',
      ctaColor: '#06C755',
    },
  ];

  return {
    messageType: targetType || 'flex_carousel',
    campaignName: lines[0] ? `แคมเปญ ${lines[0]}` : 'แคมเปญโปรโมชั่นใหม่',
    altText: 'โปรโมชั่นพิเศษและสินค้ายอดนิยมประจำเดือน',
    cards: sampleCards,
    textContent: userPrompt,
    missingInformation: missing,
    notes: 'สร้าง Structured Data เบื้องต้นจาก Prompt พร้อมให้ตรวจสอบและปรับแต่งก่อนส่ง',
  };
}
