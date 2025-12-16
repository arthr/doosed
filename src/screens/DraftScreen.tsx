import { Header } from '@/components/game/hud/Header';
import { ShopItem } from '@/components/draft/ShopItem';
import { ActionDock } from '@/components/ui/action-dock';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDraftShopMock } from '@/hooks/useDraftShopMock';
import { PhasePanelHUD } from '@/components/game/hud/PhasePanelHUD';
import {
  Beer,
  Clock,
  Coins,
  Lock,
  Shuffle,
  Trash,
  Bomb,
} from 'lucide-react';
import type { DraftShopItem } from '@/types/draft';
import { DRAFT_SHOP_CATEGORIES } from '@/types/draft';
import { PillScannerIcon } from '@/components/ui/icons/pill-scanner-icon';
import { PillIcon } from '@/components/ui/icons/pill-icon';
import { PortalGunIcon } from '@/components/ui/icons/portal-gun-icon';

// Types
const SHOP_ITEMS: DraftShopItem[] = [
  {
    id: 1,
    name: 'POCKET PILL',
    desc: '- +4 resistance',
    category: 'SUSTAIN',
    price: 50,
    icon: <PillScannerIcon
      pillColor='var(--color-neon-green)'
      size={70}
      scale={3}
      pill={() => <Beer size={48} strokeWidth={1.5} />}
    />,
  },
  {
    id: 2,
    name: 'SHIELD',
    desc: '- Immunity to damage for 1 round',
    category: 'CONTROL',
    price: 75,
    icon: <PillScannerIcon
      pillColor='var(--color-neon-green)'
      size={70}
      scale={3}
      pill={() => <Lock size={48} strokeWidth={1.5} />}
    />,
  },
  {
    id: 3,
    name: 'SHAPE SCANNER',
    desc: '- Reveals all pills of shape',
    category: 'INTEL',
    price: 40,
    icon: <PillScannerIcon
      pillColor='var(--color-neon-green)'
      size={70}
      pill={() => <PillIcon primaryColor='var(--color-neon-red)' />}
    />,
  },
  {
    id: 4,
    name: 'INVERTER',
    desc: '- Inverts pill effect',
    category: 'CHAOS',
    price: 100,
    icon: <PillScannerIcon
      pillColor='var(--color-neon-green)'
      size={70}
      pill={() => <PortalGunIcon glowColor='var(--color-neon-green)' />}
    />,
  },
  {
    id: 5,
    name: 'DOUBLE',
    desc: '- Doubles pill effect',
    category: 'CHAOS',
    price: 60,
    icon: <PillScannerIcon
      pillColor='var(--color-neon-green)'
      size={70}
      pill={() => <PortalGunIcon glowColor='var(--color-neon-green)' />}
    />,
  },
  {
    id: 6,
    name: 'SHUFFLE',
    desc: '- Shuffles pill pool',
    category: 'CHAOS',
    price: 80,
    icon: <PillScannerIcon
      pillColor='var(--color-neon-green)'
      size={70}
      scale={3}
      pill={() => <Shuffle size={48} strokeWidth={1.5} />}
    />,
  },
  {
    id: 7,
    name: 'DISCARD',
    desc: '- Removes pill from pool',
    category: 'CHAOS',
    price: 90,
    icon: <PillScannerIcon
      pillColor='var(--color-neon-green)'
      size={70}
      scale={3}
      pill={() => <Trash size={48} strokeWidth={1.5} />}
    />,
  },
  {
    id: 8,
    name: 'SHAPE BOMB',
    desc: '- Removes all pills of shape',
    category: 'CHAOS',
    price: 100,
    icon: <PillScannerIcon
      pillColor='var(--color-neon-green)'
      size={70}
      scale={3}
      pill={() => <Bomb size={48} strokeWidth={1.5} />}
    />,
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
          title: 'Game',
          artwork: (
            <img
              src="/images/avatar/rick_winner_md.png"
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
      <ScrollArea className="flex-1 min-h-0 p-2 font-mono text-xs md:p-0 md:text-sm">
        {/* Section: Shop */}
        <div className="relative flex flex-col justify-center md:my-4">

          {/* Items Container */}
          <div className="py-0 md:pt-4 md:pb-6">
            <div className="grid grid-cols-1 items-center justify-center lg:grid-cols-4">
              {/* Category Columns */}
              {Object.keys(DRAFT_SHOP_CATEGORIES).map(category => (
                <div
                  key={category}
                  className="flex flex-col gap-2 px-0 md:px-3"
                >
                  <h3 className="text-sm text-white uppercase">{category}</h3>
                  <div className="grid grid-cols-5 space-y-4 gap-2 md:gap-3 lg:grid-cols-3">
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

        </div>
      </ScrollArea>
      
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
          />
        }
      />
    </div>
  );
};
