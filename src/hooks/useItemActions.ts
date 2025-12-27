/**
 * useItemActions - Hook especializado para uso de itens
 *
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Gerenciar uso de itens do inventario
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useEventLogger } from './useEventLogger';
import { useItem as applyItemCore } from '../core/inventory-manager';
import type { Status } from '../types/status';

export function useItemActions() {
  // Usar useGameStore com seletores para performance
  const getPlayer = useGameStore(state => state.getPlayer);
  const getPool = useGameStore(state => state.getPool);
  const revealPill = useGameStore(state => state.revealPill);
  const discardPill = useGameStore(state => state.discardPill);
  const applyModifierToPill = useGameStore(state => state.applyModifierToPill);
  const shufflePool = useGameStore(state => state.shufflePool);
  const applyStatus = useGameStore(state => state.applyStatus);
  const removeFromInventory = useGameStore(state => state.removeFromInventory);
  const applyHeal = useGameStore(state => state.applyHeal);

  const { logItem } = useEventLogger();

  /**
   * Encontra item no inventario do player
   */
  const findItemInInventory = useCallback(
    (playerId: string, itemId: string) => {
      const player = getPlayer(playerId);
      if (!player) return null;

      const slot = player.inventory.find(s => s.item?.id === itemId);
      return slot && slot.item ? { player, slot, item: slot.item } : null;
    },
    [getPlayer],
  );

  /**
   * Usa item do inventario (aplica efeitos e consome o item)
   *
   * Nota: Para humano, se item exigir alvo e nao houver UI de targeting ainda,
   * esta funcao vai falhar (via inventory-manager) e NAO consumira o item.
   */
  const handleItemUse = useCallback(
    (
      playerId: string,
      itemId: string,
      targets?: { targetPillId?: string; targetShape?: string; targetPlayerId?: string },
    ) => {
      const result = findItemInInventory(playerId, itemId);

      if (!result) {
        console.warn('[useItemActions] Item nao encontrado no inventario', {
          playerId,
          itemId,
        });
        return;
      }

      const pool = getPool();
      if (!pool) {
        console.warn('[useItemActions] Pool nao encontrado', { playerId, itemId });
        return;
      }

      const useResult = applyItemCore(
        result.item,
        result.player,
        pool,
        targets?.targetPillId,
        targets?.targetShape,
        targets?.targetPlayerId,
      );

      if (!useResult.success) {
        console.warn('[useItemActions] Uso de item falhou', {
          playerId,
          itemId,
          reason: useResult.reason,
          targets,
        });
        return;
      }

      // Aplica efeitos no estado via actions do store
      for (const effect of useResult.effects) {
        switch (effect.type) {
          case 'REVEAL_PILL':
            if (effect.targetPillId) revealPill(effect.targetPillId);
            break;

          case 'REVEAL_SHAPE':
            if (effect.targetShape) {
              for (const pill of pool.pills) {
                if (pill.shape === effect.targetShape) {
                  revealPill(pill.id);
                }
              }
            }
            break;

          case 'ADD_MODIFIER':
            if (effect.targetPillId && effect.modifier) {
              applyModifierToPill(effect.targetPillId, effect.modifier);
            }
            break;

          case 'SHUFFLE_POOL':
            shufflePool();
            break;

          case 'DISCARD_PILL':
            if (effect.targetPillId) discardPill(effect.targetPillId);
            break;

          case 'POCKET_PILL':
            // FR-031: Pocket Pill restaura +4 Resistência imediatamente
            applyHeal(playerId, 4);
            break;

          case 'APPLY_STATUS':
            if (effect.statusType && effect.targetPlayerId) {
              const status: Status = {
                id: `status-${effect.statusType}-${Date.now()}`,
                type: effect.statusType,
                duration: 1,
                appliedAt: Date.now(),
                playerId: effect.targetPlayerId,
              };
              applyStatus(effect.targetPlayerId, status);
            }
            break;
        }
      }

      // FR-054: item usado deve ser consumido (decrementa stack ou remove)
      removeFromInventory(playerId, itemId);

      // Log
      logItem(`${result.player.name} usou ${result.item.name}`, {
        playerId,
        itemId,
        targets,
        effects: useResult.effects,
      });
    },
    [
      findItemInInventory,
      getPool,
      revealPill,
      discardPill,
      applyModifierToPill,
      shufflePool,
      applyStatus,
      removeFromInventory,
      applyHeal,
      logItem,
    ],
  );

  /**
   * Handler para uso de item via UI (wrapper com validacoes)
   */
  const handleItemClick = useCallback(
    (playerId: string, itemId: string) => {
      handleItemUse(playerId, itemId);
    },
    [handleItemUse],
  );

  return {
    findItemInInventory,
    handleItemUse,
    handleItemClick,
  };
}
