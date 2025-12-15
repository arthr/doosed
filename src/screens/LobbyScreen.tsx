import React, { useState } from 'react';
import { Crown, MessageSquare, ThumbsUp, Backpack, AlertTriangle, Plus } from 'lucide-react';

// --- Types ---
type PlayerStatus = 'READY' | 'NOT READY';

interface Player {
  id: string;
  name: string;
  avatar: string; // URL or placeholder
  status: PlayerStatus;
  isHost?: boolean;
}

// --- Mock Data ---
const MOCK_PLAYERS: (Player | null)[] = [
  { id: '1', name: 'RICK_C_137', avatar: '/rick.png', status: 'READY', isHost: true },
  { id: '2', name: 'MORTY_C_137', avatar: '/morty.png', status: 'READY' },
  { id: '3', name: 'BIRDPERSON', avatar: '/birdperson.png', status: 'READY' },
  { id: '4', name: 'SQUANCHY', avatar: '/squanchy.png', status: 'NOT READY' },
  null, // Empty slot
  null, // Empty slot
];

// --- Subcomponents ---

// 1. Header: Room Code & Status
const LobbyHeader = ({ roomCode, status }: { roomCode: string; status: string }) => (
  <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
    {/* Room Code Panel */}
    <div className="flex-1 bg-neutral-900/90 border-4 border-slate-600 rounded-xl p-3 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)]">
      <span className="text-green-500 font-pixel text-2xl md:text-3xl tracking-widest drop-shadow-[0_0_5px_rgba(34,197,94,0.8)]">
        ROOM CODE: <span className="text-white text-3xl md:text-4xl">[{roomCode}]</span>
      </span>
    </div>

    {/* Status Panel */}
    <div className="flex-[2] bg-neutral-900/90 border-4 border-slate-600 rounded-xl p-3 flex items-center justify-center md:justify-start md:pl-6 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-3 text-yellow-500 font-pixel text-xl md:text-2xl animate-pulse">
        <AlertTriangle size={24} className="fill-yellow-500 text-black" />
        <span className="uppercase tracking-wide text-yellow-100">STATUS: {status}</span>
      </div>
    </div>
  </div>
);

// 2. Player Card (Responsive: Grid on Desktop, Row on Mobile)
const PlayerCard = ({ player, index }: { player: Player | null, index: number }) => {
  // Empty Slot Styling (Static Noise Effect)
  if (!player) {
    return (
      <div className="group relative flex md:flex-col items-center justify-center h-24 md:h-full bg-slate-800/50 border-4 border-slate-700 border-dashed rounded-xl overflow-hidden hover:bg-slate-800/80 transition-all">
        {/* CSS Noise Background */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className="z-10 flex md:flex-col items-center gap-4 md:gap-2">
          <span className="font-pixel text-slate-400 text-xl md:text-2xl tracking-widest uppercase animate-pulse">
            SEARCHING...
          </span>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-pixel font-bold px-4 py-1 rounded shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all">
            <Plus size={16} strokeWidth={4} /> INVITE
          </button>
        </div>
      </div>
    );
  }

  // Active Player Card
  const isReady = player.status === 'READY';

  return (
    <div className={`
      relative flex flex-row md:flex-col items-center p-2 md:p-4 gap-4 md:gap-2
      bg-neutral-900/80 border-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02]
      ${isReady ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-slate-600'}
    `}>
      {/* Crown for Host */}
      {player.isHost && (
        <div className="absolute top-2 left-2 text-yellow-400 drop-shadow-md z-10">
          <Crown size={24} fill="currentColor" />
        </div>
      )}

      {/* Chat Icon Indicator */}
      <div className="absolute top-2 right-2 text-slate-400 md:block hidden">
        <MessageSquare size={20} />
      </div>

      {/* Avatar Frame */}
      <div className="relative shrink-0 w-16 h-16 md:w-32 md:h-32 bg-slate-800 rounded-lg border-2 border-slate-500 overflow-hidden">
        {/* Image Placeholder - Replace src with real data */}
        <img
          src={player.avatar}
          alt={player.name}
          className="w-full h-full object-cover"
          // Fallback for demo if image fails
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
            e.currentTarget.parentElement!.innerHTML = '<span class="font-pixel text-4xl text-slate-600">?</span>';
          }}
        />
        {/* Background glow for avatar */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent pointer-events-none" />
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col md:items-center w-full">
        <div className="bg-slate-900/80 px-2 py-1 rounded w-full md:text-center mb-1">
          <span className="font-pixel text-white text-lg md:text-2xl tracking-wider uppercase truncate block">
            {player.name}
          </span>
        </div>

        <div className="flex items-center gap-2 md:justify-center">
          <div className={`w-3 h-3 rounded-full ${isReady ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-slate-500'}`} />
          <span className={`font-pixel text-sm md:text-lg ${isReady ? 'text-green-400' : 'text-slate-500'}`}>
            {player.status}
          </span>
        </div>
      </div>
    </div>
  );
};

