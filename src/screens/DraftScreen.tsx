import { Header } from '@/components/game/hud/Header';
import { ShopItem } from '@/components/draft/ShopItem';
import { ActionDock } from '@/components/ui/ActionDock';
import { useDraftShopMock } from '@/hooks/useDraftShopMock';
import { PhasePanelHUD } from '@/components/game/hud/PhasePanelHUD';
import {
  Beer,
  Clock,
  Coins,
  Lock,
  Search,
  Sword,
  AlertTriangle,
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

  const formattedDraftTime = `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`;

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col">
      {/* Section: Header */}
      <Header
        left={{
          icon: <Coins className="text-neon-yellow" size={18} />,
          label: 'PILL COINS',
          value: wallet,
        }}
        center={{
          title: 'Draft',
          artwork: (
            <img
              src="/images/avatar/rick_winner.png"
              alt="Rick Winner"
              className="-my-4 size-16 drop-shadow-xs select-none"
              draggable={false}
            />
          ),
          subtitle: 'Shop',
        }}
        right={{
          icon: <Clock className="text-neon-yellow" size={18} />,
          label: 'DRAFT ENDS',
          value: formattedDraftTime,
        }}
      />

      {/* Section: Content (scroll) */}
      <div className="bg-void-black text-text-primary border-border-muted flex flex-1 min-h-0 flex-col overflow-y-auto p-2 font-mono text-xs md:p-0 md:text-sm">
        {/* Section: Shop */}
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
      <PhasePanelHUD
        phase="draft"
        chatThreadId="draft"
        inventory={{
          items: inventory,
          maxSlots,
          title: `Backpack (${inventory.length}/${maxSlots} Slots)`,
        }}
        actions={
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
        }
      />
    </div>
  );
};
