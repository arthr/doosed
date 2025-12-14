import React, { useState } from 'react';
import { RoomHeader } from '@/components/lobby/RoomHeader';
import { PlayerGrid } from '@/components/lobby/PlayerGrid';
import { ChatInterface } from '@/components/lobby/ChatInterface';
import { ActionControls } from '@/components/lobby/ActionControls';
import type { Player } from '@/types/lobby';

const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'RICK_C_137',
    avatar: 'https://picsum.photos/seed/rick/200/200',
    isReady: true,
    isHost: true,
  },
  {
    id: '2',
    name: 'MORTY_C_137',
    avatar: 'https://picsum.photos/seed/morty/200/200',
    isReady: true,
    isHost: false,
  },
  {
    id: '3',
    name: 'BIRDPERSON',
    avatar: 'https://picsum.photos/seed/birdperson/200/200',
    isReady: true,
    isHost: false,
  },
  // The UI requires 6 slots, empty ones are represented as null in the main state
];

export const LobbyScreen = () => {
  const [players, setPlayers] = useState<(Player | null)[]>([...mockPlayers, null, null, null]);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [currentUserReady, setCurrentUserReady] = useState(false);

  const handleToggleReady = () => {
    // In a real app, this would send a socket event
    setCurrentUserReady(!currentUserReady);

    // Optimistic update for demo purposes (assuming Host is current user)
    const newPlayers = [...players];
    if (newPlayers[0]) {
      newPlayers[0] = { ...newPlayers[0], isReady: !newPlayers[0].isReady };
    }
    setPlayers(newPlayers);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-900 p-4 font-sans text-zinc-100 selection:bg-green-500 selection:text-black md:p-8">
      {/* Main Container */}
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl flex-col gap-4 md:gap-6">
        {/* Header Section */}
        <RoomHeader roomCode="X-7-Z" status="WAITING FOR SUBJECTS..." />

        {/* Main Content: Player Grid */}
        <main className="grow overflow-y-auto md:overflow-visible">
          <PlayerGrid players={players} />
        </main>

        {/* Footer: Chat & Actions */}
        <footer className="flex h-auto shrink-0 flex-col gap-4 md:h-64 md:flex-row">
          {/* Chat Component - Handles responsive visibility internally or via props */}
          <ChatInterface
            isOpen={isMobileChatOpen}
            onToggle={() => setIsMobileChatOpen(!isMobileChatOpen)}
          />

          {/* Action Buttons */}
          <ActionControls isReady={currentUserReady} onToggleReady={handleToggleReady} />
        </footer>
      </div>

      {/* CRT Overlay Effect (Optional CSS Polish) */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)50%,rgba(0,0,0,0.1)50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-size-[100%_2px,3px_100%] opacity-20"></div>
    </div>
  );
};
