/**
 * PillDisplay Component - Exibe uma pílula
 * 
 * T065: Mostra shape, tipo revelado, modifiers (Inverted/Doubled)
 */

import React from 'react';
import type { Pill } from '../../types/game';
import { PillType, PillModifier } from '../../types/pill';

interface PillDisplayProps {
  pill: Pill;
  onClick?: () => void;
  isClickable?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PILL_TYPE_COLORS: Record<PillType, string> = {
  [PillType.SAFE]: 'bg-blue-500',
  [PillType.DMG_LOW]: 'bg-yellow-500',
  [PillType.DMG_HIGH]: 'bg-orange-500',
  [PillType.HEAL]: 'bg-green-500',
  [PillType.FATAL]: 'bg-red-600',
  [PillType.LIFE]: 'bg-purple-500',
};

const PILL_TYPE_LABELS: Record<PillType, string> = {
  [PillType.SAFE]: 'SAFE',
  [PillType.DMG_LOW]: '-2',
  [PillType.DMG_HIGH]: '-4',
  [PillType.HEAL]: '+2',
  [PillType.FATAL]: 'FATAL',
  [PillType.LIFE]: '+1 VIDA',
};

export function PillDisplay({ pill, onClick, isClickable = false, size = 'md' }: PillDisplayProps) {
  const sizeStyles = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base',
  };

  const hasInverted = pill.modifiers.includes(PillModifier.INVERTED);
  const hasDoubled = pill.modifiers.includes(PillModifier.DOUBLED);

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        relative flex flex-col items-center justify-center rounded-full
        ${sizeStyles[size]}
        ${pill.isRevealed ? PILL_TYPE_COLORS[pill.type] : 'bg-gray-700'}
        ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}
        transition-all duration-200
      `}
    >
      {/* Shape (emoji ou texto) */}
      <div className="text-white font-bold text-center">
        {pill.shape.toUpperCase()}
      </div>

      {/* Tipo revelado */}
      {pill.isRevealed && (
        <div className="text-white text-xs font-bold mt-1">
          {PILL_TYPE_LABELS[pill.type]}
        </div>
      )}

      {/* Modifiers */}
      {(hasInverted || hasDoubled) && (
        <div className="absolute -top-1 -right-1 flex flex-col gap-0.5">
          {hasInverted && (
            <div
              className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
              title="Inverted"
            >
              ↕
            </div>
          )}
          {hasDoubled && (
            <div
              className="w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center text-white text-xs font-bold"
              title="Doubled"
            >
              2x
            </div>
          )}
        </div>
      )}

      {/* Estado consumido */}
      {pill.state === 'CONSUMED' && (
        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">X</span>
        </div>
      )}
    </div>
  );
}

