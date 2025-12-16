import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type Vec2 = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export interface DevDockProps {
  children: React.ReactNode;
}

const TRANSITION_DURATION = 200; // ms

export function DevDock({ children }: DevDockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dockPos, setDockPos] = useState<Vec2>({ x: 24, y: 24 });

  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const toggle = () => setIsExpanded(prev => !prev);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button,select,option,input,textarea,a')) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    event.preventDefault();
    (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: dockPos.x,
      originY: dockPos.y,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    const maxX = isExpanded ? window.innerWidth - 240 : window.innerWidth - 56;
    const maxY = isExpanded ? window.innerHeight - 120 : window.innerHeight - 56;

    const nextX = clamp(drag.originX + dx, 8, maxX);
    const nextY = clamp(drag.originY + dy, 8, maxY);
    setDockPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
  };

  return (
    <div
      style={{ position: 'fixed', left: dockPos.x, top: dockPos.y }}
      className="z-60"
    >
      <div
        style={{
          touchAction: 'none',
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
        className={cn(
          'rounded border-2 border-neutral-700 bg-neutral-950/95 backdrop-blur',
          'shadow-[0_12px_40px_rgba(0,0,0,0.65)]',
          'overflow-hidden',
          'transition-[width,max-height] ease-out',
          // Largura
          isExpanded ? 'w-[min(92vw,420px)]' : 'w-auto',
          // Altura maxima
          isExpanded ? 'max-h-[80vh]' : 'max-h-[52px]',
        )}
      >
        {/* Header - sempre visivel */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={cn(
            'flex items-center justify-between gap-4',
            'cursor-move select-none',
            'px-3 py-2',
            isExpanded && 'border-b border-neutral-800',
          )}
        >
          <button
            type="button"
            onPointerDown={e => e.stopPropagation()}
            onClick={toggle}
            aria-label={isExpanded ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={isExpanded}
            className={cn(
              'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
              'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
            )}
          >
            {isExpanded ? 'Fechar' : 'Abrir'}
          </button>
          <div className="text-xs tracking-widest text-neutral-400 uppercase">
            Dev Menu
          </div>
        </div>

        {/* Content - animado via CSS */}
        <div
          className={cn(
            'transition-opacity ease-out',
            isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none',
          )}
          style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
        >
          <div className="flex flex-col gap-3 p-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
