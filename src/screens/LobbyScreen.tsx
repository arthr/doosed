import { useMemo, useState } from 'react';
import type { Player } from '@/types/lobby';
import { RoomHeader } from '@/components/lobby/RoomHeader';
import { LobbyPanel } from '@/components/lobby/LobbyPanel';
import { PlayerGrid } from '@/components/lobby/PlayerGrid';
import { ActionControls } from '@/components/lobby/ActionControls';
import { Chat } from '@/components/chat/Chat';

// --- Mock Data ---
function createMockPlayers(): (Player | null)[] {
  return [
    { id: '1', name: 'RICK_C_137', avatar: '/images/avatar/rick_sanchez.png', isReady: true, isHost: true },
    { id: '2', name: 'MORTY_C_137', avatar: '/images/avatar/morty.png', isReady: true, isHost: false },
    { id: '3', name: 'BIRDPERSON', avatar: '/images/avatar/birdperson.png', isReady: true, isHost: false },
    { id: '4', name: 'SQUANCHY', avatar: '/images/avatar/squanchy.png', isReady: false, isHost: false },
    null,
    null,
  ];
}

// --- Main Screen ---

export const LobbyScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const players = useMemo(() => createMockPlayers(), []);

  return (
    <div className="bg-void-black text-text-primary font-pixel min-h-screen w-full">
      {/* Screen: Content */}
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-3 p-2 md:gap-4 md:p-6 lg:p-8">
        {/* Section: Header */}
        <RoomHeader roomCode="X-7-Z" status="WAITING FOR SUBJECTS..." />

        {/* Section: Main */}
        <main className="flex-1 min-h-0">
          <LobbyPanel className="h-full p-2 md:p-4">
            <div className="h-full overflow-y-auto">
              <PlayerGrid players={players} />
            </div>
          </LobbyPanel>
        </main>

        {/* Section: Footer */}
        <footer className="flex flex-col gap-3 md:h-48 md:flex-row md:items-stretch md:gap-4">
          <LobbyPanel className="flex-1 overflow-hidden">
            <Chat mode="inline" threadId="lobby" />
          </LobbyPanel>
          <LobbyPanel className="flex flex-col md:w-[360px]">
            <ActionControls isReady={isReady} onToggleReady={() => setIsReady(prev => !prev)} />
          </LobbyPanel>
        </footer>
      </div>
    </div>
  );
};

export default LobbyScreen;