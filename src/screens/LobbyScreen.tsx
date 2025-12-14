import { ActionControls } from '@/components/lobby/ActionControls';
import { PlayerGrid } from '@/components/lobby/PlayerGrid';
import { RoomHeader } from '@/components/lobby/RoomHeader';
import { useLobbyMock } from '@/hooks/useLobbyMock';
import { Chat } from '@/components/chat/Chat';

export const LobbyScreen = () => {
  const { players, currentUserReady, toggleReady } = useLobbyMock();

  return (
    <div className="bg-space-black text-foreground border-border mx-auto flex h-screen max-w-7xl flex-col border-x-4 p-2 font-mono text-xs md:border-x-8 md:p-6 md:text-sm">
      <div className="flex flex-col gap-3 md:gap-4">
        {/* Header Section */}
        <RoomHeader roomCode="X-7-Z" status="WAITING FOR SUBJECTS..." />

        {/* Main Content: Player Grid */}
        <main className="grow overflow-y-auto md:overflow-visible">
          <PlayerGrid players={players} />
        </main>

        {/* Footer: Chat & Actions */}
        <footer className="flex bg-ui-panel h-auto shrink-0 flex-col gap-3 md:h-64 md:flex-row md:gap-4">
          <Chat mode="inline" threadId="lobby" className="px-2 md:px-0" />

          {/* Action Buttons */}
          <ActionControls isReady={currentUserReady} onToggleReady={toggleReady} />
        </footer>
      </div>
    </div>
  );
};
