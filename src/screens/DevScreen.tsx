import { useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { Phase } from '@/core/state-machines/phase';
import { useFlowStore } from '@/stores/flowStore';
import { useNotification, type NotificationVariant } from '@/stores/notificationStore';
import { LobbyScreen } from '@/screens/LobbyScreen';
import { DraftScreen } from '@/screens/DraftScreen';
import { MatchScreen } from '@/screens/MatchScreen';
import ResultScreen from '@/screens/ResultScreen';

type ScreenComponent = () => JSX.Element;

type DetectedScreen = {
  key: string;
  label: string;
  Component: ScreenComponent;
};

function getScreenLabelFromPath(path: string) {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.tsx$/i, '').replace(/Screen$/i, ' Screen');
}

function pickScreenComponent(moduleExports: Record<string, unknown>): ScreenComponent | null {
  const maybeDefault = moduleExports.default;
  if (typeof maybeDefault === 'function') return maybeDefault as ScreenComponent;

  // Prefer exports that end with "Screen"
  const screenExportKey = Object.keys(moduleExports).find(
    key => key !== 'DevScreen' && /Screen$/.test(key) && typeof moduleExports[key] === 'function',
  );
  if (screenExportKey) return moduleExports[screenExportKey] as ScreenComponent;

  // Fallback: first function export
  const anyFnKey = Object.keys(moduleExports).find(key => typeof moduleExports[key] === 'function');
  if (anyFnKey) return moduleExports[anyFnKey] as ScreenComponent;

  return null;
}

type Vec2 = { x: number; y: number };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getNextPhase(phase: Phase): Phase {
  if (phase === 'LOBBY') return 'DRAFT';
  if (phase === 'DRAFT') return 'MATCH';
  if (phase === 'MATCH') return 'RESULTS';
  return 'LOBBY';
}

const NOTIFICATION_VARIANTS: NotificationVariant[] = ['important', 'warning', 'success', 'info', 'debug'];

const NOTIFICATION_SAMPLES: Record<NotificationVariant, string> = {
  important: 'SISTEMA OFFLINE! Reconectando...',
  warning: 'Conexao instavel detectada',
  success: 'Partida salva com sucesso!',
  info: 'Nova atualizacao disponivel',
  debug: '[DEBUG] State sync completed',
};

