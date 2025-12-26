/**
 * useItemActions - Hook especializado para uso de itens
 * 
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Gerenciar uso de itens do inventário
 */

import { useCallback } from 'react';
import { usePlayerStore } from '../stores/playerStore';
import { useEventLogger } from './useEventLogger';
import type { Player, Item } from '../types/game';

export function useItemActions() {
  const { players } = usePlayerStore();
  const { logItem } = useEventLogger();

  /**
   * Encontra item no inventário do player
   */
  const findItemInInventory = useCallback(
    (playerId: string, itemId: string) => {
      const player = players.find((p) => p.id === playerId);
      if (!player) return null;

      const slot = player.inventory.find((s) => s.item?.id === itemId);
      return slot && slot.item ? { player, slot, item: slot.item } : null;
    },
    [players]
  );

  /**
   * Usa item do inventário
   * TODO: Implementar efeitos de itens (US2)
   */
  const useItem = useCallback(
    (player: Player, item: Item) => {
      logItem(`${player.name} usou ${item.name}`, {
        playerId: player.id,
        itemId: item.id,
      });

      // TODO US2: Implementar efeitos de itens
      // - Scanner: revelar tipo de pill
      // - Inverter: inverter efeito de pill
      // - Pocket Pill: consumir pill SAFE garantida
      // - etc.
    },
    [logItem]
  );

  /**
   * Handler para uso de item via UI (wrapper com validações)
   */
  const handleItemClick = useCallback(
    (playerId: string, itemId: string) => {
      const result = findItemInInventory(playerId, itemId);
      
      if (!result) {
        console.warn('[useItemActions] Item não encontrado no inventário', { playerId, itemId });
        return;
      }

      useItem(result.player, result.item);
    },
    [findItemInInventory, useItem]
  );

  return {
    findItemInInventory,
    useItem,
    handleItemClick,
  };
}

