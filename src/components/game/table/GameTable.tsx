export function GameTable() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl p-4 mb-4 bg-neutral-800 border-4 border-border-muted rounded-xl relative">
      {/* Header da Mesa */}
      <div className="absolute -top-5 bg-panel px-4 py-1 border-2 border-neon-green text-neon-green font-bold rounded">
        THE TABLE
      </div>

      <div className="w-full text-center mt-2 mb-2">
        <p className="text-neon-green font-mono text-sm">
          RODADA 2 | TURNO: <span className="text-text-primary">Rick Sanchez</span>
        </p>
      </div>

      {/* Status dos Itens (Counts) */}
      <div className="flex justify-center gap-4 mb-4 text-xs md:text-sm font-mono font-bold">
        <span className="text-pill-safe">[7] SAFE</span>
        <span className="text-neon-purple">[4] POISON</span>
        <span className="text-neon-yellow">[2] TOXIC</span>
        <span className="text-neon-yellow">[1] TOXIC</span>
        <span className="text-pill-heal">[1] ANTIDOTE</span>
        <span className="text-neon-red">[0] LETHAL</span>
      </div>

      {/* Esteira de Itens (Conveyor Belt) */}
      <div className="w-full bg-panel border-2 border-border-muted rounded p-4 grid grid-rows-2 gap-2">
        {/* Linha 1 */}
        <div className="flex justify-between gap-2 border-b border-border-muted pb-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center text-text-muted text-xs"
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
              className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center text-text-muted text-xs"
            >
              ?
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
