import { Link, Search, Shield, Sword } from 'lucide-react';

function InventoryIcon({ kind }: { kind: 'search' | 'link' | 'sword' | 'shield' }) {
  const className = 'h-4 w-4 text-text-primary';
  if (kind === 'search') return <Search className={className} />;
  if (kind === 'link') return <Link className={className} />;
  if (kind === 'sword') return <Sword className={className} />;
  return <Shield className={className} />;
}

export function PlayerDashboard() {
  return (
    <div className="flex-1 flex p-4 bg-panel border-4 border-neon-green rounded-xl mr-4 min-w-[50%]">
      {/* Avatar Grande */}
      <div className="w-24 h-32 bg-neutral-800 border-2 border-neon-green overflow-hidden mr-4">
        <img
          src="/images/avatar/rick_sanchez.png"
          alt="Rick Sanchez"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-bold text-text-primary mb-2">Rick Sanchez (YOU)</h2>

        {/* Barras de Status */}
        <div className="flex gap-8 mb-2">
          <div>
            <span className="block text-xs text-text-muted">HEALTH BAR</span>
            <span className="text-heart text-xl">HP HP HP HP</span>
          </div>
          <div>
            <span className="block text-xs text-text-muted">RESISTANCE BAR</span>
            <span className="inline-flex items-center gap-1 text-shield">
              <Shield className="h-4 w-4" />
              <Shield className="h-4 w-4" />
              <Shield className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Grid de Inventario */}
        <div className="mt-2">
          <span className="block text-xs text-text-muted mb-1">INVENTORY GRID</span>
          <div className="grid grid-cols-5 gap-1 w-full max-w-xs">
            <div className="w-8 h-8 bg-neutral-800 border border-border-muted flex items-center justify-center">
              <InventoryIcon kind="search" />
            </div>
            <div className="w-8 h-8 bg-neutral-800 border border-border-muted flex items-center justify-center">
              <InventoryIcon kind="link" />
            </div>
            <div className="w-8 h-8 bg-neutral-800 border border-border-muted flex items-center justify-center">
              <InventoryIcon kind="sword" />
            </div>
            <div className="w-8 h-8 bg-neutral-800 border border-border-muted flex items-center justify-center">
              <InventoryIcon kind="shield" />
            </div>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="w-8 h-8 bg-transparent border border-border-muted"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
