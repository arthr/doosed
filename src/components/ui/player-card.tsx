/**
 * PlayerCard Component - Card de jogador
 * 
 * T066: Mostra avatar, nome, vidas, barra de resistência, status ativos
 */

import React from 'react';
import type { Player } from '../../types/game';
import { StatusType } from '../../types/status';

interface PlayerCardProps {
  player: Player;
  isActive?: boolean;
  compact?: boolean;
}

export function PlayerCard({ player, isActive = false, compact = false }: PlayerCardProps) {
  const resistancePercent = Math.min(100, (player.resistance / player.resistanceCap) * 100);
  const hasShield = player.activeStatuses.some((s) => s.type === StatusType.SHIELDED);
  const hasHandcuffs = player.activeStatuses.some((s) => s.type === StatusType.HANDCUFFED);

  return (
    <div
      className={`
        bg-gray-800 rounded-xs p-3 border-2
        ${isActive ? 'border-green-500 shadow-lg shadow-green-500/50' : 'border-gray-700'}
        ${player.isEliminated ? 'opacity-50' : ''}
        ${compact ? 'w-32' : 'w-48'}
        transition-all duration-200
      `}
    >
      {/* Avatar e Nome */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
          {player.avatar.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="text-white font-bold text-sm truncate">{player.name}</div>
          {player.isBot && (
            <div className="text-gray-400 text-xs">BOT - {player.botLevel}</div>
          )}
        </div>
      </div>

      {/* Vidas */}
      <div className="flex items-center gap-1 mb-2">
        <span className="text-gray-400 text-xs">Vidas:</span>
        <div className="flex gap-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${i < player.lives ? 'bg-red-500' : 'bg-gray-700'
                }`}
            />
          ))}
        </div>
        {player.isLastChance && (
          <span className="text-red-500 text-xs font-bold ml-1">ÚLTIMA CHANCE</span>
        )}
      </div>

      {/* Barra de Resistência */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Resistência</span>
          <span>
            {player.resistance}/{player.resistanceCap}
            {player.extraResistance > 0 && ` (+${player.extraResistance})`}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${resistancePercent > 60
                ? 'bg-green-500'
                : resistancePercent > 30
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            style={{ width: `${resistancePercent}%` }}
          />
        </div>
      </div>

      {/* Status Ativos */}
      {!compact && player.activeStatuses.length > 0 && (
        <div className="flex gap-1">
          {hasShield && (
            <div
              className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold"
              title="Shielded"
            >
              🛡
            </div>
          )}
          {hasHandcuffs && (
            <div
              className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold"
              title="Handcuffed"
            >
              🔒
            </div>
          )}
        </div>
      )}

      {/* Eliminado */}
      {player.isEliminated && (
        <div className="mt-2 text-center text-red-500 font-bold text-xs">ELIMINADO</div>
      )}
    </div>
  );
}

