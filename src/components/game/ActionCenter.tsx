import { useGameStore } from '../../store/useGameStore';
import { ShoppingCart, MessageSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';
export const ActionCenter = () => {
  const logs = useGameStore(state => state.gameLog);
  const logEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);
  return (
    <div className="flex flex-col h-full gap-2">
      <div className="flex gap-2 h-12">
        <button className="flex-1 bg-green-700 hover:bg-green-600 border-b-4 border-green-900 text-white font-pixel text-xs flex items-center justify-center gap-2 active:border-b-0 active:translate-y-1">
          <ShoppingCart size={16} />
          <span>SHOP</span>
        </button>
        <button className="flex-1 bg-purple-700 hover:bg-purple-600 border-b-4 border-purple-900 text-white font-pixel text-xs flex items-center justify-center gap-2 active:border-b-0 active:translate-y-1">
          <MessageSquare size={16} />
          <span>CHAT</span>
        </button>
      </div>
      <div className="flex-1 bg-black border-2 border-evil-purple p-2 font-mono text-xs overflow-y-auto relative shadow-pixel">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-scanlines opacity-20" />
        <div className="flex flex-col gap-1">
          {logs.map((log, i) => (
            <div key={i} className={log.startsWith('>') ? 'text-rick-green' : 'text-gray-400'}>
              {log}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
};
