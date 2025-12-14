import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type LobbyPanelProps = {
  children: ReactNode;
  className?: string;
};

export function LobbyPanel({ children, className }: LobbyPanelProps) {
  return (
    <div
      className={cn(
        'border-border bg-ui-panel rounded-xl border-4',
        'shadow-pixel',
        'p-3 sm:p-4',
        className,
      )}
    >
      {children}
    </div>
  );
}
