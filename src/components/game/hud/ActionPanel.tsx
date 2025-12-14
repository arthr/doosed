import { MessageSquare, ShoppingCart } from 'lucide-react';

export function ActionPanel() {
  return (
    <div className="w-full md:w-1/3 flex flex-col-reverse md:flex-col gap-2">
      {/* Game Log */}
      <div className="bg-black border-2 border-gray-600 p-2 h-24 overflow-y-auto rounded font-mono text-xs text-green-400">
        <p>{`> Match started.`}</p>
        <p>{`> Round 1 ended.`}</p>
        <p className="text-yellow-300">{`> Rick Sanchez used Beer.`}</p>
        <p>{`> Ejected shell.`}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded border-2 border-green-400 text-xl flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-5 w-5" />
          SHOP
        </button>
        <button
          type="button"
          className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded border-2 border-purple-400 text-xl flex items-center justify-center gap-2"
        >
          <MessageSquare className="h-5 w-5" />
          CHAT
        </button>
      </div>
    </div>
  );
}
