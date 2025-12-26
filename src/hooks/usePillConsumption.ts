/**
 * usePillConsumption - Hook especializado para consumo de pills
 * 
 * SOLID-S Compliant: Single Responsibility
 * Responsabilidade: Gerenciar consumo de pills e aplicação de efeitos
 */

import { useCallback } from 'react';
import { useMatchStore } from '../stores/matchStore';
import { usePlayerStore } from '../stores/playerStore';
import { useEventLogger } from './useEventLogger';
import { resolvePillEffect } from '../core/effect-resolver';
import type { Player, Pill } from '../types/game';

export function usePillConsumption() {
  const { updateMatch } = useMatchStore();
  const { players, updatePlayer, applyDamage, applyHeal } = usePlayerStore();
  const { logPill } = useEventLogger();

  /**
   * Consome pill e aplica efeitos ao player
   */
  const consumePill = useCallback(
    (pill: Pill, player: Player): void => {
      // Remove pill do pool (mutação via Immer no matchStore)
      updateMatch((m) => {
        if (!m.currentRound) return;
        const pillIndex = m.currentRound.pool.pills.findIndex((p) => p.id === pill.id);
        if (pillIndex !== -1) {
          m.currentRound.pool.pills.splice(pillIndex, 1);
          m.currentRound.pool.size = m.currentRound.pool.pills.length;
        }
      });

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
    [updateMatch, applyDamage, applyHeal, updatePlayer, logPill]
  );

  /**
   * Handler para consumo de pill via UI (wrapper com validações)
   */
  const handlePillClick = useCallback(
    (pillId: string, playerId: string) => {
      const { match } = useMatchStore.getState();
      const pool = match?.currentRound?.pool;
      
      if (!pool) return;

      const pill = pool.pills.find((p) => p.id === pillId);
      const player = players.find((p) => p.id === playerId);

      if (!pill || !player) return;

      consumePill(pill, player);
    },
    [players, consumePill]
  );

  return {
    consumePill,
    handlePillClick,
  };
}

