import type { MouseEvent } from 'react';
import { MessageSquare, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/cn';

type ActionDockButtonConfig = {
  disabled?: boolean;
  onClick?: () => void;
};

type ActionDockToggleConfig = {
  disabled?: boolean;
  pressed?: boolean;
  onPress?: () => void;
  timeLeft?: number;
  startIn?: number;
};

export interface ActionDockProps {
  chat?: ActionDockButtonConfig;
  shop?: ActionDockButtonConfig;
  loadout?: ActionDockToggleConfig;
  className?: string;
  layout?: 'row' | 'stack';
}

function formatTwoDigits(value?: number) {
  if (typeof value !== 'number') return '--';
  return value < 10 ? `0${value}` : String(value);
}

type LoadoutLabel =
  | string
  | {
      line1: string;
      line2?: string;
    };

function getLoadoutLabel({
  pressed,
  hasTimeLeft,
  timeLeft,
  startIn,
}: {
  pressed: boolean;
  hasTimeLeft: boolean;
  timeLeft?: number;
  startIn: number;
}): LoadoutLabel {
  if (pressed) {
    if (hasTimeLeft) return `(${formatTwoDigits(timeLeft)}) CANCEL LOADOUT`;
    return startIn > 0
      ? { line1: 'STARTING IN', line2: `${formatTwoDigits(startIn)} SECONDS...` }
      : 'GAME STARTED!';
  }

  return hasTimeLeft ? `(${formatTwoDigits(timeLeft)}) CONFIRM LOADOUT` : "TIME'S UP!";
}

export function ActionDock({
  chat,
  shop,
  loadout,
  className = '',
  layout = 'row',
}: ActionDockProps) {
  const isStack = layout === 'stack';

  return (
    <div
      className={cn(
        isStack ? 'grid h-full grid-rows-3 items-stretch gap-2 md:gap-4' : 'flex gap-2',
        className,
      )}
    >
      {loadout?.onPress
        ? (() => {
            const pressed = !!loadout.pressed;
            const timeLeft = loadout.timeLeft;
            const startIn = loadout.startIn ?? 0;
            const hasTimeLeft = typeof timeLeft === 'number' && timeLeft > 0;

            const label = getLoadoutLabel({ pressed, hasTimeLeft, timeLeft, startIn });

            return (
              <button
                type="button"
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  event.preventDefault();
                  loadout.onPress?.();
                }}
                disabled={!!loadout.disabled}
                aria-pressed={!!loadout.pressed}
                className={cn(
                  'font-pixel flex items-center justify-center gap-2 border-b-4 border-neutral-900 bg-neutral-700 py-2 text-xs font-light! text-white',
                  hasTimeLeft && 'hover:bg-green-600 active:translate-y-0.5 active:border-b-2',
                  loadout.disabled && 'cursor-not-allowed opacity-50',
                  pressed &&
                    hasTimeLeft &&
                    'border-red-900! bg-red-700! hover:border-red-900! hover:bg-red-600!',
                )}
              >
                {typeof label === 'string' ? (
                  <span className="font-normal text-white">{label}</span>
                ) : (
                  <span className="flex flex-col text-center leading-tight font-normal text-white">
                    <span>{label.line1}</span>
                    {label.line2 ? <span>{label.line2}</span> : null}
                  </span>
                )}
              </button>
            );
          })()
        : null}
      {shop?.onClick ? (
        <button
          type="button"
          onClick={shop.onClick}
          disabled={!!shop.disabled}
          className={cn(
            'font-pixel flex items-center justify-center gap-2 border-b-4 border-green-900 bg-green-700 text-xs text-white hover:bg-green-600 active:translate-y-0.5 active:border-b-2',
            shop.disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <ShoppingCart size={16} />
          <span>SHOP</span>
        </button>
      ) : null}

      {chat?.onClick ? (
        <button
          type="button"
          onClick={chat.onClick}
          aria-label="Abrir chat"
          disabled={!!chat.disabled}
          className={cn(
            'font-pixel flex items-center justify-center gap-2 border-b-4 border-purple-900 bg-purple-700 text-xs text-white hover:bg-purple-600 active:translate-y-0.5 active:border-b-2',
            chat.disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <MessageSquare size={16} />
          <span>CHAT</span>
        </button>
      ) : null}
    </div>
  );
}
