import { Header } from '@/components/draft/Header';
import { ShopItem } from '@/components/draft/ShopItem';
import { InventorySlot } from '@/components/draft/InventorySlot';
import { ActionDock } from '@/components/ui/ActionDock';
import { GameLogPanel } from '@/components/ui/GameLogPanel';
import { useDraftShopMock } from '@/hooks/useDraftShopMock';
import {
  Beer,
  Lock,
  Search,
  Sword,
  AlertTriangle,
  Backpack,
  Terminal,
  Joystick,
  Shuffle,
  Trash,
  Bomb,
} from 'lucide-react';
import type { DraftShopItem } from '@/types/draft';
import { DRAFT_SHOP_CATEGORIES } from '@/types/draft';

// Types
const SHOP_ITEMS: DraftShopItem[] = [
  {
    id: 1,
    name: 'POCKET PILL',
    desc: '- +4 resistance',
    category: 'SUSTAIN',
    price: 50,
    icon: <Beer size={48} strokeWidth={1.5} />,
  },
  {
    id: 2,
    name: 'SHIELD',
    desc: '- Immunity to damage for 1 round',
    category: 'CONTROL',
    price: 75,
    icon: <Lock size={48} strokeWidth={1.5} />,
  },
  {
    id: 3,
    name: 'SHAPE SCANNER',
    desc: '- Reveals all pills of shape',
    category: 'INTEL',
    price: 40,
    icon: <Search size={48} strokeWidth={1.5} />,
  },
  {
    id: 4,
    name: 'INVERTER',
    desc: '- Inverts pill effect',
    category: 'CHAOS',
    price: 100,
    icon: <Sword size={48} strokeWidth={1.5} />,
  },
  {
    id: 5,
    name: 'DOUBLE',
    desc: '- Doubles pill effect',
    category: 'CHAOS',
    price: 60,
    icon: <AlertTriangle size={48} strokeWidth={1.5} />,
  },
  {
    id: 6,
    name: 'SHUFFLE',
    desc: '- Shuffles pill pool',
    category: 'CHAOS',
    price: 80,
    icon: <Shuffle size={48} strokeWidth={1.5} />,
  },
  {
    id: 7,
    name: 'DISCARD',
    desc: '- Removes pill from pool',
    category: 'CHAOS',
    price: 90,
    icon: <Trash size={48} strokeWidth={1.5} />,
  },
  {
    id: 8,
    name: 'SHAPE BOMB',
    desc: '- Removes all pills of shape',
    category: 'CHAOS',
    price: 100,
    icon: <Bomb size={48} strokeWidth={1.5} />,
  },
];

export const DraftScreen = () => {
  const {
    wallet,
    timeLeft,
    startIn,
    inventory,
    logs,
    canBuy,
    buy,
    toggleLoadout,
    loadoutConfirmed,
    openChat,
    openShop,
    maxSlots,
  } = useDraftShopMock();

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
      {/* Top UI */}
      <Header balance={wallet} time={timeLeft} />
      <div className="bg-space-black text-foreground border-border flex h-screen flex-col overflow-y-auto p-2 md:p-0 font-mono text-xs md:text-sm">

        {/* Shop Section (Conveyor Belt) */}
        <div className="relative flex flex-col justify-center md:my-4">
          {/* Conveyor Belt Track Graphic */}
          <div className="hidden md:block border-border h-4 bg-[repeating-linear-gradient(90deg,oklch(0.16_0.04_260),oklch(0.16_0.04_260)_20px,#333_20px,#333_24px)] opacity-50"></div>

          {/* Items Container */}
          <div className="py-0 md:pt-4 md:pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 divide-x-6 divide-border justify-center items-center">
              {/* Category Columns */}
              {Object.keys(DRAFT_SHOP_CATEGORIES).map((category) => (
                <div key={category} className="flex flex-col gap-2 px-0 not-last:pb-4  md:px-3 divide-y divide-border md:divide-y-0">
                  <h3 className="text-sm uppercase">{category}</h3>
                  <div className="grid grid-cols-5 gap-2 md:gap-3 lg:grid-cols-3">
                    {/* Category Items */}
                    {[...Array(5)].map((_, itemIndex) => (
                      <div key={itemIndex} className="col-span-1 w-full">
                        <ShopItem item={SHOP_ITEMS[itemIndex]} onBuy={buy} canAfford={canBuy(SHOP_ITEMS[itemIndex])} timeLeft={timeLeft} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conveyor Belt Track Graphic */}
          <div className="hidden md:block border-border h-4 bg-[repeating-linear-gradient(90deg,oklch(0.16_0.04_260),oklch(0.16_0.04_260)_20px,#333_20px,#333_24px)] opacity-50"></div>
        </div>
      </div>
      {/* Log Mobile */}
      <div className="opacity-40 p-2 flex flex-col md:hidden">
        <GameLogPanel logs={logs} className="h-15" />
      </div>
      {/* Bottom Section: Inventory + Log + Actions */}
      <div className="bg-ui-panel border-border mt-auto rounded-xl border-4 p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {/* Inventory (smaller) */}
          <div className="md:col-span-4">
            <div className="text-muted-foreground border-border flex items-center gap-2 border-b pb-4">
              <Backpack size={20} />
              <h2 className="text-sm uppercase">
                Backpack ({inventory.length}/{maxSlots} Slots)
              </h2>
            </div>
            <div className="md:gap-y-2 grid grid-cols-8 md:grid-cols-4 gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-4 md:gap-x-4">
              {[...Array(maxSlots)].map((_, i) => (
                <div key={i} className="col-span-1 w-full">
                  <InventorySlot item={inventory[i]} />
                </div>
              ))}
            </div>
          </div>

          {/* Log */}
          <div className="md:flex flex-col md:col-span-5 hidden">
            <div className="text-muted-foreground border-border flex items-center gap-2 border-b pb-4">
              <Terminal size={20} />
              <h2 className="text-sm uppercase">Game Log</h2>
            </div>
            <GameLogPanel logs={logs} className="h-32 sm:h-36 md:h-44" />
          </div>

          {/* Actions: Confirm + Chat */}
          <div className="flex flex-col md:col-span-3">
            <div className="text-muted-foreground border-border flex items-center gap-2 border-b pb-4">
              <Joystick size={20} />
              <h2 className="text-sm uppercase">Actions</h2>
            </div>
            <div className="flex h-full flex-col">
              <ActionDock
                chat={{ onClick: openChat, disabled: false }}
                shop={{ onClick: openShop, disabled: false }}
                loadout={{
                  onPress: toggleLoadout,
                  disabled: timeLeft === 0,
                  pressed: loadoutConfirmed,
                  timeLeft: timeLeft,
                  startIn: startIn,
                }}
                layout="stack"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
