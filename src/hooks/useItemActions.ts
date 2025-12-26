/**
 * useItemActions - Hook especializado para uso de itens
 *
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Gerenciar uso de itens do inventario
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useEventLogger } from './useEventLogger';
import type { Player, Item } from '../types/game';

export function useItemActions() {
  // Usar useGameStore com seletores para performance
  const getPlayer = useGameStore((state) => state.getPlayer);
  const getAllPlayers = useGameStore((state) => state.getAllPlayers);

  const { logItem } = useEventLogger();

  /**
   * Encontra item no inventario do player
   */
  const findItemInInventory = useCallback(
    (playerId: string, itemId: string) => {
      const player = getPlayer(playerId);
      if (!player) return null;

      const slot = player.inventory.find((s) => s.item?.id === itemId);
      return slot && slot.item ? { player, slot, item: slot.item } : null;
    },
    [getPlayer]
  );

  /**
   * Usa item do inventario
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
   * Handler para uso de item via UI (wrapper com validacoes)
   */
  const handleItemClick = useCallback(
    (playerId: string, itemId: string) => {
      const result = findItemInInventory(playerId, itemId);

      if (!result) {
        console.warn('[useItemActions] Item nao encontrado no inventario', {
          playerId,
          itemId,
        });
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