export function DevScreen() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [dockPos, setDockPos] = useState<Vec2>({ x: 24, y: 24 });

  // Flow Store
  const phase = useFlowStore(state => state.phase);
  const setPhaseGuarded = useFlowStore(state => state.setPhaseGuarded);
  const resetRun = useFlowStore(state => state.resetRun);

  // Notification Store
  const { show: showNotification, dismiss: dismissNotification, clear: clearNotifications } = useNotification();
  const [notifVariant, setNotifVariant] = useState<NotificationVariant>('info');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifDuration, setNotifDuration] = useState(5000);

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

  const screens = useMemo<DetectedScreen[]>(() => {
    const modules = import.meta.glob('./*.tsx', { eager: true }) as Record<
      string,
      Record<string, unknown>
    >;

    return Object.entries(modules)
      .filter(([path]) => !path.endsWith('/DevScreen.tsx'))
      .map(([path, mod]) => {
        const Component = pickScreenComponent(mod);
        if (!Component) return null;

        const label = getScreenLabelFromPath(path);
        const key = path;
        return { key, label, Component };
      })
      .filter((x): x is DetectedScreen => Boolean(x))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const selected =
    selectedKey && selectedKey !== '__phase__' ? (screens.find(s => s.key === selectedKey) ?? null) : null;

  const PhaseRouterPreview = useMemo(() => {
    switch (phase) {
      case 'LOBBY':
        return <LobbyScreen />;
      case 'DRAFT':
        return <DraftScreen />;
      case 'MATCH':
        return <MatchScreen />;
      case 'RESULTS':
        return <ResultScreen />;
      default: {
        const _exhaustive: never = phase;
        return _exhaustive;
      }
    }
  }, [phase]);

  return (
    <>
      {selectedKey === '__phase__' ? (
        <div className="fixed inset-0 z-40 overflow-auto bg-void-black text-text-primary">
          {PhaseRouterPreview}
        </div>
      ) : selected ? (
        <div className="fixed inset-0 z-40 overflow-auto bg-void-black text-text-primary">
          <selected.Component />
        </div>
      ) : null}

      {/* Draggable dock (FAB + popup compartilham a mesma posição) */}
      <div style={{ position: 'fixed', left: dockPos.x, top: dockPos.y }} className="z-60">
        {/* FAB draggable */}
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

        {/* Popup draggable */}
        {isMenuOpen ? (
          <div
            style={{ touchAction: 'none' }}
            className={cn(
              'w-[min(92vw,420px)]',
              'rounded-lg border-2 border-neutral-700 bg-neutral-950/95 backdrop-blur',
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

            <div className="flex flex-col gap-3 p-3">
              <label className="flex flex-col gap-2">
                <span className="text-xs tracking-wider text-neutral-400 uppercase">Tela</span>
                <select
                  value={selectedKey ?? ''}
                  onChange={e => setSelectedKey(e.target.value ? e.target.value : null)}
                  onPointerDown={e => e.stopPropagation()}
                  className={cn(
                    'w-full',
                    'rounded border-2 border-neutral-700 bg-black',
                    'px-3 py-2 text-sm text-white',
                    'focus:ring-2 focus:ring-neutral-600 focus:outline-none',
                  )}
                >
                  <option value="">(sem preview)</option>
                  <option value="__phase__">(seguir phase)</option>
                  {screens.map(screen => (
                    <option key={screen.key} value={screen.key}>
                      {screen.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded border border-neutral-800 bg-black/50 p-3">
                <div className="mb-2 text-xs tracking-widest text-neutral-400 uppercase">Phase</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs text-white">
                    Atual: <span className="font-normal">{phase}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onPointerDown={e => e.stopPropagation()}
                      onClick={() => setPhaseGuarded('LOBBY')}
                      className={cn(
                        'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
                        'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
                      )}
                    >
                      Lobby
                    </button>
                    <button
                      type="button"
                      onPointerDown={e => e.stopPropagation()}
                      onClick={() => {
                        if (phase === 'RESULTS') resetRun();
                        else setPhaseGuarded(getNextPhase(phase));
                      }}
                      className={cn(
                        'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
                        'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
                      )}
                    >
                      Next
                    </button>
                    <button
                      type="button"
                      onPointerDown={e => e.stopPropagation()}
                      onClick={resetRun}
                      className={cn(
                        'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
                        'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
                      )}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded border border-neutral-800 bg-black/50 p-3">
                <div className="mb-2 text-xs tracking-widest text-neutral-400 uppercase">Notification</div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <select
                      value={notifVariant}
                      onChange={e => {
                        const v = e.target.value as NotificationVariant;
                        setNotifVariant(v);
                        setNotifMessage(NOTIFICATION_SAMPLES[v]);
                      }}
                      onPointerDown={e => e.stopPropagation()}
                      className={cn(
                        'flex-1 rounded border border-neutral-700 bg-black',
                        'px-2 py-1 text-xs text-white',
                      )}
                    >
                      {NOTIFICATION_VARIANTS.map(v => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={notifDuration}
                      onChange={e => setNotifDuration(Number(e.target.value))}
                      onPointerDown={e => e.stopPropagation()}
                      placeholder="ms"
                      className={cn(
                        'w-20 rounded border border-neutral-700 bg-black',
                        'px-2 py-1 text-xs text-white',
                      )}
                    />
                  </div>
                  <input
                    type="text"
                    value={notifMessage}
                    onChange={e => setNotifMessage(e.target.value)}
                    onPointerDown={e => e.stopPropagation()}
                    placeholder="Mensagem..."
                    className={cn(
                      'w-full rounded border border-neutral-700 bg-black',
                      'px-2 py-1 text-xs text-white',
                    )}
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onPointerDown={e => e.stopPropagation()}
                      onClick={() => {
                        const msg = notifMessage || NOTIFICATION_SAMPLES[notifVariant];
                        showNotification({ message: msg, variant: notifVariant, durationTime: notifDuration });
                      }}
                      className={cn(
                        'flex-1 rounded border border-neon-green/50 bg-neon-green-dark px-2 py-1',
                        'text-xs text-white hover:bg-neon-green/20',
                      )}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onPointerDown={e => e.stopPropagation()}
                      onClick={() => dismissNotification()}
                      className={cn(
                        'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
                        'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
                      )}
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      onPointerDown={e => e.stopPropagation()}
                      onClick={() => clearNotifications()}
                      className={cn(
                        'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
                        'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
                      )}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onPointerDown={e => e.stopPropagation()}
                onClick={() => {
                  setSelectedKey(null);
                  setIsMenuOpen(false);
                }}
                className={cn(
                  'font-pixel',
                  'rounded border-2 border-neutral-700 bg-neutral-900',
                  'px-3 py-2 text-xs tracking-wider text-white uppercase',
                  'hover:border-neutral-300 hover:bg-neutral-800',
                )}
              >
                Fechar preview
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
