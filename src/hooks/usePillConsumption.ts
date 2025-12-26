/**
 * usePillConsumption - Hook especializado para consumo de pills
 *
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Gerenciar consumo de pills e aplicacao de efeitos
 */

import { useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useEventLogger } from './useEventLogger';
import { resolvePillEffect } from '../core/effect-resolver';
import type { Player, Pill } from '../types/game';

export function usePillConsumption() {
  // Usar useGameStore com seletores para performance
  const consumePillAction = useGameStore((state) => state.consumePill);
  const updatePlayer = useGameStore((state) => state.updatePlayer);
  const applyDamage = useGameStore((state) => state.applyDamage);
  const applyHeal = useGameStore((state) => state.applyHeal);
  const getAllPlayers = useGameStore((state) => state.getAllPlayers);
  const getPool = useGameStore((state) => state.getPool);

  const { logPill } = useEventLogger();

  /**
   * Consome pill e aplica efeitos ao player
   */
  const consumePill = useCallback(
    (pill: Pill, player: Player): void => {
      // Remove pill do pool (action do poolSlice)
      consumePillAction(pill.id);

      // Resolve efeito da pill
      const effect = resolvePillEffect(pill, player);

      // Aplica efeito baseado no type
      switch (effect.type) {
        case 'HEAL':
          applyHeal(player.id, Math.abs(effect.value));
          break;
        case 'DAMAGE':
          applyDamage(player.id, Math.abs(effect.value));
          break;
        case 'LIFE':
          updatePlayer(player.id, (p) => {
            p.lives = Math.min(3, p.lives + Math.abs(effect.value));
          });
          break;
      }

      // Log evento
      logPill(`${player.name} consumiu pill ${pill.shape} (${pill.type})`, {
        playerId: player.id,
        pillId: pill.id,
        pillType: pill.type,
        effect,
      });
    },
    [consumePillAction, applyDamage, applyHeal, updatePlayer, logPill]
  );

  /**
   * Handler para consumo de pill via UI (wrapper com validacoes)
   */
  const handlePillClick = useCallback(
    (pillId: string, playerId: string) => {
      const pool = getPool();
      const players = getAllPlayers();

      if (!pool) return;

      const pill = pool.pills.find((p) => p.id === pillId);
      const player = players.find((p) => p.id === playerId);

      if (!pill || !player) return;

      consumePill(pill, player);
    },
    [getPool, getAllPlayers, consumePill]
  );

  return {
    consumePill,
    handlePillClick,
  };
}
