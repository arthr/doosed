import type { ReactNode } from 'react';
import { GlowButton, type GlowButtonColor } from '@/components/ui/glow-button';

export interface HomeMenuButtonProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  color: GlowButtonColor;
  onClick?: () => void;
}

/**
 * Wrapper do GlowButton para uso na HomeScreen.
 * Mantido para compatibilidade e semântica específica do menu inicial.
 */
export function HomeMenuButton({ title, subtitle, icon, color, onClick }: HomeMenuButtonProps) {
  return (
    <GlowButton
      title={title}
      subtitle={subtitle}
      icon={icon}
      color={color}
      onClick={onClick}
      size="md"
      className="mb-4"
    />
  );
}
