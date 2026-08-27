import { TextMessageContent } from '@/types/message';
import { LineTextMessage } from '@/types/line';

export function renderText(content: TextMessageContent): LineTextMessage {
  return {
    type: 'text',
    text: content.text || '',
  };
}
