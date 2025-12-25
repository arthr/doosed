/**
 * Types: Status (Buff/Debuff)
 *
 * Baseado em data-model.md (Status)
 */

// ============================================================================
// Enums
// ============================================================================

export enum StatusType {
  SHIELDED = 'SHIELDED', // Imune a dano por 1 Rodada
  HANDCUFFED = 'HANDCUFFED', // Perde próximo turno
}

// ============================================================================
// Interfaces
// ============================================================================

export interface Status {
  id: string; // UUID
  type: StatusType; // Tipo do status
  duration: number; // Duração em Rodadas (> 0)
  appliedAt: number; // Timestamp (quando foi aplicado)
  playerId: string; // Jogador afetado (FK)
}

// ============================================================================
// Type Guards
// ============================================================================

export function isStatusType(value: string): value is StatusType {
  return Object.values(StatusType).includes(value as StatusType);
}
