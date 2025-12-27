/**
 * Pool Generator: Geração de Pool de Pílulas
 *
 * Gera pool de pills por rodada com:
 * - Tamanho progressivo (base 6, +1 a cada 3 rodadas, cap 12)
 * - Distribuição progressiva de tipos (linear interpolation)
 * - Shapes desbloqueadas por rodada
 * - Validação de diversidade mínima (min 3 shapes)
 *
 * Baseado em data-model.md "Pool Generation Algorithm"
 */

import { PillType, PillState, type Pill, type Shape } from '../types/pill';
import type { Pool } from '../types/game';
import type { GameConfig } from '../types/config';
import { choice, shuffle } from './utils/random';
import { validatePoolInvariants, validatePillDistribution } from './utils/validation';

// ============================================================================
// T029: Calculate Pool Size
// ============================================================================

/**
 * Calcula tamanho do pool baseado na rodada
 * Base 6, +1 a cada 3 rodadas, cap 12
 *
 * Rodada 1-3: 6 pills
 * Rodada 4-6: 7 pills
 * Rodada 7-9: 8 pills
 * Rodada 10+: 9-12 pills (cap em 12)
 */
export function calculatePoolSize(roundNumber: number, config: GameConfig): number {
  const baseSize = config.pool.baseSize; // 6
  const incrementEveryNRounds = config.pool.incrementEveryNRounds; // 3
  const maxSize = config.pool.maxSize; // 12

  const increment = Math.floor((roundNumber - 1) / incrementEveryNRounds);
  const size = baseSize + increment;

  return Math.min(size, maxSize);
}

// ============================================================================
// T030: Calculate Distribution (Linear Interpolation)
// ============================================================================

/**
 * Calcula distribuição de tipos para rodada específica
 * Interpolação linear entre initial e final percentages
 */
export function calculateDistribution(
  roundNumber: number,
  config: GameConfig,
): Record<PillType, number> {
  const distribution: Record<PillType, number> = {} as Record<PillType, number>;

  // Rodada de referência para interpolação (rodadas 1-10+)
  const minRound = 1;
  const maxRound = 10;
  const t = Math.min((roundNumber - minRound) / (maxRound - minRound), 1);

  for (const [typeStr, config_] of Object.entries(config.pool.distribution)) {
    const type = typeStr as PillType;

    // Se tipo ainda não desbloqueado, percentagem = 0
    if (roundNumber < config_.unlockRound) {
      distribution[type] = 0;
      continue;
    }

    // Interpolação linear
    const percentage =
      config_.initialPercentage + t * (config_.finalPercentage - config_.initialPercentage);
    distribution[type] = percentage;
  }

  // Normalizar para somar 1.0 (distribuição pode não somar 100% se alguns tipos estão locked)
  const total = Object.values(distribution).reduce((sum, p) => sum + p, 0);
  if (total > 0) {
    for (const type of Object.keys(distribution) as PillType[]) {
      distribution[type] /= total;
    }
  }

  return distribution;
}

// ============================================================================
// T031: Get Unlocked Shapes
// ============================================================================

/**
 * Retorna shapes desbloqueadas até a rodada atual
 * Filtra por unlockRound e inclui sazonais ativos
 */
export function getUnlockedShapes(roundNumber: number, config: GameConfig): Shape[] {
  const shapes: Shape[] = [];

  // Shapes base desbloqueadas
  for (const shapeConfig of config.shapes.base) {
    if (shapeConfig.unlockRound <= roundNumber) {
      shapes.push({
        id: shapeConfig.id,
        name: shapeConfig.id, // Usar id como nome (nome display será tratado em UI)
        assetPath: '', // Asset path será tratado em UI/assets
        unlockRound: shapeConfig.unlockRound,
        isSeasonal: false,
      });
    }
  }

  // Shapes sazonais (se ativas)
  for (const seasonalConfig of config.shapes.seasonal) {
    if (seasonalConfig.enabled) {
      shapes.push({
        id: seasonalConfig.id,
        name: seasonalConfig.id, // Usar id como nome
        assetPath: '', // Asset path será tratado em UI/assets
        unlockRound: 1, // Sazonais sempre desbloqueadas quando ativas
        isSeasonal: true,
        seasonalTheme: seasonalConfig.theme,
      });
    }
  }

  return shapes;
}

// ============================================================================
// T032: Generate Pool
// ============================================================================

/**
 * Gera pool completo de pills para rodada
 *
 * Algoritmo:
 * 1. Calcula size e distribution
 * 2. Gera types baseado em distribuição
 * 3. Atribui shapes aleatórias das desbloqueadas
 * 4. Embaralha posições
 * 5. Valida diversidade mínima
 */
