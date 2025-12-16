import { ClockAlert, LogOut, MessageSquare, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/cn';
import { GlowButton } from './GlowButton';

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
  leave?: ActionDockButtonConfig;
  className?: string;
  layout?: 'row' | 'stack';
}

function formatTwoDigits(value?: number) {
  if (typeof value !== 'number') return '--';
  return value < 10 ? `0${value}` : String(value);
}

type LoadoutLabelResult = {
  title: string;
  subtitle?: string;
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
}): LoadoutLabelResult {
  if (pressed) {
    if (hasTimeLeft) return { title: `(${formatTwoDigits(timeLeft)}) CANCEL LOADOUT` };
    return startIn > 0
      ? { title: 'STARTING IN', subtitle: `${formatTwoDigits(startIn)} SECONDS...` }
      : { title: 'GAME STARTED!' };
  }

  return hasTimeLeft
    ? { title: `(${formatTwoDigits(timeLeft)}) CONFIRM LOADOUT` }
    : { title: "TIME'S UP!" };
}

export function ActionDock({
  chat,
  shop,
  loadout,
  leave,
  className = '',
  layout = 'row',
}: ActionDockProps) {
  const isStack = layout === 'stack';
  const stackRows = (() => {
    if (!isStack) return '';
    const count =
      Number(!!loadout?.onPress) +
      Number(!!shop?.onClick) +
      Number(!!chat?.onClick) +
      Number(!!leave?.onClick);
    if (count <= 1) return 'grid-rows-1';
    if (count === 2) return 'grid-rows-2';
    return 'grid-rows-3';
  })();

  // se não houver nenhuma ação, não renderizar o ActionDock
  if (!chat?.onClick && !shop?.onClick && !loadout?.onPress && !leave?.onClick) return null;

  return (
    <div
      className={cn(
        isStack ? cn('grid h-full items-stretch px-2 md:px-0 gap-2 md:gap-4', stackRows) : 'flex gap-2',
        className,
      )}
    >
            {shop?.onClick ? (
        <GlowButton
          title="SHOP"
          icon={<ShoppingCart />}
          color="purple"
          size="xs"
          disabled={!!shop.disabled}
          onClick={shop.onClick}
          fullWidth
          textAlign="center"
        />
      ) : null}

      {chat?.onClick ? (
        <GlowButton
          title="CHAT"
          icon={<MessageSquare />}
          color="purple"
          size="xs"
          disabled={!!chat.disabled}
          onClick={chat.onClick}
          fullWidth
          textAlign="center"
        />
      ) : null}

      {loadout?.onPress
        ? (() => {
            const pressed = !!loadout.pressed;
            const timeLeft = loadout.timeLeft;
            const startIn = loadout.startIn ?? 0;
            const hasTimeLeft = typeof timeLeft === 'number' && timeLeft > 0;

            const label = getLoadoutLabel({ pressed, hasTimeLeft, timeLeft, startIn });
            const icon = hasTimeLeft || <ClockAlert />

            return (
              <GlowButton
                title={label.title}
                icon={icon}
                subtitle={label.subtitle}
                color={pressed ? 'red' : 'green'}
                size="xs"
                pressed={pressed}
                disabled={!!loadout.disabled}
                onClick={loadout.onPress}
                fullWidth
                textAlign="center"
              />
            );
          })()
        : null}

      {leave?.onClick ? (
        <GlowButton
          title="LEAVE MATCH"
          icon={<LogOut />}
          color="red"
          size="xs"
          disabled={!!leave.disabled}
          onClick={leave.onClick}
          fullWidth
          textAlign="center"
        />
      ) : null}
    </div>
  );
}
