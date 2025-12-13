import { useEffect, useRef } from 'react';

export interface GameLogPanelProps {
  logs: string[];
  className?: string;
}

export function GameLogPanel({ logs, className = '' }: GameLogPanelProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div
      role="log"
      aria-label="Log do jogo"
      aria-live="polite"
      className={`bg-black border-2 border-evil-purple p-2 font-mono text-xs overflow-y-auto relative shadow-pixel ${className}`}
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-scanlines opacity-20" />
      <div className="relative flex flex-col gap-1">
        {logs.map((log, i) => (
          <div key={i} role="listitem" className={log.startsWith('>') ? 'text-rick-green' : 'text-gray-400'}>
            {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}


