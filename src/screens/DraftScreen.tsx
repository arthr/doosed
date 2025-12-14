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
} from 'lucide-react';
import type { DraftShopItem } from '@/types/draft';

// Types
const SHOP_ITEMS: DraftShopItem[] = [
  {
    id: 1,
    name: 'BEER',
    desc: '- Heals HP',
    price: 50,
    icon: <Beer size={48} strokeWidth={1.5} />,
  },
  {
    id: 2,
    name: 'HANDCUFFS',
    desc: '- Skips enemy turn',
    price: 75,
    icon: <Lock size={48} strokeWidth={1.5} />,
  },
  {
    id: 3,
    name: 'MAGNIFIER',
    desc: '- Reveals next pill',
    price: 40,
    icon: <Search size={48} strokeWidth={1.5} />,
  },
  {
    id: 4,
    name: 'SPACE KNIFE',
    desc: '- Deals 2 DMG',
    price: 100,
    icon: <Sword size={48} strokeWidth={1.5} />,
  },
  {
    id: 5,
    name: 'SCANNER',
    desc: '- Detects traps',
    price: 60,
    icon: <AlertTriangle size={48} strokeWidth={1.5} />,
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
      <Header balance={wallet} time={timeLeft} />
      <div className="bg-space-black text-foreground border-border flex h-screen flex-col overflow-y-auto border-x-4 p-2 font-mono text-xs sm:p-3 md:border-x-8 md:p-6 md:text-sm">
        {/* Top UI */}

        {/* Shop Section (Conveyor Belt) */}
        <div className="relative my-3 flex flex-col justify-center md:my-4">
          {/* Conveyor Belt Track Graphic */}
          <div className="border-border h-4 bg-[repeating-linear-gradient(90deg,oklch(0.16_0.04_260),oklch(0.16_0.04_260)_20px,#333_20px,#333_24px)] opacity-50"></div>

          {/* Items Container */}
          <div className="px-2 pt-4 pb-6 sm:px-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4 lg:grid-cols-5">
              {SHOP_ITEMS.map(item => (
                <ShopItem key={item.id} item={item} onBuy={buy} canAfford={canBuy(item)} />
              ))}
            </div>
          </div>

          {/* Conveyor Belt Track Graphic */}
          <div className="border-border h-4 bg-[repeating-linear-gradient(90deg,oklch(0.16_0.04_260),oklch(0.16_0.04_260)_20px,#333_20px,#333_24px)] opacity-50"></div>
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
              <div className="md:gap-y- grid grid-cols-4 gap-x-2 gap-y-3 sm:gap-x-3 sm:gap-y-4 md:gap-x-4">
                {[...Array(maxSlots)].map((_, i) => (
                  <div key={i} className="col-span-1 w-full">
                    <InventorySlot item={inventory[i]} />
                  </div>
                ))}
              </div>
            </div>

            {/* Log */}
            <div className="flex flex-col md:col-span-5">
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
    </div>
  );
};
