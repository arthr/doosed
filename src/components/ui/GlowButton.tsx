import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type GlowButtonColor = 'green' | 'purple' | 'blue' | 'red' | 'yellow' | 'neutral';
export type GlowButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface GlowButtonProps {
  /** Texto principal do botão */
  title: string;
  /** Texto secundário (opcional) */
  subtitle?: string;
  /** Ícone (opcional) */
  icon?: ReactNode;
  /** Posição do ícone */
  iconPosition?: 'left' | 'right';
  /** Cor do glow/borda */
  color?: GlowButtonColor;
  /** Tamanho geral (padding, texto, ícone) */
  size?: GlowButtonSize;
  /** Estado desabilitado */
  disabled?: boolean;
  /** Estado toggle pressionado (para botões toggle) */
  pressed?: boolean;
  /** Se ocupa 100% da largura */
  fullWidth?: boolean;
  /** Classes adicionais */
  className?: string;
  /** Handler de clique */
  onClick?: () => void;
}

const colorStyles: Record<GlowButtonColor, string> = {
  green: 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] text-green-400 hover:bg-green-900/40',
  purple: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] text-purple-400 hover:bg-purple-900/40',
  blue: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] text-cyan-400 hover:bg-cyan-900/40',
  red: 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] text-red-500 hover:bg-red-900/40',
  yellow: 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)] text-yellow-400 hover:bg-yellow-900/40',
  neutral: 'border-neutral-500 shadow-[0_0_15px_rgba(115,115,115,0.4)] text-neutral-300 hover:bg-neutral-800/40',
};

const sizeStyles: Record<GlowButtonSize, { container: string; title: string; subtitle: string; iconArea: string }> = {
  xs: {
    container: 'px-3 py-2 border-2 rounded-lg',
    title: 'text-xs md:text-sm',
    subtitle: 'text-[10px]',
    iconArea: 'w-6 h-6 mr-2 text-base',
  },
  sm: {
    container: 'px-4 py-2 border-2 rounded-lg',
    title: 'text-base md:text-lg',
    subtitle: 'text-xs',
    iconArea: 'w-8 h-8 mr-3 text-lg',
  },
  md: {
    container: 'px-6 py-4 border-4 rounded-xl',
    title: 'text-xl md:text-2xl',
    subtitle: 'text-sm md:text-base',
    iconArea: 'w-12 h-12 mr-4 text-2xl',
  },
  lg: {
    container: 'px-8 py-5 border-4 rounded-xl',
    title: 'text-2xl md:text-3xl',
    subtitle: 'text-base md:text-lg',
    iconArea: 'w-14 h-14 mr-5 text-3xl',
  },
};

export function GlowButton({
  title,
  subtitle,
  icon,
  iconPosition = 'left',
  color = 'green',
  size = 'md',
  disabled = false,
  pressed,
  fullWidth = true,
  className,
  onClick,
}: GlowButtonProps) {
  const sizeConfig = sizeStyles[size];

  const iconElement = icon ? (
    <div
      className={cn(
        'flex items-center justify-center shrink-0',
        sizeConfig.iconArea,
        iconPosition === 'right' && 'mr-0 ml-4',
      )}
    >
      {icon}
    </div>
  ) : null;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      className={cn(
        'group relative flex items-center justify-between',
        'bg-neutral-900/80 backdrop-blur-sm transition-all duration-200',
        'hover:scale-[1.02] active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        fullWidth && 'w-full',
        sizeConfig.container,
        colorStyles[color],
        className,
      )}
    >
      {/* Icon Left */}
      {iconPosition === 'left' && iconElement}

      {/* Text Area */}
      <div className={cn('flex flex-col flex-1', iconPosition === 'right' ? 'items-end' : 'items-start')}>
        <span
          className={cn(
            'tracking-widest font-pixel font-extrabold uppercase drop-shadow-md',
            sizeConfig.title,
          )}
        >
          {title}
        </span>
        {subtitle && (
          <span className={cn('opacity-80 font-pixel tracking-wide', sizeConfig.subtitle)}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Icon Right */}
      {iconPosition === 'right' && iconElement}
    </button>
  );
}

