import { MessageSquare, ShoppingCart } from 'lucide-react';

export interface ActionDockProps {
  onChat?: () => void;
  onShop?: () => void;
  className?: string;
  layout?: 'row' | 'stack';
}

export function ActionDock({ onChat, onShop, className = '', layout = 'row' }: ActionDockProps) {
  const isStack = layout === 'stack';

  return (
    <div className={`${isStack ? 'flex flex-col' : 'flex'} gap-2 ${className}`}>
      {onShop ? (
        <button
          type="button"
          onClick={onShop}
          className="font-pixel flex h-12 flex-1 items-center justify-center gap-2 border-b-4 border-green-900 bg-green-700 text-xs text-white hover:bg-green-600 active:translate-y-1 active:border-b-0"
        >
          <ShoppingCart size={16} />
          <span>SHOP</span>
        </button>
      ) : null}

      {onChat ? (
        <button
          type="button"
          onClick={onChat}
          aria-label="Abrir chat"
          className="font-pixel flex h-12 flex-1 items-center justify-center gap-2 border-b-4 border-purple-900 bg-purple-700 text-xs text-white hover:bg-purple-600 active:translate-y-1 active:border-b-0"
        >
          <MessageSquare size={16} />
          <span>CHAT</span>
        </button>
      ) : null}
    </div>
  );
}
