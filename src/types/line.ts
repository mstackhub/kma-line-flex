// LINE Messaging API Official Types

export type LineMessage =
  | LineTextMessage
  | LineImageMessage
  | LineImagemapMessage
  | LineFlexMessage;

export interface LineTextMessage {
  type: 'text';
  text: string;
}

export interface LineImageMessage {
  type: 'image';
  originalContentUrl: string;
  previewImageUrl: string;
}

export interface LineImagemapArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface LineImagemapAction {
  type: 'uri' | 'message';
  label?: string;
  linkUri?: string;
  text?: string;
  area: LineImagemapArea;
}

export interface LineImagemapMessage {
  type: 'imagemap';
  baseUrl: string;
  altText: string;
  baseSize: {
    width: number;
    height: number;
  };
  actions: LineImagemapAction[];
}

export interface LineFlexBubble {
  type: 'bubble';
  size?: 'nano' | 'micro' | 'kilo' | 'mega' | 'giga';
  header?: any;
  hero?: any;
  body?: any;
  footer?: any;
  styles?: {
    header?: { backgroundColor?: string };
    hero?: { backgroundColor?: string };
    body?: { backgroundColor?: string };
    footer?: { backgroundColor?: string };
  };
}

export interface LineFlexCarousel {
  type: 'carousel';
  contents: LineFlexBubble[];
}

export interface LineFlexMessage {
  type: 'flex';
  altText: string;
  contents: LineFlexBubble | LineFlexCarousel;
}
