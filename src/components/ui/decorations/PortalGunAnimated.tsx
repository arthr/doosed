import { cn } from '@/lib/cn';

interface PortalGunAnimatedProps {
  /** Tamanho do componente. Default: 'md' */
  size?: 'sm' | 'md' | 'lg';
  /** Rotacao em graus. Default: 12 */
  rotation?: number;
  /** Ativar animacao de glow. Default: true */
  glowEnabled?: boolean;
  /** Ativar animacao de bounce. Default: true */
  bounceEnabled?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}

const sizeClasses = {
  sm: 'size-32',
  md: 'size-40',
  lg: 'size-56',
};

const IMAGE_SRC = '/images/animation/portal_gun.png';
const HAS_IMAGE = true;

/**
 * Portal Gun Animado - Decoracao com animacao de bounce e glow verde
 *
 * Comportamentos:
 * - Bounce suave (quando habilitado)
 * - Glow verde pulsante
 * - Placeholder visual enquanto nao ha imagem
 *
 * TODO: Adicionar animacoes extras quando imagem estiver disponivel
 */
export function PortalGunAnimated({
  size = 'md',
  rotation = 12,
  glowEnabled = true,
  bounceEnabled = true,
  className,
}: PortalGunAnimatedProps) {
  if (!HAS_IMAGE) {
    // Placeholder enquanto nao temos a imagem
    return (
      <div
        className={cn(
          sizeClasses[size],
          'flex items-center justify-center',
          'border-2 border-dashed border-green-500/30 rounded-lg',
          'text-green-500/50 font-pixel text-center text-xs',
          bounceEnabled && 'animate-bounce',
          glowEnabled && 'animate-glow-green',
          className,
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        PORTAL GUN
        <br />
        ASSET
      </div>
    );
  }

  return (
    <div className={cn(bounceEnabled && 'animate-bounce')}>
      <img
        src={IMAGE_SRC}
        alt="Portal Gun"
        className={cn(
          sizeClasses[size],
          'object-contain select-none',
          glowEnabled && 'animate-glow-green',
          'png-outline',
          className,
        )}
        style={{ transform: `rotate(${rotation}deg)` }}
        draggable={false}
      />
    </div>
  );
}
