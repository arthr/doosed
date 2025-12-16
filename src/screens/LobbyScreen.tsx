import { useMemo, useState } from 'react';
import type { Player } from '@/types/lobby';
import { LobbyPanel } from '@/components/lobby/LobbyPanel';
import { PlayerGrid } from '@/components/lobby/PlayerGrid';
import { ActionControls } from '@/components/lobby/ActionControls';
import { Header } from '@/components/game/hud/Header';
import { PhasePanelHUD } from '@/components/game/hud/PhasePanelHUD';
import { KeyRound } from 'lucide-react';

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
  const roomCode = 'X7Z-123';
  const lobbyStatus = 'AGUARDANDO...';

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
        {/* Section: Header */}
        {/* TODO: Header do Lobby precisa de roomCode e Status de sala */}
        <Header
          left={{
            icon: <KeyRound className="text-neon-yellow" size={18} />,
            label: 'ROOM',
            value: roomCode,
          }}
          right={{
            // icon: <Activity className="text-neon-yellow" size={18} />,
            label: 'STATUS',
            value: lobbyStatus,
          }}
          center={{
            title: 'Game',
            artwork: (
              <img
                src="/images/avatar/rick_looser_md.png"
                alt="Rick Winner"
                className="-my-4 size-16 drop-shadow-xs select-none"
                draggable={false}
              />
            ),
            subtitle: 'Lobby',
          }}
        />

        {/* Section: Main */}
        <main className="flex-1 min-h-0">
          <LobbyPanel className="h-full p-2 md:p-4">
            <div className="h-full overflow-y-auto">
              <PlayerGrid players={players} />
            </div>
          </LobbyPanel>
        </main>

        {/* Section: Footer */}
        <footer className="mt-auto">
          <PhasePanelHUD
            phase="lobby"
            className="h-auto md:h-48"
            chatThreadId="lobby"
            actions={
            <ActionControls isReady={isReady} onToggleReady={() => setIsReady(prev => !prev)} />
            }
          />
        </footer>
      </div>
  );
};

export default LobbyScreen;