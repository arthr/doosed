import type { ReactNode } from 'react';

export interface DevOverlayPreviewProps {
  preview: ReactNode | null;
}

export function DevOverlayPreview({ preview }: DevOverlayPreviewProps) {
  if (!preview) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-auto bg-void-black text-text-primary">
      {preview}
    </div>
  );
}
