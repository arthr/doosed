import { useState, useMemo } from 'react';
import type { Player } from '@/types/lobby';
import { useFlowStore } from '@/stores/flowStore';
import { LobbyPanel } from '@/components/lobby/LobbyPanel';
import { PlayerGrid } from '@/components/lobby/PlayerGrid';
import { ActionDock } from '@/components/ui/action-dock';
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

import { useAppShellStore } from '@/stores/appShellStore';

// --- Main Screen ---

export const LobbyScreen = () => {
  const [isReady, setIsReady] = useState(false);
  const players = useMemo(() => createMockPlayers(), []);
  const roomCode = 'X7Z-123';
  const lobbyStatus = 'AGUARDANDO...';

  const setPhaseGuarded = useFlowStore(state => state.setPhaseGuarded);
  const setAppScreen = useAppShellStore(state => state.setAppScreen);

  const handleReady = () => {
    setIsReady(true);
    // Simulação Solo: Start imediato após ready
    setTimeout(() => {
      setPhaseGuarded('DRAFT');
    }, 500);
  };

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
      {/* Section: Header */}
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
              src="/images/avatar/rick_winner_md.png"
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
      <PhasePanelHUD
        phase="lobby"
        chatThreadId="lobby"
        actions={
          <ActionDock
            ready={{
              onPress: handleReady,
              pressed: isReady,
              disabled: false,
            }}
            leave={{
              disabled: false,
              onClick: () => setAppScreen('HOME')
            }}
          />
        }
      />
    </div>
  );
};

export default LobbyScreen;