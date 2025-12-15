export function GameTable() {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl p-4 mb-4 bg-neutral-800 border-4 border-border rounded-xl relative">
      {/* Header da Mesa */}
      <div className="absolute -top-5 bg-ui-panel px-4 py-1 border-2 border-rick-green text-rick-green font-bold rounded">
        THE TABLE
      </div>

      <div className="w-full text-center mt-2 mb-2">
        <p className="text-rick-green font-mono text-sm">
          RODADA 2 | TURNO: <span className="text-foreground">Rick Sanchez</span>
        </p>
      </div>

      {/* Status dos Itens (Counts) */}
      <div className="flex justify-center gap-4 mb-4 text-xs md:text-sm font-mono font-bold">
        <span className="text-pill-safe">[7] SAFE</span>
        <span className="text-evil-purple">[4] POISON</span>
        <span className="text-morty-yellow">[2] TOXIC</span>
        <span className="text-morty-yellow">[1] TOXIC</span>
        <span className="text-pill-heal">[1] ANTIDOTE</span>
        <span className="text-destructive">[0] LETHAL</span>
      </div>

      {/* Esteira de Itens (Conveyor Belt) */}
      <div className="w-full bg-ui-panel border-2 border-border rounded p-4 grid grid-rows-2 gap-2">
        {/* Linha 1 */}
        <div className="flex justify-between gap-2 border-b border-border pb-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center text-muted-foreground text-xs"
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
              className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center text-muted-foreground text-xs"
            >
              ?
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
