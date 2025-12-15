import type { Phase } from '@/core/state-machines/phase';
import { cn } from '@/lib/cn';

function getNextPhase(phase: Phase): Phase {
  if (phase === 'LOBBY') return 'DRAFT';
  if (phase === 'DRAFT') return 'MATCH';
  if (phase === 'MATCH') return 'RESULTS';
  return 'LOBBY';
}

export interface DevPhaseControlsProps {
  phase: Phase;
  setPhaseGuarded: (phase: Phase) => void;
  resetRun: () => void;
}

export function DevPhaseControls({ phase, setPhaseGuarded, resetRun }: DevPhaseControlsProps) {
  return (
    <div className="rounded border border-neutral-800 bg-black/50 p-3">
      <div className="mb-2 text-xs tracking-widest text-neutral-400 uppercase">Phase</div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white">
          Atual: <span className="font-normal">{phase}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPhaseGuarded('LOBBY')}
            className={cn(
              'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
              'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
            )}
          >
            Lobby
          </button>
          <button
            type="button"
            onClick={() => {
              if (phase === 'RESULTS') resetRun();
              else setPhaseGuarded(getNextPhase(phase));
            }}
            className={cn(
              'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
              'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
            )}
          >
            Next
          </button>
          <button
            type="button"
            onClick={resetRun}
            className={cn(
              'rounded border border-neutral-700 bg-neutral-900 px-2 py-1',
              'text-xs text-white hover:border-neutral-300 hover:bg-neutral-800',
            )}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
