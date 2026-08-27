import { SingleImageContent } from '@/types/message';
import { LineImageMessage } from '@/types/line';

export function renderImage(content: SingleImageContent): LineImageMessage {
  const url = content.originalContentUrl || '';
  const preview = content.previewImageUrl || url;
  
  return {
    type: 'image',
    originalContentUrl: url,
    previewImageUrl: preview,
  };
}
