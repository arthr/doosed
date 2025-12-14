import { useEffect, useMemo, useState } from 'react';
import type { DraftShopItem } from '@/types/draft';
import { chatActions } from '@/store/useChatStore';

const MAX_SLOTS = 8;
const START_IN = 10;

type UseDraftShopMockResult = {
  wallet: number;
  timeLeft: number;
  startIn: number;
  inventory: DraftShopItem[];
  loadoutConfirmed: boolean;
  canBuy: (item: DraftShopItem) => boolean;
  buy: (item: DraftShopItem) => void;
  toggleLoadout: () => void;
  openShop: () => void;
  maxSlots: number;
};

export function useDraftShopMock(
  initialWallet = 150,
  initialTime = 15,
  initialStartIn = START_IN,
): UseDraftShopMockResult {
  const [wallet, setWallet] = useState(initialWallet);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [startIn, setStartIn] = useState(initialStartIn);
  const [inventory, setInventory] = useState<DraftShopItem[]>([]);
  const [loadoutConfirmed, setLoadoutConfirmed] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setStartIn(initialStartIn);
      return;
    }
    const timerId = window.setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => window.clearTimeout(timerId);
  }, [timeLeft, initialStartIn]);

  useEffect(() => {
    if (startIn <= 0) return;
    const timerId = window.setTimeout(() => setStartIn(t => t - 1), 1000);
    return () => window.clearTimeout(timerId);
  }, [startIn]);

  const canBuy = useMemo(() => {
    return (item: DraftShopItem) =>
      wallet >= item.price && inventory.length < MAX_SLOTS && timeLeft > 0;
  }, [inventory.length, timeLeft, wallet]);

  const buy = (item: DraftShopItem) => {
    if (!canBuy(item)) {
      chatActions.addSystemMessage(`Sistema: compra negada (${item.name}).`, 'draft');
      return;
    }
    setWallet(prev => prev - item.price);
    setInventory(prev => [...prev, item]);
    chatActions.addSystemMessage(`> Comprou ${item.name} (-${item.price}).`, 'draft');
  };

  const toggleLoadout = () => {
    setLoadoutConfirmed(prev => {
      const next = !prev;
      chatActions.addSystemMessage(
        next ? '> Loadout confirmado.' : '> Loadout cancelado.',
        'draft',
      );
      return next;
    });
  };

  const openShop = () => {
    chatActions.addSystemMessage('> Shop aberto (mock).', 'draft');
  };

  return {
    wallet,
    timeLeft,
    startIn,
    inventory,
    loadoutConfirmed,
    canBuy,
    buy,
    toggleLoadout,
    openShop,
    maxSlots: MAX_SLOTS,
  };
}
