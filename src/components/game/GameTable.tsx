import { useGameStore } from '@/store/useGameStore';
export const GameTable = () => {
  const { round, pillPool, tablePills, currentTurnPlayerId, players } = useGameStore();
  const currentPlayer = players.find(p => p.id === currentTurnPlayerId);
  const Stat = ({ label, val, color }: { label: string; val: number; color: string }) => (
    <div className="mx-2 flex flex-col items-center">
      <span className={`text-lg font-normal ${color}`}>[{val}]</span>
      <span className={`text-[10px] ${color}`}>{label}</span>
    </div>
  );
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <div className="bg-ui-panel relative w-2/3 max-w-3xl rounded-lg border-4 border-gray-600 p-4">
        <div className="absolute top-1/2 -left-4 h-10 w-4 rounded-l-md bg-green-500" />
        <div className="absolute top-1/2 -right-4 h-10 w-4 rounded-r-md bg-purple-500" />
        <div className="border-rick-green text-rick-green mb-4 border bg-green-900/30 py-1 text-center">
          RODADA {round} | TURNO: {currentPlayer?.name || 'Unknown'}
        </div>
        <div className="mb-6 flex justify-center rounded border border-gray-700 bg-black/40 p-2">
          <Stat label="SAFE" val={pillPool.safe} color="text-green-500" />
          <Stat label="POISON" val={pillPool.poison} color="text-purple-500" />
          <Stat label="TOXIC" val={pillPool.toxic} color="text-yellow-400" />
          <Stat label="ANTIDOTE" val={pillPool.antidote} color="text-blue-400" />
          <Stat label="LETHAL" val={pillPool.lethal} color="text-red-600" />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {tablePills.map((pill, idx) => (
            <button
              key={idx}
              className="relative flex h-6 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-gray-500 bg-gray-300 shadow-lg transition-transform hover:scale-110"
            >
              <div className="absolute left-0 h-full w-1/2 bg-gray-400" />
              <span className="relative z-10 text-xs font-normal text-black">?</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
