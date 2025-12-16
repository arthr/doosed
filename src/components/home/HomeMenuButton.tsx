import type { ReactNode } from 'react';

export interface HomeMenuButtonProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  color: 'green' | 'purple' | 'blue' | 'red';
  onClick?: () => void;
}

export function HomeMenuButton({ title, subtitle, icon, color, onClick }: HomeMenuButtonProps) {
  const styles = {
    green: 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] text-green-400 hover:bg-green-900/40',
    purple: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] text-purple-400 hover:bg-purple-900/40',
    blue: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] text-cyan-400 hover:bg-cyan-900/40',
    red: 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] text-red-500 hover:bg-red-900/40',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        `
        w-full group relative flex items-center justify-between px-6 py-4 mb-4
        border-4 rounded-xl bg-neutral-900/80 backdrop-blur-sm transition-all duration-200
        hover:scale-[1.02] active:scale-95 ${styles[color]}
      `
      }
    >
      {/* Icon Area */}
      <div className="flex items-center justify-center w-12 h-12 mr-4 text-2xl">{icon}</div>

      {/* Text Area */}
      <div className="flex flex-col flex-1 items-start">
        <span className="text-xl md:text-2xl tracking-widest font-pixel font-extrabold uppercase drop-shadow-md">{title}</span>
        <span className="text-sm md:text-md opacity-80 font-pixel tracking-wide">{subtitle}</span>
      </div>

      {/* Button: Dripping Sludge Effect (CSS Decoration) | TODO: Precisa de polimento */}
      {/* <div className={`absolute -bottom-2 right-4 w-2 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${color === 'green' ? 'bg-green-500' : 'bg-transparent'}`} /> */}
    </button>
  );
}
