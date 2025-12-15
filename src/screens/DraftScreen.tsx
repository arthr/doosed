import { Header } from '@/components/draft/Header';
import { ShopItem } from '@/components/draft/ShopItem';
import { InventorySlot } from '@/components/draft/InventorySlot';
import { ActionDock } from '@/components/ui/ActionDock';
import { useDraftShopMock } from '@/hooks/useDraftShopMock';
import { Chat } from '@/components/chat/Chat';
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
    canBuy,
    buy,
    toggleLoadout,
    loadoutConfirmed,
    openShop,
    maxSlots,
  } = useDraftShopMock();

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
      {/* Section: Header */}
      <Header balance={wallet} time={timeLeft} />

      {/* Section: Content (scroll) */}
      <div className="bg-void-black text-text-primary border-border-muted flex flex-1 min-h-0 flex-col overflow-y-auto p-2 font-mono text-xs md:p-0 md:text-sm">
        {/* Section: Shop (Conveyor Belt) */}
        <div className="relative flex flex-col justify-center md:my-4">
          {/* Conveyor Belt Track Graphic */}
          <div className="border-border-muted hidden h-2 bg-[repeating-linear-gradient(90deg,oklch(0.16_0.04_260),oklch(0.16_0.04_260)_20px,#333_20px,#333_24px)] opacity-50 md:block"></div>

          {/* Items Container */}
          <div className="py-0 md:pt-4 md:pb-6">
            <div className="divide-border grid grid-cols-1 items-center justify-center divide-x-6 lg:grid-cols-4">
              {/* Category Columns */}
              {Object.keys(DRAFT_SHOP_CATEGORIES).map(category => (
                <div
                  key={category}
                  className="divide-border flex flex-col gap-2 divide-y px-0 not-last:pb-4 md:divide-y-0 md:px-3"
                >
                  <h3 className="text-sm uppercase">{category}</h3>
                  <div className="grid grid-cols-5 gap-2 md:gap-3 lg:grid-cols-3">
                    {/* Category Items */}
                    {[...Array(5)].map((_, itemIndex) => (
                      <div key={itemIndex} className="col-span-1 w-full">
                        <ShopItem
                          item={SHOP_ITEMS[itemIndex]}
                          onBuy={buy}
                          canAfford={canBuy(SHOP_ITEMS[itemIndex])}
                          timeLeft={timeLeft}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conveyor Belt Track Graphic */}
          <div className="border-border-muted hidden h-2 bg-[repeating-linear-gradient(90deg,oklch(0.16_0.04_260),oklch(0.16_0.04_260)_20px,#333_20px,#333_24px)] opacity-50 md:block"></div>
        </div>
      </div>

      {/* Section: Footer (Inventory + Chat + Actions) */}
      <div className="bg-panel border-border-muted rounded-xl border-4 p-3 sm:p-4 md:p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {/* Inventory (smaller) */}
          <div className="md:col-span-4">
            <div className="text-text-muted border-border-muted flex items-center gap-2 pb-4">
              <Backpack size={20} />
              <h2 className="text-sm uppercase">
                Backpack ({inventory.length}/{maxSlots} Slots)
              </h2>
            </div>
            <div className="grid grid-cols-8 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4">
              {[...Array(maxSlots)].map((_, i) => (
                <div key={i} className="col-span-1 w-full">
                  <InventorySlot item={inventory[i]} />
                </div>
              ))}
            </div>
          </div>

          {/* Chat (padrao Lobby) */}
          <div className="flex flex-col md:col-span-5">
            <div className="md:flex hidden items-center gap-2 text-text-muted border-border-muted pb-4">
              <Terminal size={20} />
              <h2 className="text-sm uppercase">Chat</h2>
            </div>
            <div className='flex h-auto shrink-0 flex-col gap-3 md:h-50 md:flex-row md:gap-4'>
              <Chat mode="inline" threadId="draft" />
            </div>
          </div>

          {/* Actions: Confirm + Chat */}
          <div className="flex flex-col md:col-span-3">
            <div className="text-text-muted border-border-muted flex items-center gap-2 pb-4">
              <Joystick size={20} />
              <h2 className="text-sm uppercase">Actions</h2>
            </div>
            <div className="flex h-full flex-col">
              <ActionDock
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
