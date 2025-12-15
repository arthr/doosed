import { useMemo, useState } from 'react';
import type { Player } from '@/types/lobby';
import { RoomHeader } from '@/components/lobby/RoomHeader';
import { LobbyPanel } from '@/components/lobby/LobbyPanel';
import { PlayerGrid } from '@/components/lobby/PlayerGrid';
import { ActionControls } from '@/components/lobby/ActionControls';
import { Chat } from '@/components/chat/Chat';
import { Header } from '@/components/draft/Header';

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
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
        {/* Section: Header */}
        {/* TODO: Header precisa ser flexivel para todas as screens da aplicação */}
        {/* Header do Lobby precisa de roomCode e Status de sala */}
        <Header balance={1000} time={30} />
        {/* <RoomHeader roomCode="X-7-Z" status="WAITING FOR SUBJECTS..." /> */}

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
  );
};

export default LobbyScreen;