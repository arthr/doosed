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
      className={`border-evil-purple shadow-pixel relative overflow-y-auto border-2 bg-black p-2 font-mono text-xs ${className}`}
    >
      <div className="bg-scanlines pointer-events-none absolute top-0 left-0 h-full w-full opacity-20" />
      <div className="relative flex flex-col gap-1">
        {logs.map((log, i) => (
          <div
            key={i}
            role="listitem"
            className={log.startsWith('>') ? 'text-rick-green' : 'text-gray-400'}
          >
            {log}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
