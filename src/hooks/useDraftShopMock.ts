import { useEffect, useMemo, useState } from 'react';
import type { DraftShopItem } from '../types/draft';

const MAX_SLOTS = 8;

type UseDraftShopMockResult = {
  wallet: number;
  timeLeft: number;
  inventory: DraftShopItem[];
  logs: string[];
  canBuy: (item: DraftShopItem) => boolean;
  buy: (item: DraftShopItem) => void;
  confirmLoadout: () => void;
  openChat: () => void;
  maxSlots: number;
};

export function useDraftShopMock(initialWallet = 150, initialTime = 15): UseDraftShopMockResult {
  const [wallet, setWallet] = useState(initialWallet);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [inventory, setInventory] = useState<DraftShopItem[]>([]);
  const [logs, setLogs] = useState<string[]>(() => [
    '> Draft iniciado.',
    'Sistema: escolha seus itens antes do tempo acabar.',
  ]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(timerId);
  }, [timeLeft]);

  const canBuy = useMemo(() => {
    return (item: DraftShopItem) => wallet >= item.price && inventory.length < MAX_SLOTS && timeLeft > 0;
  }, [inventory.length, timeLeft, wallet]);

  const buy = (item: DraftShopItem) => {
    if (!canBuy(item)) {
      setLogs((prev) => [...prev, `Sistema: compra negada (${item.name}).`]);
      return;
    }
    setWallet((prev) => prev - item.price);
    setInventory((prev) => [...prev, item]);
    setLogs((prev) => [...prev, `> Comprou ${item.name} (-${item.price}).`]);
  };

  const confirmLoadout = () => {
    setLogs((prev) => [...prev, '> Loadout confirmado.']);
  };

  const openChat = () => {
    setLogs((prev) => [...prev, '> Chat aberto (mock).']);
  };

  return {
    wallet,
    timeLeft,
    inventory,
    logs,
    canBuy,
    buy,
    confirmLoadout,
    openChat,
    maxSlots: MAX_SLOTS,
  };
}


