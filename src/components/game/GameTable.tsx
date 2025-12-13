import { useGameStore } from '../../store/useGameStore';
export const GameTable = () => {
  const { round, pillPool, tablePills, currentTurnPlayerId, players } = useGameStore();
  const currentPlayer = players.find(p => p.id === currentTurnPlayerId);
  const Stat = ({ label, val, color }: { label: string; val: number; color: string }) => (
    <div className="flex flex-col items-center mx-2">
      <span className={`text-lg font-normal ${color}`}>[{val}]</span>
      <span className={`text-[10px] ${color}`}>{label}</span>
    </div>
  );
  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      <div className="bg-ui-panel border-4 border-gray-600 rounded-lg p-4 w-2/3 max-w-3xl relative">
        <div className="absolute -left-4 top-1/2 w-4 h-10 bg-green-500 rounded-l-md" />
        <div className="absolute -right-4 top-1/2 w-4 h-10 bg-purple-500 rounded-r-md" />
        <div className="bg-green-900/30 border border-rick-green text-rick-green text-center py-1 mb-4">
          RODADA {round} | TURNO: {currentPlayer?.name || 'Unknown'}
        </div>
        <div className="flex justify-center mb-6 bg-black/40 p-2 rounded border border-gray-700">
          <Stat label="SAFE" val={pillPool.safe} color="text-green-500" />
          <Stat label="POISON" val={pillPool.poison} color="text-purple-500" />
          <Stat label="TOXIC" val={pillPool.toxic} color="text-yellow-400" />
          <Stat label="ANTIDOTE" val={pillPool.antidote} color="text-blue-400" />
          <Stat label="LETHAL" val={pillPool.lethal} color="text-red-600" />
        </div>
        <div className="flex justify-center gap-3 flex-wrap">
          {tablePills.map((pill, idx) => (
            <button
              key={idx}
              className="w-12 h-6 rounded-full bg-gray-300 border-2 border-gray-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg relative overflow-hidden"
            >
              <div className="w-1/2 h-full bg-gray-400 absolute left-0" />
              <span className="relative z-10 text-black font-normal text-xs">?</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