// 3. Footer: Chat & Controls
const LobbyFooter = () => (
  <div className="flex flex-col md:flex-row gap-4 h-auto md:h-48 mt-auto w-full">

    {/* CHAT PANEL (Desktop: Visible | Mobile: Button) */}
    <div className="flex-1 hidden md:flex flex-col bg-slate-900/90 border-4 border-slate-600 rounded-xl p-4 overflow-hidden shadow-lg relative">
      <div className="absolute top-0 left-0 bg-slate-600 px-2 py-0.5 rounded-br-lg text-xs font-pixel text-white">CHAT_LOG_v1.0</div>

      <div className="flex-1 overflow-y-auto font-pixel text-sm space-y-2 p-2 mt-4 text-slate-300">
        <p><span className="text-green-400">Rick:</span> Hurry up, Morty, I got places to be!</p>
        <p><span className="text-yellow-400">Morty:</span> Aw jeez, are we starting soon?</p>
        <p><span className="text-purple-400">Birdperson:</span> Patience, Morty.</p>
        <p><span className="text-orange-400">Squanchy:</span> I'm squanching here!</p>
      </div>

      {/* Chat Input Placeholder */}
      <div className="mt-2 flex gap-2 border-t-2 border-slate-700 pt-2">
        <span className="text-green-500 animate-pulse">{'>'}</span>
        <input type="text" placeholder="Type message..." className="bg-transparent border-none outline-none font-pixel text-white w-full placeholder-slate-600" />
      </div>
    </div>

    {/* Mobile Chat Toggle Button */}
    <button className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-slate-800 border-4 border-slate-600 rounded-xl text-slate-300 font-pixel text-xl active:bg-slate-700">
      <div className="flex items-center gap-2">
        <MessageSquare size={20} /> CHAT LOG
      </div>
      <span>{'>'}</span>
    </button>

    {/* ACTION BUTTONS */}
    <div className="flex md:flex-col lg:flex-row gap-3 md:w-auto shrink-0 h-20 md:h-auto">
      {/* Ready Button */}
      <button className="flex-1 md:flex-none flex flex-row md:flex-col items-center justify-center gap-2 md:w-40 bg-gradient-to-b from-green-500 to-green-700 border-4 border-green-900 rounded-xl shadow-[0_4px_0_#14532d] active:shadow-none active:translate-y-1 transition-all group">
        <ThumbsUp className="w-6 h-6 md:w-10 md:h-10 text-green-950 group-hover:scale-110 transition-transform" strokeWidth={3} />
        <span className="font-pixel text-xl md:text-2xl text-green-950 font-bold leading-none">READY UP</span>
      </button>

      {/* Loadout Button */}
      <button className="flex-1 md:flex-none flex flex-row md:flex-col items-center justify-center gap-2 md:w-40 bg-gradient-to-b from-cyan-500 to-cyan-700 border-4 border-cyan-900 rounded-xl shadow-[0_4px_0_#0e7490] active:shadow-none active:translate-y-1 transition-all group">
        <Backpack className="w-6 h-6 md:w-10 md:h-10 text-cyan-950 group-hover:rotate-12 transition-transform" strokeWidth={3} />
        <span className="font-pixel text-lg md:text-xl text-cyan-950 font-bold leading-none text-center">CUSTOMIZE<br className="hidden md:block" /> LOADOUT</span>
      </button>
    </div>

  </div>
);

// --- Main Screen ---

export const LobbyScreen = () => {
  return (
    // Outer Container (Simulating the screen boundaries)
    <div className="min-h-screen w-full p-2 md:p-6 lg:p-8 flex items-center justify-center font-pixel">

      {/* Background Effect (Optional: Add your animated SVG behind this div) */}

      {/* Inner Content Container */}
      <div className="w-full max-w-6xl h-[90vh] flex flex-col gap-4 relative z-10">

        {/* HEADER */}
        <LobbyHeader roomCode="X-7-Z" status="WAITING FOR SUBJECTS..." />

        {/* MAIN GRID/LIST AREA */}
        {/* We use specific overflow handling to match the 'Screen' feel */}
        <main className="flex-1 bg-neutral-900/50 rounded-xl border-4 border-transparent md:border-slate-800/50 overflow-y-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-slate-900 p-1 md:p-4">

          {/* Grid for Desktop / Stack for Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pb-20 md:pb-0">
            {MOCK_PLAYERS.map((player, idx) => (
              <PlayerCard key={player ? player.id : `empty-${idx}`} player={player} index={idx} />
            ))}
          </div>

        </main>

        {/* FOOTER */}
        <LobbyFooter />

      </div>
    </div>
  );
};

export default LobbyScreen;