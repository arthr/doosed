import { ReactNode } from 'react';
interface PixelCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'active' | 'player';
}
export const PixelCard = ({ children, className = '', variant = 'default' }: PixelCardProps) => {
  const borderColors = {
    default: 'border-evil-purple',
    active: 'border-portal-blue shadow-neon-purple',
    player: 'border-rick-green shadow-neon-green',
  };
  return (
    <div
      className={`relative bg-ui-panel border-4 ${borderColors[variant]} shadow-pixel p-2 rounded-sm ${className}`}
    >
      {children}
    </div>
  );
};
