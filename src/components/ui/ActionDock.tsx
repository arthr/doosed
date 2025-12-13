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
          className="flex-1 h-12 bg-green-700 hover:bg-green-600 border-b-4 border-green-900 text-white font-pixel text-xs flex items-center justify-center gap-2 active:border-b-0 active:translate-y-1"
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
          className="flex-1 h-12 bg-purple-700 hover:bg-purple-600 border-b-4 border-purple-900 text-white font-pixel text-xs flex items-center justify-center gap-2 active:border-b-0 active:translate-y-1"
        >
          <MessageSquare size={16} />
          <span>CHAT</span>
        </button>
      ) : null}
    </div>
  );
}


