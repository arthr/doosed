/**
 * Bot AI - Easy Level (Paciente)
 *
 * Implementa bot conservador (Easy):
 * - Evita riscos: prefere pills reveladas SAFE (80%+ quando disponíveis)
 * - Usa itens defensivos (Pocket Pill, Shield) quando health baixo
 * - Decision tree simples
 * - Não memoriza pills ou otimiza estratégias complexas
 *
 * FR-115: Bot Easy "previsível" com critérios observáveis
 * research.md Decision 7
 */

import type { Match, Player, Pool } from '../../types/game';
import type { Item } from '../../types/item';
import { createRNG } from '../utils/random';
import type { BotAI, BotAction } from './bot-interface';
import {
  getAvailablePills,
  getRevealedSafePills,
  getRevealedHealPills,
  getUnrevealedPills,
  isPlayerInDanger,
} from './bot-interface';

// ============================================================================
// Bot Easy Implementation
// ============================================================================

export class BotEasy implements BotAI {
  /**
   * Draft: Comprar itens defensivos/informativos
   * Prioridade: Scanner > Shield > Pocket Pill
   */
  decideDraftAction(
    player: Player,
    availableItems: Item[],
    config: { budget: number }
  ): { itemId: string } | null {
    const affordableItems = availableItems
      .filter((item) => item.cost <= config.budget)
      .sort((a, b) => b.cost - a.cost); // Mais caro primeiro

    // Priorizar Scanner (informação)
    const scanner = affordableItems.find((i) => i.id === 'scanner');
    if (scanner) return { itemId: scanner.id };

    // Depois Shield (defesa)
    const shield = affordableItems.find((i) => i.id === 'shield');
    if (shield) return { itemId: shield.id };

    // Depois Pocket Pill (cura)
    const pocketPill = affordableItems.find((i) => i.id === 'pocket-pill');
    if (pocketPill) return { itemId: pocketPill.id };

    // Se nenhum desses disponível, escolher o mais barato
    if (affordableItems.length > 0) {
      return { itemId: affordableItems[affordableItems.length - 1].id };
    }

    return null; // Não comprar nada
  }

  /**
   * Turn: Jogar conservadoramente
   *
   * Lógica:
   * 1. Se health baixo E tem item defensivo → usar
   * 2. Se tem Scanner E pills não reveladas → usar
   * 3. Se tem SAFE revelada → consumir (80% chance)
   * 4. Se tem HEAL revelada E health < max → consumir
   * 5. Senão → consumir pill aleatória não revelada
   */
  decideTurnAction(
    player: Player,
    opponents: Player[],
    pool: Pool,
    match: Match,
    seed: number
  ): BotAction {
    const rng = createRNG(seed);
    const inDanger = isPlayerInDanger(player);

    // 1. Health baixo → usar item defensivo
    if (inDanger) {
      // Tentar usar Pocket Pill
      const pocketPill = player.inventory.find((slot) => slot.item?.id === 'pocket-pill');
      if (pocketPill?.item) {
        return {
          type: 'USE_ITEM',
          itemId: pocketPill.item.id,
          targetPlayerId: player.id,
        };
      }

      // Tentar usar Shield
      const shield = player.inventory.find((slot) => slot.item?.id === 'shield');
      if (shield?.item) {
        return {
          type: 'USE_ITEM',
          itemId: shield.item.id,
          targetPlayerId: player.id,
        };
      }
    }

    // 2. Tem Scanner E pills não reveladas → usar em pill aleatória
    const scanner = player.inventory.find((slot) => slot.item?.id === 'scanner');
    const unrevealedPills = getUnrevealedPills(pool);
    if (scanner?.item && unrevealedPills.length > 0) {
      const targetPill = rng.choice(unrevealedPills);
      return {
        type: 'USE_ITEM',
        itemId: scanner.item.id,
        targetPillId: targetPill.id,
      };
    }

    // 3. Pills reveladas SAFE → consumir (80% chance)
    const safePills = getRevealedSafePills(pool);
    if (safePills.length > 0 && rng.random() < 0.8) {
      const chosenPill = rng.choice(safePills);
      return {
        type: 'CONSUME_PILL',
        pillId: chosenPill.id,
      };
    }

    // 4. Pills reveladas HEAL E health < max → consumir
    const healPills = getRevealedHealPills(pool);
    if (healPills.length > 0 && player.resistance < player.resistanceCap) {
      const chosenPill = rng.choice(healPills);
      return {
        type: 'CONSUME_PILL',
        pillId: chosenPill.id,
      };
    }

    // 5. Consumir pill aleatória (não revelada preferencial)
    const availablePills = getAvailablePills(pool);
    if (availablePills.length === 0) {
      // Não há pills disponíveis (não deveria acontecer)
      return { type: 'END_TURN' };
    }

    // Preferir não reveladas (60% chance) se existirem
    if (unrevealedPills.length > 0 && rng.random() < 0.6) {
      const chosenPill = rng.choice(unrevealedPills);
      return {
        type: 'CONSUME_PILL',
        pillId: chosenPill.id,
      };
    }

    // Consumir qualquer pill disponível
    const chosenPill = rng.choice(availablePills);
    return {
      type: 'CONSUME_PILL',
      pillId: chosenPill.id,
    };
  }

  /**
   * Shopping: Comprar boosts defensivos
   * Prioridade: 1-Up (se lives < 3) > Reboot (se resistance < 6) > Scanner-2X
   */
  decideShoppingAction(
    player: Player,
    availableBoosts: Item[],
    config: { budget: number }
  ): { itemId: string } | null {
    const affordableBoosts = availableBoosts
      .filter((item) => item.cost <= config.budget)
      .sort((a, b) => b.cost - a.cost);

    // Priorizar 1-Up se lives < 3
    if (player.lives < 3) {
      const oneUp = affordableBoosts.find((i) => i.id === 'one-up');
      if (oneUp) return { itemId: oneUp.id };
    }

    // Depois Reboot se resistance < max
    if (player.resistance < player.resistanceCap) {
      const reboot = affordableBoosts.find((i) => i.id === 'reboot');
      if (reboot) return { itemId: reboot.id };
    }

    // Depois Scanner-2X (informação)
    const scanner2x = affordableBoosts.find((i) => i.id === 'scanner-2x');
    if (scanner2x) return { itemId: scanner2x.id };

    return null; // Não comprar nada
  }
}

// ============================================================================
// Export Instance
// ============================================================================

export const botEasy = new BotEasy();

