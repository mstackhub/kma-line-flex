export type MessageType =
  | 'text'
  | 'image'
  | 'image_carousel'
  | 'imagemap'
  | 'flex_card'
  | 'flex_carousel'
  | 'hero_carousel'
  | 'mixed';

export type CampaignStatus =
  | 'draft'
  | 'ready'
  | 'test_sent'
  | 'scheduled'
  | 'sent'
  | 'failed';

export type EnvironmentMode = 'development' | 'production';

export interface TextMessageContent {
  text: string;
}

export interface SingleImageContent {
  originalContentUrl: string;
  previewImageUrl?: string;
  altText: string;
  destinationUrl?: string; // Optional clickable link in preview/rich-flow
}

export interface ImageCarouselCard {
  id?: string;
  imageUrl: string;
  actionType: 'uri' | 'message';
  uri?: string;
  text?: string;
  label?: string;
}

export interface ImageCarouselContent {
  altText: string;
  aspectRatio?: '1:1' | '1.51:1' | '20:13' | '16:9' | '9:16';
  cards: ImageCarouselCard[];
}

export interface ImagemapArea {
  id: string;
  x: number; // 0 to 1040 (standard LINE Imagemap base width)
  y: number;
  width: number;
  height: number;
  actionType: 'uri' | 'message';
  uri?: string;
  text?: string;
  label?: string; // For human UI reference
}

export interface ImagemapMessageContent {
  baseUrl: string;
  altText: string;
  baseSize: {
    width: number; // typically 1040
    height: number; // calculated from artwork aspect ratio
  };
  actions: ImagemapArea[];
}

export interface FlexCardContent {
  id?: string;
  heroImage?: string;
  heroAspectRatio?: '1:1' | '1.51:1' | '20:13' | '16:9';
  enableImageClick?: boolean;
  imageClickUrl?: string;
  badge?: string;
  headline: string;
  subheadline?: string;
  description?: string;
  originalPrice?: string | number;
  salePrice?: string | number;
  currencySymbol?: string;
  ctaLabel: string;
  ctaUrl: string;
  ctaColor?: string;
  headerBgColor?: string;
}

export interface FlexCarouselContent {
  altText: string;
  cards: FlexCardContent[];
}

export interface HeroCarouselContent {
  heroArtworkUrl: string;
  heroDestinationUrl?: string;
  altText: string;
  cards: FlexCardContent[];
}

export interface MixedBlock {
  id: string;
  type: 'text' | 'image' | 'image_carousel' | 'imagemap' | 'flex_card' | 'flex_carousel';
  content:
    | TextMessageContent
    | SingleImageContent
    | ImageCarouselContent
    | ImagemapMessageContent
    | FlexCardContent
    | FlexCarouselContent;
}

export interface MixedMessageContent {
  altText: string;
  blocks: MixedBlock[];
}

export interface UtmConfig {
  enabled: boolean;
  source: string;
  medium: string;
  campaign: string;
  content: string;
}

export interface Campaign {
  id: string;
  name: string;
  internalNote?: string;
  messageType: MessageType;
  content:
    | TextMessageContent
    | SingleImageContent
    | ImageCarouselContent
    | ImagemapMessageContent
    | FlexCardContent
    | FlexCarouselContent
    | HeroCarouselContent
    | MixedMessageContent;
  utm: UtmConfig;
  status: CampaignStatus;
  templateId?: string;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
  lastTestRecipient?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: 'promotion' | 'product' | 'announcement' | 'ecommerce';
  messageType: MessageType;
  thumbnailUrl?: string;
  defaultContent: any;
  isBuiltIn: boolean;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  fileSize: number; // bytes
  width?: number;
  height?: number;
  mimeType: string;
  createdAt: string;
}

export interface Settings {
  channelId: string;
  channelSecret: string;
  channelAccessToken: string;
  geminiApiKey?: string;
  environmentMode: EnvironmentMode;
  defaultTestUserId?: string;
  isConnected: boolean;
  lastCheckedAt?: string;
}

export interface ValidationError {
  field?: string;
  message: string;
  cardIndex?: number;
  blockIndex?: number;
}
