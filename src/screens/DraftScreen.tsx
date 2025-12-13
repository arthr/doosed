import React, { useState, useEffect } from 'react';
import { Header } from '../components/draft/Header';
import { ShopItem } from '../components/draft/ShopItem';
import { InventorySlot } from '../components/draft/InventorySlot';
import { Beer, Lock, Search, Sword, AlertTriangle, Backpack, Check } from 'lucide-react';

// Types
type Item = {
  id: number;
  name: string;
  desc: string;
  price: number;
  icon: React.ReactNode;
};

const SHOP_ITEMS: Item[] = [
  { id: 1, name: 'BEER', desc: '- Heals HP', price: 50, icon: <Beer size={48} strokeWidth={1.5} /> },
  { id: 2, name: 'HANDCUFFS', desc: '- Skips enemy turn', price: 75, icon: <Lock size={48} strokeWidth={1.5} /> },
  { id: 3, name: 'MAGNIFIER', desc: '- Reveals next pill', price: 40, icon: <Search size={48} strokeWidth={1.5} /> },
  { id: 4, name: 'SPACE KNIFE', desc: '- Deals 2 DMG', price: 100, icon: <Sword size={48} strokeWidth={1.5} /> },
  { id: 5, name: 'SCANNER', desc: '- Detects traps', price: 60, icon: <AlertTriangle size={48} strokeWidth={1.5} /> },
];

const MAX_SLOTS = 8;

export default function DraftScreen() {
  // State
  const [wallet, setWallet] = useState(150);
  const [timeLeft, setTimeLeft] = useState(15);
  const [inventory, setInventory] = useState<Item[]>([]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  // Buy Logic
  const handleBuy = (item: Item) => {
    if (wallet >= item.price && inventory.length < MAX_SLOTS) {
      setWallet((prev) => prev - item.price);
      setInventory((prev) => [...prev, item]);
    }
  };

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
                onBuy={handleBuy}
                canAfford={wallet >= item.price && inventory.length < MAX_SLOTS}
              />
            ))}
          </div>
        </div>

        {/* Conveyor Belt Track Graphic */}
        <div className="h-6 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#333_20px,#333_24px)] border-t-2 border-border opacity-50"></div>
      </div>

      {/* Bottom Section: Inventory & Confirm */}
      <div className="bg-ui-panel border-4 border-border rounded-xl p-3 sm:p-4 md:p-6 mt-auto">
        <div className="flex items-center gap-2 mb-3 md:mb-4 text-muted-foreground border-b border-border pb-2">
          <Backpack size={20} />
          <h2 className="text-sm tracking-wider uppercase">
            Your Backpack ({inventory.length}/{MAX_SLOTS} Slots)
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Inventory Grid */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-4 flex-1">
            {[...Array(MAX_SLOTS)].map((_, i) => (
              <InventorySlot key={i} item={inventory[i]} />
            ))}
          </div>

          {/* Confirm Button */}
          <div className="flex items-end justify-center md:justify-end md:w-[min(22rem,35%)]">
            <button
              disabled={timeLeft === 0}
              className="w-full min-h-[56px] md:min-h-[80px] bg-primary text-primary-foreground font-normal text-sm md:text-base tracking-[0.15em] md:tracking-widest uppercase border-4 border-border shadow-(--shadow-neon-green) hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 md:gap-3"
            >
              <span>Confirm Loadout</span>
              <Check className="hidden sm:block" size={28} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
