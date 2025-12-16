import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';

type Vec2 = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export interface DevDockProps {
  children: React.ReactNode;
}

export function DevDock({ children }: DevDockProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dockPos, setDockPos] = useState<Vec2>({ x: 24, y: 24 });

  const fabDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    didDrag: boolean;
  } | null>(null);

  const menuDragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  return (
    <div style={{ position: 'fixed', left: dockPos.x, top: dockPos.y }} className="z-60">
      {!isMenuOpen ? (
        <div
          onPointerDown={event => {
            const target = event.target as HTMLElement;
            if (target.closest('button,select,option,input,textarea,a')) return;
            if (event.pointerType === 'mouse' && event.button !== 0) return;
            event.preventDefault();
            (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
            fabDragRef.current = {
              pointerId: event.pointerId,
              startX: event.clientX,
              startY: event.clientY,
              originX: dockPos.x,
              originY: dockPos.y,
              didDrag: false,
            };
          }}
          onPointerMove={event => {
            const drag = fabDragRef.current;
            if (!drag || drag.pointerId !== event.pointerId) return;

            const dx = event.clientX - drag.startX;
            const dy = event.clientY - drag.startY;

            if (!drag.didDrag && Math.hypot(dx, dy) > 4) drag.didDrag = true;

            const nextX = clamp(drag.originX + dx, 8, window.innerWidth - 56);
            const nextY = clamp(drag.originY + dy, 8, window.innerHeight - 56);
            setDockPos({ x: nextX, y: nextY });
          }}
          onPointerUp={event => {
            const drag = fabDragRef.current;
            if (!drag || drag.pointerId !== event.pointerId) return;
            fabDragRef.current = null;
          }}
          style={{ touchAction: 'none' }}
          className={cn(
            'px-3 py-2!',
            'rounded-lg border-2 border-neutral-700 bg-neutral-950/95 backdrop-blur',
            'shadow-[0_12px_40px_rgba(0,0,0,0.65)]',
            'font-pixel text-sm text-white',
            'cursor-move select-none',
            'flex items-center justify-between gap-4',
          )}
        >
          <button
            type="button"
            aria-label="Abrir menu de desenvolvimento"
            onClick={() => setIsMenuOpen(true)}
            className={cn(
              'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
              'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
            )}
            style={{ touchAction: 'none' }}
          >
            Abrir
          </button>
          <div className="text-xs tracking-widest text-neutral-400 uppercase">Dev Menu</div>
        </div>
      ) : null}

      {isMenuOpen ? (
        <div
          style={{ touchAction: 'none' }}
          className={cn(
            'w-[min(92vw,420px)]',
            'rounded border-2 border-neutral-700 bg-neutral-950/95 backdrop-blur',
            'shadow-[0_12px_40px_rgba(0,0,0,0.65)]',
          )}
        >
          <div
            onPointerDown={event => {
              const target = event.target as HTMLElement;
              if (target.closest('button,select,option,input,textarea,a')) return;
              if (event.pointerType === 'mouse' && event.button !== 0) return;
              event.preventDefault();
              (event.currentTarget as HTMLDivElement).setPointerCapture(event.pointerId);
              menuDragRef.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                originX: dockPos.x,
                originY: dockPos.y,
              };
            }}
            onPointerMove={event => {
              const drag = menuDragRef.current;
              if (!drag || drag.pointerId !== event.pointerId) return;
              const dx = event.clientX - drag.startX;
              const dy = event.clientY - drag.startY;

              const nextX = clamp(drag.originX + dx, 8, window.innerWidth - 240);
              const nextY = clamp(drag.originY + dy, 8, window.innerHeight - 120);
              setDockPos({ x: nextX, y: nextY });
            }}
            onPointerUp={event => {
              const drag = menuDragRef.current;
              if (!drag || drag.pointerId !== event.pointerId) return;
              menuDragRef.current = null;
            }}
            style={{ touchAction: 'none' }}
            className={cn(
              'flex items-center justify-between gap-2',
              'cursor-move select-none',
              'border-b border-neutral-800 px-3 py-2',
            )}
          >
            <button
              type="button"
              onPointerDown={e => e.stopPropagation()}
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
                'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
              )}
            >
              Fechar
            </button>
            <div className="text-xs tracking-widest text-neutral-400 uppercase">Dev Menu</div>
          </div>

          <div className="flex flex-col gap-3 p-3">{children}</div>
        </div>
      ) : null}
    </div>
  );
}
