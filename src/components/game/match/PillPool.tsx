/**
 * PillPool Component - Grid de pílulas
 * 
 * T070: Renderiza grid de pills usando PillDisplay, handle click, mostra counters
 */

import React from 'react';
import type { Pool } from '../../../types/game';
import { PillDisplay } from '../../ui/pill-display';
import { PillType } from '../../../types/pill';

interface PillPoolProps {
  pool: Pool | null;
  onPillClick?: (pillId: string) => void;
  isTargeting?: boolean;
  disabled?: boolean;
}

const PILL_TYPE_LABELS: Record<PillType, string> = {
  [PillType.SAFE]: 'SAFE',
  [PillType.DMG_LOW]: 'Dano -2',
  [PillType.DMG_HIGH]: 'Dano -4',
  [PillType.HEAL]: 'Cura +2',
  [PillType.FATAL]: 'FATAL',
  [PillType.LIFE]: '+1 Vida',
};

export function PillPool({ pool, onPillClick, isTargeting = false, disabled = false }: PillPoolProps) {
  if (!pool || pool.pills.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xs p-8 border border-gray-700">
        <div className="text-gray-500 text-center">Nenhuma pill disponível</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xs p-4 border border-gray-700">
      {/* Header com contador de pills */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-white font-bold">
          Pool - Rodada {pool.roundNumber}
        </div>
        <div className="text-gray-400 text-sm">
          {pool.size} {pool.size === 1 ? 'pill' : 'pills'} restantes
        </div>
      </div>

      {/* Grid de pills */}
      <div className="grid grid-cols-6 gap-3 mb-4">
        {pool.pills.map((pill) => (
          <PillDisplay
            key={pill.id}
            pill={pill}
            onClick={() => onPillClick?.(pill.id)}
            isClickable={!isTargeting && !disabled}
            size="md"
          />
        ))}
      </div>

      {/* Contadores por tipo (revealed) */}
      {pool.revealed.length > 0 && (
        <div className="border-t border-gray-700 pt-3">
          <div className="text-gray-400 text-xs font-bold mb-2">Pills Reveladas:</div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(pool.counters).map(([type, count]) => (
              count > 0 && (
                <div
                  key={type}
                  className="flex items-center justify-between bg-gray-900 rounded px-2 py-1"
                >
                  <span className="text-gray-300 text-xs">
                    {PILL_TYPE_LABELS[type as PillType]}
                  </span>
                  <span className="text-white font-bold text-sm">{count}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

