export function GameTable() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl p-4 mb-4 bg-gray-800 border-4 border-gray-600 rounded-xl relative">
      {/* Header da Mesa */}
      <div className="absolute -top-5 bg-gray-900 px-4 py-1 border-2 border-green-500 text-green-500 font-bold rounded">
        THE TABLE
      </div>

      <div className="w-full text-center mt-2 mb-2">
        <p className="text-green-400 font-mono text-sm">
          RODADA 2 | TURNO: <span className="text-white">Rick Sanchez</span>
        </p>
      </div>

      {/* Status dos Itens (Counts) */}
      <div className="flex justify-center gap-4 mb-4 text-xs md:text-sm font-mono font-bold">
        <span className="text-green-400">[7] SAFE</span>
        <span className="text-purple-400">[4] POISON</span>
        <span className="text-yellow-400">[2] TOXIC</span>
        <span className="text-orange-400">[1] TOXIC</span>
        <span className="text-blue-400">[1] ANTIDOTE</span>
        <span className="text-red-500">[0] LETHAL</span>
      </div>

      {/* Esteira de Itens (Conveyor Belt) */}
      <div className="w-full bg-gray-900 border-2 border-gray-700 rounded p-4 grid grid-rows-2 gap-2">
        {/* Linha 1 */}
        <div className="flex justify-between gap-2 border-b border-gray-700 pb-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-xs"
            >
              ?
            </div>
          ))}
        </div>

        {/* Linha 2 */}
        <div className="flex justify-between gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-xs"
            >
              ?
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
