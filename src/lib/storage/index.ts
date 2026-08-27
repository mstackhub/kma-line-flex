import fs from 'fs';
import path from 'path';
import { Campaign, Template, MediaAsset, Settings } from '@/types/message';
import { DEFAULT_TEMPLATES } from '@/lib/templates/defaultTemplates';

const DATA_DIR = path.join(process.cwd(), '.data');

function ensureDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile<T>(fileName: string, fallback: T): T {
  ensureDirectory();
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonFile<T>(fileName: string, data: T): void {
  ensureDirectory();
  const filePath = path.join(DATA_DIR, fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// 1. CAMPAIGNS
export function getCampaigns(): Campaign[] {
  return readJsonFile<Campaign[]>('campaigns.json', []);
}

export function getCampaignById(id: string): Campaign | undefined {
  const campaigns = getCampaigns();
  return campaigns.find((c) => c.id === id);
}

export function saveCampaign(campaign: Campaign): Campaign {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex((c) => c.id === campaign.id);
  const updatedCampaign = {
    ...campaign,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    campaigns[index] = updatedCampaign;
  } else {
    campaigns.unshift(updatedCampaign);
  }

  writeJsonFile('campaigns.json', campaigns);
  return updatedCampaign;
}

export function deleteCampaign(id: string): boolean {
  const campaigns = getCampaigns();
  const filtered = campaigns.filter((c) => c.id !== id);
  if (filtered.length !== campaigns.length) {
    writeJsonFile('campaigns.json', filtered);
    return true;
  }
  return false;
}

// 2. TEMPLATES
export function getTemplates(): Template[] {
  const customTemplates = readJsonFile<Template[]>('custom_templates.json', []);
  return [...DEFAULT_TEMPLATES, ...customTemplates];
}

export function getTemplateById(id: string): Template | undefined {
  return getTemplates().find((t) => t.id === id);
}

export function saveCustomTemplate(template: Template): Template {
  const customTemplates = readJsonFile<Template[]>('custom_templates.json', []);
  const index = customTemplates.findIndex((t) => t.id === template.id);
  if (index >= 0) {
    customTemplates[index] = template;
  } else {
    customTemplates.unshift(template);
  }
  writeJsonFile('custom_templates.json', customTemplates);
  return template;
}

// 3. MEDIA ASSETS
const DEFAULT_ASSETS: MediaAsset[] = [
  {
    id: 'media-01',
    fileName: 'hero-banner-payday.jpg',
    url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1040&auto=format&fit=crop&q=80',
    fileSize: 245000,
    width: 1040,
    height: 650,
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'media-02',
    fileName: 'headphones-product.jpg',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    fileSize: 184000,
    width: 800,
    height: 520,
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'media-03',
    fileName: 'sneakers-red.jpg',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    fileSize: 210000,
    width: 800,
    height: 520,
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'media-04',
    fileName: 'smartwatch-black.jpg',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    fileSize: 165000,
    width: 800,
    height: 520,
    mimeType: 'image/jpeg',
    createdAt: new Date().toISOString(),
  },
];

export function getMediaAssets(): MediaAsset[] {
  return readJsonFile<MediaAsset[]>('media_assets.json', DEFAULT_ASSETS);
}

export function saveMediaAsset(asset: MediaAsset): MediaAsset {
  const assets = getMediaAssets();
  assets.unshift(asset);
  writeJsonFile('media_assets.json', assets);
  return asset;
}

export function deleteMediaAsset(id: string): boolean {
  const assets = getMediaAssets();
  const filtered = assets.filter((a) => a.id !== id);
  if (filtered.length !== assets.length) {
    writeJsonFile('media_assets.json', filtered);
    return true;
  }
  return false;
}

// 4. SETTINGS
const DEFAULT_SETTINGS: Settings = {
  channelId: process.env.LINE_CHANNEL_ID || '2001992825',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  environmentMode: 'development',
  defaultTestUserId: 'U1234567890abcdef1234567890abcdef',
  isConnected: false,
};

export function getSettings(): Settings {
  return readJsonFile<Settings>('settings.json', DEFAULT_SETTINGS);
}

export function saveSettings(settings: Partial<Settings>): Settings {
  const current = getSettings();
  const updated: Settings = {
    ...current,
    ...settings,
  };
  writeJsonFile('settings.json', updated);
  return updated;
}

// 5. BROADCAST & TEST LOGS
export interface BroadcastLog {
  id: string;
  campaignId: string;
  campaignName: string;
  type: 'test' | 'broadcast';
  recipient?: string;
  environmentMode: string;
  status: 'success' | 'failed';
  errorMessage?: string;
  sentAt: string;
  messagesCount: number;
}

export function getBroadcastLogs(): BroadcastLog[] {
  return readJsonFile<BroadcastLog[]>('broadcast_logs.json', []);
}

export function logBroadcast(entry: BroadcastLog): void {
  const logs = getBroadcastLogs();
  logs.unshift(entry);
  writeJsonFile('broadcast_logs.json', logs.slice(0, 100)); // Keep last 100 logs
}
