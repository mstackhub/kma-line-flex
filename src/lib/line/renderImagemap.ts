import { ImagemapMessageContent, UtmConfig } from '@/types/message';
import { LineImagemapMessage, LineImagemapAction } from '@/types/line';
import { applyUtmTracking } from '@/lib/utm';

export function renderImagemap(
  content: ImagemapMessageContent,
  utm?: UtmConfig
): LineImagemapMessage {
  const baseWidth = content.baseSize?.width || 1040;
  const baseHeight = content.baseSize?.height || 1040;

  const actions: LineImagemapAction[] = (content.actions || []).map((action, index) => {
    // Clamp coordinate bounds to integer and positive
    const x = Math.max(0, Math.round(action.x));
    const y = Math.max(0, Math.round(action.y));
    const width = Math.min(baseWidth - x, Math.max(1, Math.round(action.width)));
    const height = Math.min(baseHeight - y, Math.max(1, Math.round(action.height)));

    if (action.actionType === 'uri') {
      const linkUri = applyUtmTracking(
        action.uri || '',
        utm,
        action.label ? `zone_${action.label.toLowerCase().replace(/\s+/g, '_')}` : `zone_${index + 1}`
      );
      return {
        type: 'uri',
        label: action.label || `Action ${index + 1}`,
        linkUri,
        area: { x, y, width, height },
      };
    } else {
      return {
        type: 'message',
        label: action.label || `Action ${index + 1}`,
        text: action.text || '',
        area: { x, y, width, height },
      };
    }
  });

  return {
    type: 'imagemap',
    baseUrl: content.baseUrl || '',
    altText: content.altText || 'โปรโมชั่นพิเศษ',
    baseSize: {
      width: baseWidth,
      height: baseHeight,
    },
    actions,
  };
}
