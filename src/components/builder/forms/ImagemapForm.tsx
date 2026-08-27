'use client';

import React from 'react';
import { ImagemapMessageContent } from '@/types/message';
import { ImagemapVisualEditor } from '@/components/imagemap/ImagemapVisualEditor';

interface ImagemapFormProps {
  content: ImagemapMessageContent;
  onChange: (updated: ImagemapMessageContent) => void;
}

export function ImagemapForm({ content, onChange }: ImagemapFormProps) {
  return (
    <div className="space-y-4">
      <ImagemapVisualEditor content={content} onChange={onChange} />
    </div>
  );
}
