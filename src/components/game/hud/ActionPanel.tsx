import { MessageSquare, ShoppingCart } from 'lucide-react';

export function ActionPanel() {
  return (
    <div className="w-full md:w-1/3 flex flex-col-reverse md:flex-col gap-2">
      {/* Game Log */}
      <div className="bg-space-black border-2 border-border p-2 h-24 overflow-y-auto rounded font-mono text-xs text-rick-green">
        <p>{`> Match started.`}</p>
        <p>{`> Round 1 ended.`}</p>
        <p className="text-morty-yellow">{`> Rick Sanchez used Beer.`}</p>
        <p>{`> Ejected shell.`}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="bg-rick-green hover:bg-rick-green/80 text-space-black font-bold py-3 rounded border-2 border-rick-green text-xl flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          SHOP
        </button>
        <button
          type="button"
          className="bg-evil-purple hover:bg-evil-purple/80 text-foreground font-bold py-3 rounded border-2 border-evil-purple text-xl flex items-center justify-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          CHAT
        </button>
      </div>
    </div>
  );
}
