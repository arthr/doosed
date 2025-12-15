import { ChevronRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/cn';

interface MobileChatToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount: number;
}

export function MobileChatToggleButton({
  isOpen,
  onToggle,
  unreadCount,
}: MobileChatToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'md:hidden',
        'flex w-full items-center justify-between',
        'border-border-muted bg-panel rounded-xl border-2',
        'py-2 font-normal text-neutral-300',
        'active:bg-black/30',
      )}
    >
      <span className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        VER CHAT {unreadCount > 0 ? `(${unreadCount})` : ''} {isOpen ? '(ABERTO)' : ''}
      </span>
      <ChevronRight className={cn('transition-transform', isOpen ? 'rotate-90' : '')} />
    </button>
  );
}
