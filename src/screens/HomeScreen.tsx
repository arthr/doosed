import React from 'react';
import { Hand, Users, Settings, Skull, Zap, CircleDollarSign } from 'lucide-react';

// --- Subcomponents ---

// 1. The Main Menu Buttons (Dynamic Colors & Glows)
interface GameButtonProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: 'green' | 'purple' | 'blue' | 'red';
  onClick?: () => void;
}

const GameButton = ({ title, subtitle, icon, color, onClick }: GameButtonProps) => {
  // Color maps for specific Rick & Morty styling
  const styles = {
    green: "border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)] text-green-400 hover:bg-green-900/40",
    purple: "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] text-purple-400 hover:bg-purple-900/40",
    blue: "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.6)] text-cyan-400 hover:bg-cyan-900/40",
    red: "border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] text-red-500 hover:bg-red-900/40",
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full group relative flex items-center justify-between px-6 py-4 mb-4 
        border-4 rounded-xl bg-neutral-900/80 backdrop-blur-sm transition-all duration-200 
        hover:scale-[1.02] active:scale-95 ${styles[color]}
      `}
    >
      {/* Icon Area */}
      <div className="flex items-center justify-center w-12 h-12 mr-4 text-3xl">
        {icon}
      </div>

      {/* Text Area */}
      <div className="flex flex-col items-center flex-1 lg:items-start">
        <span className="text-3xl font-bold tracking-widest font-pixel uppercase drop-shadow-md">
          {title}
        </span>
        <span className="text-lg opacity-80 font-pixel tracking-wide">
          {subtitle}
        </span>
      </div>

      {/* Dripping Sludge Effect (CSS Decoration) */}
      <div className={`absolute -bottom-2 right-4 w-2 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${color === 'green' ? 'bg-green-500' : 'bg-transparent'}`} />
    </button>
  );
};

// 2. Info Cards (Daily Challenge / Player Stats)
const InfoCard = ({ title, value, icon, imageSrc, align = 'left' }: any) => (
  <div className="relative flex items-center p-1 bg-neutral-900/90 border-2 border-slate-600 rounded-lg shadow-lg w-full lg:w-64 h-24">
    {/* Portrait Image Placeholder */}
    <div className={`w-20 h-20 shrink-0 bg-slate-800 rounded border-2 border-slate-500 overflow-hidden flex items-center justify-center ${align === 'right' ? 'order-2 ml-3' : 'mr-3'}`}>
      {imageSrc ? (
        <img src={imageSrc} alt="Character" className="w-full h-full object-cover" />
      ) : (
        <div className="text-xs text-center text-slate-500 font-pixel">IMG</div>
      )}
    </div>

    {/* Text Content */}
    <div className={`flex flex-col flex-1 ${align === 'right' ? 'items-end text-right' : 'items-start text-left'}`}>
      <span className="text-slate-300 font-pixel text-lg leading-tight mb-1">{title}</span>
      <div className="flex items-center gap-1 text-yellow-400 font-bold font-pixel text-xl">
        {icon}
        <span>{value}</span>
      </div>
    </div>

    {/* Corner Screw Decoration */}
    <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-slate-500 rounded-full" />
    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-slate-500 rounded-full" />
    <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-slate-500 rounded-full" />
    <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-slate-500 rounded-full" />
  </div>
);

// 3. Floating Decorations (Portal Gun / Head)
const FloatingDecoration = ({ type }: { type: 'gun' | 'head' | 'pills' }) => {
  // These are placeholders for your specific assets from the image
  // You should replace the contents of these divs with <img src="..." />
  if (type === 'gun') {
    return (
      <div className="hidden lg:block absolute left-[-180px] top-10 animate-bounce duration-[3000ms]">
        <div className="w-40 h-40 bg-contain bg-no-repeat bg-center rotate-12 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
          style={{ backgroundImage: 'url(/path-to-portal-gun.png)' }}>
          {/* Fallback visual if no image */}
          <div className="w-full h-full border-2 border-dashed border-green-500/30 rounded-full flex items-center justify-center text-green-500/50 font-pixel text-center">
            PORTAL GUN<br />ASSET
          </div>
        </div>
      </div>
    );
  }
  if (type === 'head') {
    return (
      <div className="hidden lg:block absolute right-[-160px] top-0 animate-pulse">
        <div className="w-40 h-48 bg-contain bg-no-repeat bg-center -rotate-12 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          style={{ backgroundImage: 'url(/path-to-cromulon.png)' }}>
          {/* Fallback visual */}
          <div className="w-full h-full border-2 border-dashed border-purple-500/30 rounded-full flex items-center justify-center text-purple-500/50 font-pixel text-center">
            CROMULON<br />ASSET
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// --- Main Page Component ---

const HomeScreen = () => {
  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden flex flex-col items-center font-pixel selection:bg-green-500 selection:text-black">

      {/* BACKGROUND: Swirling Void Effect */}
      {/* Replace this div with your animated SVG or Canvas background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0a0a0a] to-black" />
        {/* Star field simulation */}
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-2xl px-4 py-6 flex flex-col min-h-screen lg:justify-center">

        {/* HEADER: Logo Area */}
        <div className="text-center mb-8 relative">
          <h1 className="text-7xl lg:text-9xl font-bold text-green-500 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] stroke-black"
            style={{ WebkitTextStroke: '2px black', textShadow: '0 0 20px rgba(34,197,94,0.8)' }}>
            DOSED
          </h1>
          {/* Dripping effect SVG could go here */}
          <h2 className="text-3xl lg:text-4xl text-white font-bold tracking-[0.2em] -mt-2 lg:-mt-4 relative inline-block">
            <span className="text-red-500 absolute -left-1 -top-0.5 opacity-50 blur-[1px]">PILL ROULETTE</span>
            <span className="relative z-10 drop-shadow-md">PILL ROULETTE</span>
          </h2>
        </div>

        {/* CENTER AREA: Buttons & Floating Assets */}
        <div className="relative w-full">
          {/* Decorations (Desktop Only) */}
          <FloatingDecoration type="gun" />
          <FloatingDecoration type="head" />

          {/* Menu Buttons Stack */}
          <div className="space-y-4">
            <GameButton
              title="ENTER THE VOID"
              subtitle="Play"
              icon={<Hand size={32} />}
              color="green"
            />
            <GameButton
              title="MULTIPLAYER"
              subtitle="Lobby"
              icon={<Users size={32} />}
              color="purple"
            />
            <GameButton
              title="THE LAB"
              subtitle="Settings"
              icon={<Settings size={32} />}
              color="blue"
            />
            <GameButton
              title="EXIT DIMENSION"
              subtitle="Quit"
              icon={<Skull size={32} />}
              color="red"
            />
          </div>
        </div>

        {/* FOOTER AREA: Stats & Challenge */}
        <div className="mt-8 flex flex-col lg:flex-row gap-4 justify-between w-full">
          {/* Daily Challenge (Morty) */}
          <InfoCard
            title="Daily Challenge"
            value="500 SCHMECKLES"
            icon={<CircleDollarSign size={20} />}
          // align="left"
          />

          {/* Player Info (Pickle Rick) */}
          <InfoCard
            title="Pickle Rick"
            value="LEVEL: 137"
            icon={<Zap size={20} />}
            align="right"
          />
        </div>

        {/* Spacer for bottom bar */}
        <div className="h-16" />

      </div>

      {/* BOTTOM WARNING BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-red-900/90 border-t-4 border-red-600 p-2 z-50 shadow-[0_-5px_20px_rgba(220,38,38,0.5)]">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 text-red-100 font-pixel text-sm lg:text-base uppercase tracking-wider overflow-hidden whitespace-nowrap">
          <span className="animate-pulse">⚠ WARNING: DO NOT CONSUME GLOWING ROCKS. SIDE EFFECTS INCLUDE MELTING. ⚠</span>
        </div>
      </div>

    </div>
  );
};

export default HomeScreen;