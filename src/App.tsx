import '@/index.css';
import { Chat } from '@/components/chat/Chat';
import { initChatSystemBridge } from '@/stores/initChatSystemBridge';
import { useFlowStore } from '@/stores/flowStore';
import type { Phase } from '@/core/state-machines/phase';
import { LobbyScreen } from '@/screens/LobbyScreen';
import { DraftScreen } from '@/screens/DraftScreen';
import { MatchScreen } from '@/screens/MatchScreen';
import ResultScreen from '@/screens/ResultScreen';
import { DevScreen } from '@/screens/DevScreen';
import { useMemo, useState } from 'react';

initChatSystemBridge();

function getNextPhase(phase: Phase): Phase {
  if (phase === 'LOBBY') return 'DRAFT';
  if (phase === 'DRAFT') return 'MATCH';
  if (phase === 'MATCH') return 'RESULTS';
  return 'LOBBY';
}

function App() {
  const phase = useFlowStore(state => state.phase);
  const setPhaseGuarded = useFlowStore(state => state.setPhaseGuarded);
  const resetRun = useFlowStore(state => state.resetRun);

  const [isDevOpen, setIsDevOpen] = useState(false);
  const isDev = import.meta.env.DEV;

  const Screen = useMemo(() => {
    switch (phase) {
      case 'LOBBY':
        return <LobbyScreen />;
      case 'DRAFT':
        return <DraftScreen />;
      case 'MATCH':
        return <MatchScreen />;
      case 'RESULTS':
        return <ResultScreen />;
      default: {
        const _exhaustive: never = phase;
        return _exhaustive;
      }
    }
  }, [phase]);

  return (
    <>
      {Screen}
      <Chat mode="dock" />

      {/* Fluxo básico sem depender do DevScreen */}
      <div className="fixed left-3 bottom-3 z-50 flex items-center gap-2 rounded border-2 border-neutral-800 bg-black/80 px-3 py-2 font-mono text-xs text-white backdrop-blur">
        <span className="text-neutral-300">PHASE:</span>
        <span className="font-bold">{phase}</span>
        <div className="ml-2 flex items-center gap-2">
          <button
            type="button"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 hover:border-neutral-300 hover:bg-neutral-800"
            onClick={() => setPhaseGuarded('LOBBY')}
          >
            Lobby
          </button>
          <button
            type="button"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 hover:border-neutral-300 hover:bg-neutral-800"
            onClick={() => {
              if (phase === 'RESULTS') resetRun();
              else setPhaseGuarded(getNextPhase(phase));
            }}
          >
            Next
          </button>
          <button
            type="button"
            className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 hover:border-neutral-300 hover:bg-neutral-800"
            onClick={resetRun}
          >
            Reset
          </button>
        </div>
      </div>

      {/* DevScreen como ferramenta (DEV-only) */}
      {isDev ? (
        <>
          <button
            type="button"
            className="fixed right-3 bottom-3 z-60 rounded border-2 border-neutral-700 bg-neutral-950/90 px-3 py-2 font-mono text-xs text-white hover:border-neutral-300 hover:bg-neutral-900"
            onClick={() => setIsDevOpen(v => !v)}
          >
            {isDevOpen ? 'Fechar Dev' : 'Abrir Dev'}
          </button>
          {isDevOpen ? (
            <div className="fixed inset-0 z-70">
              <DevScreen />
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}
export default App;
