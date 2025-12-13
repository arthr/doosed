import React from 'react';
import { Header } from '../components/draft/Header';
import { ShopItem } from '../components/draft/ShopItem';
import { InventorySlot } from '../components/draft/InventorySlot';
import { ActionDock } from '../components/ui/ActionDock';
import { GameLogPanel } from '../components/ui/GameLogPanel';
import { useDraftShopMock } from '../hooks/useDraftShopMock';
import { Beer, Lock, Search, Sword, AlertTriangle, Backpack, Check } from 'lucide-react';
import type { DraftShopItem } from '../types/draft';

// Types
const SHOP_ITEMS: DraftShopItem[] = [
  { id: 1, name: 'BEER', desc: '- Heals HP', price: 50, icon: <Beer size={48} strokeWidth={1.5} /> },
  { id: 2, name: 'HANDCUFFS', desc: '- Skips enemy turn', price: 75, icon: <Lock size={48} strokeWidth={1.5} /> },
  { id: 3, name: 'MAGNIFIER', desc: '- Reveals next pill', price: 40, icon: <Search size={48} strokeWidth={1.5} /> },
  { id: 4, name: 'SPACE KNIFE', desc: '- Deals 2 DMG', price: 100, icon: <Sword size={48} strokeWidth={1.5} /> },
  { id: 5, name: 'SCANNER', desc: '- Detects traps', price: 60, icon: <AlertTriangle size={48} strokeWidth={1.5} /> },
];

export default function DraftScreen() {
  const { wallet, timeLeft, inventory, logs, canBuy, buy, confirmLoadout, openChat, maxSlots } = useDraftShopMock();

  return (
    <div className="h-screen overflow-y-auto bg-space-black text-foreground p-2 sm:p-3 md:p-6 flex flex-col max-w-7xl mx-auto border-x-4 md:border-x-8 border-border font-mono text-xs md:text-sm">
      {/* Top UI */}
      <Header balance={wallet} time={timeLeft} />

      {/* Shop Section (Conveyor Belt) */}
      <div className="flex-1 flex flex-col justify-center relative my-3 md:my-4">
        {/* Industrial pipes background decoration */}
        <div className="absolute top-0 left-0 w-full h-4 bg-ui-panel border-y border-border"></div>
        <div className="absolute bottom-0 left-0 w-full h-4 bg-ui-panel border-y border-border"></div>

        {/* Items Container */}
        <div className="pb-6 pt-4 px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {SHOP_ITEMS.map((item) => (
              <ShopItem
                key={item.id}
                item={item}
                onBuy={buy}
                canAfford={canBuy(item)}
              />
            ))}
          </div>
        </div>

        {/* Conveyor Belt Track Graphic */}
        <div className="h-6 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#333_20px,#333_24px)] border-t-2 border-border opacity-50"></div>
      </div>

      {/* Bottom Section: Inventory + Log + Actions */}
      <div className="bg-ui-panel border-4 border-border rounded-xl p-3 sm:p-4 md:p-6 mt-auto">
        <div className="flex items-center gap-2 mb-3 md:mb-4 text-muted-foreground border-b border-border pb-2">
          <Backpack size={20} />
          <h2 className="text-sm tracking-wider uppercase">
            Your Backpack ({inventory.length}/{maxSlots} Slots)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {/* Inventory (smaller) */}
          <div className="md:col-span-4">
            <div className="inline-grid grid-cols-4 gap-1 sm:gap-1.5">
              {[...Array(maxSlots)].map((_, i) => (
                <div key={i} className="w-9 sm:w-10 md:w-11">
                  <InventorySlot item={inventory[i]} />
                </div>
              ))}
            </div>
          </div>

          {/* Log */}
          <div className="md:col-span-5">
            <GameLogPanel logs={logs} className="h-28 sm:h-32 md:h-36" />
          </div>

          {/* Actions: Confirm + Chat */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={confirmLoadout}
              disabled={timeLeft === 0}
              className="w-full min-h-[56px] md:min-h-[80px] bg-primary text-primary-foreground font-normal text-sm md:text-base tracking-[0.15em] md:tracking-widest uppercase border-4 border-border shadow-(--shadow-neon-green) hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 md:gap-3"
            >
              <span>Confirm Loadout</span>
              <Check className="hidden sm:block" size={28} strokeWidth={3} />
            </button>

            <ActionDock onChat={openChat} layout="stack" />
          </div>
        </div>
      </div>
    </div>
  );
}
