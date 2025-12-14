import type { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const lobbyButtonVariants = cva(
  'font-pixel inline-flex items-center justify-center gap-2 rounded-lg border-b-8 px-4 py-2 text-xs uppercase transition-all active:translate-y-2 active:border-b-0',
  {
    variants: {
      variant: {
        primary: 'border-green-700 bg-green-500 text-black hover:bg-green-400',
        secondary: 'border-sky-700 bg-sky-500 text-black hover:bg-sky-400',
        neutral: 'border-neutral-800 bg-neutral-700 text-white hover:bg-neutral-600',
      },
      state: {
        default: '',
        disabled: 'cursor-not-allowed opacity-50',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      state: 'default',
    },
  },
);

export type LobbyButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof lobbyButtonVariants>;

export function LobbyButton({ className, variant, state, disabled, ...props }: LobbyButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        lobbyButtonVariants({ variant, state: disabled ? 'disabled' : state }),
        className,
      )}
      {...props}
    />
  );
}
