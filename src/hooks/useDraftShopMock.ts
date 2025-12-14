import { useEffect, useMemo, useState } from 'react';
import type { DraftShopItem } from '@/types/draft';

const MAX_SLOTS = 8;
const START_IN = 10;

type UseDraftShopMockResult = {
  wallet: number;
  timeLeft: number;
  startIn: number;
  inventory: DraftShopItem[];
  logs: string[];
  loadoutConfirmed: boolean;
  canBuy: (item: DraftShopItem) => boolean;
  buy: (item: DraftShopItem) => void;
  toggleLoadout: () => void;
  openChat: () => void;
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
  const [logs, setLogs] = useState<string[]>(() => [
    '> Draft iniciado.',
    'Sistema: escolha seus itens antes do tempo acabar.',
  ]);

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
      setLogs(prev => [...prev, `Sistema: compra negada (${item.name}).`]);
      return;
    }
    setWallet(prev => prev - item.price);
    setInventory(prev => [...prev, item]);
    setLogs(prev => [...prev, `> Comprou ${item.name} (-${item.price}).`]);
  };

  const toggleLoadout = () => {
    setLoadoutConfirmed(!loadoutConfirmed);
    setLogs(prev => [...prev, loadoutConfirmed ? '> Loadout confirmado.' : '> Loadout cancelado.']);
  };

  const openChat = () => {
    setLogs(prev => [...prev, '> Chat aberto (mock).']);
  };

  const openShop = () => {
    setLogs(prev => [...prev, '> Shop aberto (mock).']);
  };

  return {
    wallet,
    timeLeft,
    startIn,
    inventory,
    logs,
    loadoutConfirmed,
    canBuy,
    buy,
    toggleLoadout,
    openChat,
    openShop,
    maxSlots: MAX_SLOTS,
  };
}