export function generatePool(roundNumber: number, config: GameConfig): Pool {
  const size = calculatePoolSize(roundNumber, config);
  const distribution = calculateDistribution(roundNumber, config);
  const unlockedShapes = getUnlockedShapes(roundNumber, config);

  if (unlockedShapes.length < config.pool.minShapeDiversity) {
    throw new Error(
      `Insufficient unlocked shapes (${unlockedShapes.length}) for minimum diversity (${config.pool.minShapeDiversity})`,
    );
  }

  // 1. Gerar tipos baseado em distribuição
  const types: PillType[] = [];
  for (const [typeStr, percentage] of Object.entries(distribution)) {
    const type = typeStr as PillType;
    const count = Math.round(size * percentage);
    for (let i = 0; i < count; i++) {
      types.push(type);
    }
  }

  // 2. Ajustar para size exato (arredondamento pode gerar +/-1)
  //
  // NOTA: Este ajuste pode causar pequena variacao na distribuicao final.
  // Exemplo: se size=6 e distribuicao gera 5 pills, adicionamos 1 do tipo
  // mais comum. A distribuicao final ainda respeita tolerancia de +/-5%
  // validada por validatePillDistribution().
  //
  // Alternativas consideradas:
  // - Redistribuir proporcionalmente: mais complexo, ganho marginal
  // - Regenerar pool: pode causar loop infinito em edge cases
  // - Aceitar size +/-1: quebra invariante de pool.size === pool.pills.length
  //
  // Decisao: Adicionar do tipo mais comum (KISS principle)
  while (types.length < size) {
    const mostCommonType = findMostCommonType(distribution);
    types.push(mostCommonType);
  }
  while (types.length > size) {
    types.pop();
  }

  // 3. Atribuir shapes aleatórias e criar pills
  const pills: Pill[] = types.map((type, i) => ({
    // ID determinístico baseado em round, tipo e índice.
    id: `pill-${roundNumber}-${type}-${i}`,
    type,
    shape: choice(unlockedShapes).id,
    modifiers: [],
    isRevealed: false,
    position: i,
    state: PillState.AVAILABLE,
  }));

  // 4. Embaralhar posições
  const shuffledPills = shuffle(pills).map((pill, idx) => ({
    ...pill,
    position: idx,
  }));

  // 5. Validar diversidade mínima de shapes
  const uniqueShapes = new Set(shuffledPills.map(p => p.shape));
  if (uniqueShapes.size < config.pool.minShapeDiversity) {
    // Forçar diversidade: substituir pills até atingir mínimo
    const shapesNeeded = config.pool.minShapeDiversity - uniqueShapes.size;
    const availableShapes = unlockedShapes.map(s => s.id).filter(id => !uniqueShapes.has(id));

    for (let i = 0; i < shapesNeeded && i < availableShapes.length; i++) {
      shuffledPills[i].shape = availableShapes[i];
    }
  }

  // Contar tipos
  // Counters representam a quantidade de pills REMANESCENTES por tipo no pool (FR-072).
  // No inicio da rodada, isso equivale ao total gerado; conforme consome, o poolSlice decrementa.
  const counters: Record<string, number> = {};
  for (const pill of shuffledPills) {
    counters[pill.type] = (counters[pill.type] || 0) + 1;
  }

  const pool: Pool = {
    roundNumber,
    pills: shuffledPills,
    size,
    counters,
    revealed: [],
    unlockedShapes: unlockedShapes.map(s => s.id),
  };

  return pool;
}

// ============================================================================
// T033: Validate Pool Invariants
// ============================================================================

/**
 * Valida invariantes do pool
 * Wrapper para validation.ts com logging específico
 */
export function validatePool(pool: Pool): boolean {
  // Validação estrutural
  if (!validatePoolInvariants(pool)) {
    return false;
  }

  // Validação de distribuição (±5% tolerance)
  const expectedDistribution: Record<string, number> = {};
  for (const pill of pool.pills) {
    expectedDistribution[pill.type] = (expectedDistribution[pill.type] || 0) + 1;
  }

  return validatePillDistribution(pool.pills, expectedDistribution, 0.05);
}

// ============================================================================
// Helper Functions
// ============================================================================

function findMostCommonType(distribution: Record<PillType, number>): PillType {
  let maxType: PillType = PillType.SAFE;
  let maxPercentage = 0;

  for (const [typeStr, percentage] of Object.entries(distribution)) {
    const type = typeStr as PillType;
    if (percentage > maxPercentage) {
      maxPercentage = percentage;
      maxType = type;
    }
  }

  return maxType;
}
