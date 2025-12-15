import { useEffect, useMemo, useRef, useState } from 'react';
import type { DraftShopItem } from '@/types/draft';
import { postSystemMessage } from '@/lib/systemMessages';

const MAX_SLOTS = 10;
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
  const loadoutConfirmedRef = useRef(loadoutConfirmed);

  useEffect(() => {
    loadoutConfirmedRef.current = loadoutConfirmed;
  }, [loadoutConfirmed]);

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
      postSystemMessage('draft', `Sistema: compra negada (${item.name}).`);
      return;
    }
    setWallet(prev => prev - item.price);
    setInventory(prev => [...prev, item]);
    postSystemMessage('draft', `> Comprou ${item.name} (-${item.price}).`);
  };

  const toggleLoadout = () => {
    const next = !loadoutConfirmedRef.current;
    loadoutConfirmedRef.current = next;
    setLoadoutConfirmed(next);
    postSystemMessage('draft', next ? '> Loadout confirmado.' : '> Loadout cancelado.');
  };

  const openShop = () => {
    postSystemMessage('draft', '> Shop aberto (mock).');
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
