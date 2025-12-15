import React, { useState } from 'react';
import { RefreshCw, Home, AlertTriangle, Pill, Package, Hourglass, Trophy, Skull } from 'lucide-react';

// --- TYPES ---
type GameResult = 'VICTORY' | 'DEFEAT';

// --- SUBCOMPONENTS ---

// 1. Stat Row (Individual row in the left panel)
const StatRow = ({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
        <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded bg-black/40 ${color}`}>{icon}</div>
            <span className="text-slate-300 font-pixel text-lg uppercase tracking-wide">{label}:</span>
        </div>
        <span className={`font-pixel text-2xl font-normal ${color} drop-shadow-md`}>{value}</span>
    </div>
);

// 2. XP Progress Bar
const XpBar = ({ isVictory, value }: { isVictory: boolean; value: number }) => (
    <div className="w-full mt-2">
        <div className="flex justify-between text-xs font-pixel uppercase mb-1">
            <span className={isVictory ? "text-green-400" : "text-red-400"}>
                {isVictory ? "XP GAINED" : "XP LOST"}
            </span>
            <span className="text-white font-normal">{isVictory ? `+${value}` : `-${value}`}</span>
        </div>
        <div className="h-4 w-full bg-black border-2 border-slate-600 rounded-full overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[4px_4px]" />

            {/* Bar Fill */}
            <div
                className={`h-full transition-all duration-1000 ${isVictory ? "bg-linear-to-r from-yellow-400 to-yellow-600 w-[80%]" : "bg-red-900 w-[30%]"
                    }`}
            />
        </div>
    </div>
);

// 3. Loot Box Display
const LootDisplay = ({ isVictory }: { isVictory: boolean }) => (
    <div className="flex flex-col items-center justify-center mt-4 p-2 rounded-lg bg-black/20 w-full">
        {/* Placeholder for Chest Image */}
        <div className={`w-16 h-16 mb-2 flex items-center justify-center text-4xl animate-bounce`}>
            {isVictory ? '🎁' : '🪦'}
        </div>

        <div className="text-center">
            {isVictory ? (
                <>
                    <div className="text-cyan-400 font-pixel text-sm font-normal animate-pulse">COOL RICK SUNGLASSES</div>
                    <div className="text-yellow-500 font-pixel text-[10px] uppercase tracking-widest mt-1">New Cosmetic Unlocked!</div>
                </>
            ) : (
                <>
                    <div className="text-slate-500 font-pixel text-sm font-normal line-through">NO LOOT</div>
                    <div className="text-red-500 font-pixel text-[10px] uppercase tracking-widest mt-1">Better luck next timeline</div>
                </>
            )}
        </div>
    </div>
);

// --- MAIN COMPONENT ---

const ResultScreen = () => {
    // Toggle for development/preview purposes
    const [result, setResult] = useState<GameResult>('VICTORY');
    const isVictory = result === 'VICTORY';

    // THEME CONFIGURATION
    const theme = {
        victory: {
            bg: "bg-gradient-to-b from-slate-900 to-green-900/40",
            accent: "text-green-400",
            border: "border-green-600",
            glow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]",
            titleColor: "text-yellow-400", // Gold
            button: "bg-gradient-to-b from-green-500 to-green-700 border-green-900 text-white",
            spotlight: "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-200/20 via-transparent to-transparent"
        },
        defeat: {
            bg: "bg-gradient-to-b from-slate-950 to-red-950/40",
            accent: "text-red-500",
            border: "border-red-800",
            glow: "shadow-[0_0_20px_rgba(220,38,38,0.4)]",
            titleColor: "text-red-600", // Blood Red
            button: "bg-gradient-to-b from-red-600 to-red-800 border-red-950 text-white",
            spotlight: "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent"
        }
    };

    const currentTheme = isVictory ? theme.victory : theme.defeat;

    return (
        <div className={`min-h-screen w-full flex items-center justify-center p-4 font-pixel overflow-hidden relative ${currentTheme.bg}`}>

            {/* DEVELOPMENT TOGGLE (Remove in production) */}
            <button
                onClick={() => setResult(prev => prev === 'VICTORY' ? 'DEFEAT' : 'VICTORY')}
                className="fixed top-4 right-4 z-50 bg-slate-800 text-white px-4 py-2 rounded font-pixel border-2 border-slate-600"
            >
                SWITCH STATE
            </button>

            {/* BACKGROUND FX */}
            <div className={`absolute inset-0 z-0 pointer-events-none ${currentTheme.spotlight}`} />
            {/* Victory Confetti (CSS dots) */}
            {isVictory && (
                <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            )}

            {/* MAIN CARD CONTAINER */}
            <div className="relative z-10 w-full max-w-lg md:max-w-4xl flex flex-col items-center gap-6">

                {/* 1. TOP STATUS BADGE */}
                <div className={`
            px-8 py-2 rounded-full border-4 bg-slate-900/90 backdrop-blur-md
            ${currentTheme.border} ${currentTheme.glow}
        `}>
                    <h2 className={`text-xl md:text-2xl font-normal tracking-[0.2em] uppercase ${isVictory ? 'text-white' : 'text-red-500'}`}>
                        {isVictory ? 'VICTORY' : 'DEAD'}
                    </h2>
                </div>

                {/* 2. MAIN TITLE (SURVIVED / DIED) */}
                <div className="text-center relative">
                    <h1 className={`
                text-6xl md:text-8xl font-black uppercase tracking-widest
                drop-shadow-[4px_4px_0_rgba(0,0,0,1)]
                ${currentTheme.titleColor}
            `}
                        style={{ WebkitTextStroke: '2px black' }}
                    >
                        {isVictory ? 'SURVIVED' : 'DIED'}
                    </h1>
                </div>

                {/* 3. AVATAR AREA */}
                <div className="relative group">
                    {/* Laurel Wreath or Halo */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-full flex justify-center z-20">
                        {isVictory ? (
                            <Trophy size={48} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                        ) : (
                            <div className="w-24 h-6 border-4 border-yellow-400/50 rounded-[50%] shadow-[0_0_15px_yellow]" />
                        )}
                    </div>

                    {/* Avatar Image Placeholder */}
                    <div className={`
                w-40 h-40 md:w-48 md:h-48 rounded-full border-4 bg-slate-800 overflow-hidden relative
                ${currentTheme.border} shadow-[0_0_30px_rgba(0,0,0,0.5)]
            `}>
                        {/* Replace with actual Rick Image */}
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-6xl">
                            {isVictory ? '😎' : '😵'}
                        </div>
                    </div>

                    {/* Thumbs up decoration */}
                    {isVictory && (
                        <div className="absolute -bottom-2 -right-4 text-4xl rotate-12 filter drop-shadow-lg">👍</div>
                    )}
                </div>

                {/* 4. CONTENT GRID (Stats & Rewards) */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                    {/* LEFT PANEL: MATCH STATS */}
                    <div className={`
                bg-slate-900/80 border-4 rounded-xl p-4 flex flex-col shadow-lg
                ${currentTheme.border}
            `}>
                        <h3 className={`text-center text-xl font-normal uppercase mb-4 border-b-2 border-slate-700 pb-2 ${currentTheme.accent}`}>
                            Match Stats
                        </h3>

                        <div className="space-y-1 flex-1">
                            <StatRow
                                label={isVictory ? "Pills Survived" : "Pills Taken"}
                                value="12"
                                icon={<Pill size={16} />}
                                color={isVictory ? "text-cyan-400" : "text-blue-400"}
                            />
                            <StatRow
                                label={isVictory ? "Items Used" : "Items Wasted"}
                                value="5"
                                icon={<Package size={16} />}
                                color={isVictory ? "text-yellow-400" : "text-orange-400"}
                            />
                            <StatRow
                                label={isVictory ? "Turns Survived" : "Turns Lasted"}
                                value="8"
                                icon={<Hourglass size={16} />}
                                color={isVictory ? "text-purple-400" : "text-slate-400"}
                            />
                        </div>

                        {/* Skull icons at bottom of stats */}
                        <div className="flex justify-center gap-2 mt-4 opacity-50">
                            <Skull size={20} className={isVictory ? "text-slate-600" : "text-red-800"} />
                            <Skull size={20} className={isVictory ? "text-slate-600" : "text-red-800"} />
                            <Skull size={20} className={isVictory ? "text-slate-600" : "text-red-800"} />
                        </div>
                    </div>

                    {/* RIGHT PANEL: REWARDS */}
                    <div className={`
                bg-slate-900/80 border-4 rounded-xl p-4 flex flex-col shadow-lg relative overflow-hidden
                ${isVictory ? 'border-yellow-600' : 'border-slate-600'}
            `}>
                        {/* Header */}
                        <h3 className={`text-center text-xl font-normal uppercase mb-2 border-b-2 border-slate-700 pb-2 ${isVictory ? 'text-yellow-400' : 'text-slate-400'}`}>
                            Rewards
                        </h3>

                        <XpBar isVictory={isVictory} value={isVictory ? 1200 : 500} />

                        <div className="flex-1 flex flex-col justify-end">
                            <LootDisplay isVictory={isVictory} />
                        </div>
                    </div>

                </div>

                {/* 5. FOOTER: ACTION BUTTONS */}
                <div className="w-full flex flex-col items-center gap-4 mt-2">

                    <div className="flex gap-4 w-full md:w-auto">
                        {/* Primary Button (Play/Try Again) */}
                        <button className={`
                    flex-1 md:w-64 py-4 rounded-xl border-b-8 font-pixel text-xl font-normal uppercase tracking-wider
                    shadow-lg active:border-b-0 active:translate-y-2 transition-all
                    ${currentTheme.button}
                `}>
                            <div className="flex items-center justify-center gap-2">
                                <RefreshCw size={24} strokeWidth={3} />
                                {isVictory ? 'Play Again' : 'Try Again'}
                            </div>
                        </button>
                    </div>

                    {/* Secondary Link */}
                    <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors font-pixel text-sm uppercase">
                        <Home size={14} /> Return to Main Menu
                    </button>

                    {/* Report Link */}
                    <div className="flex items-center gap-1 text-red-900/50 hover:text-red-500 cursor-pointer transition-colors text-xs font-normal uppercase mt-4">
                        <AlertTriangle size={12} /> Report Player
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ResultScreen;