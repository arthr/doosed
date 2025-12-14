import { Link, Search, Shield, Sword } from 'lucide-react';

function InventoryIcon({ kind }: { kind: 'search' | 'link' | 'sword' | 'shield' }) {
  const className = 'h-4 w-4 text-neutral-200';
  if (kind === 'search') return <Search className={className} />;
  if (kind === 'link') return <Link className={className} />;
  if (kind === 'sword') return <Sword className={className} />;
  return <Shield className={className} />;
}

export function PlayerDashboard() {
  return (
    <div className="flex-1 flex p-4 bg-gray-900 border-4 border-green-500 rounded-xl mr-4 min-w-[50%]">
      {/* Avatar Grande */}
      <div className="w-24 h-32 bg-gray-800 border-2 border-green-400 flex items-center justify-center text-white mr-4">
        [YOUR AVATAR]
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-white mb-2">Rick Sanchez (YOU)</h2>

        {/* Barras de Status */}
        <div className="flex gap-8 mb-2">
          <div>
            <span className="block text-xs text-gray-400">HEALTH BAR</span>
            <span className="text-purple-500 text-xl">HP HP HP HP</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400">RESISTANCE BAR</span>
            <span className="inline-flex items-center gap-1 text-blue-500">
              <Shield className="h-4 w-4" />
              <Shield className="h-4 w-4" />
              <Shield className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Grid de Inventário */}
        <div className="mt-2">
          <span className="block text-xs text-gray-400 mb-1">INVENTORY GRID</span>
          <div className="grid grid-cols-5 gap-1 w-full max-w-xs">
            <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center">
              <InventoryIcon kind="search" />
            </div>
            <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center">
              <InventoryIcon kind="link" />
            </div>
            <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center">
              <InventoryIcon kind="sword" />
            </div>
            <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center">
              <InventoryIcon kind="shield" />
            </div>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-8 h-8 bg-transparent border border-gray-700"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
