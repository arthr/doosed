/**
 * QuestTracker Component - Rastreador de Shape Quest
 * 
 * Será usado na US2, mas criando agora para evitar dependências futuras
 */

import React from 'react';
import type { ShapeQuest } from '../../types/game';
import { QuestStatus } from '../../types/game';

interface QuestTrackerProps {
  quest: ShapeQuest | null;
}

export function QuestTracker({ quest }: QuestTrackerProps) {
  if (!quest || quest.status === QuestStatus.DISCARDED) {
    return null;
  }

  const isCompleted = quest.status === QuestStatus.COMPLETED;
  const isFailed = quest.status === QuestStatus.FAILED;

  return (
    <div
      className={`
        bg-gray-800 rounded-xs p-3 border-2
        ${isCompleted ? 'border-green-500' : isFailed ? 'border-red-500' : 'border-gray-700'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-400 text-xs font-bold">SHAPE QUEST</div>
        <div className="text-yellow-500 font-bold text-sm">+{quest.reward} coins</div>
      </div>

      {/* Sequência de shapes */}
      <div className="flex items-center gap-2 mb-2">
        {quest.sequence.map((shape, index) => (
          <React.Fragment key={index}>
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                ${index < quest.progress
                  ? 'bg-green-600 text-white'
                  : index === quest.progress
                    ? 'bg-blue-600 text-white animate-pulse'
                    : 'bg-gray-700 text-gray-400'
                }
              `}
            >
              {shape.toUpperCase().slice(0, 2)}
            </div>
            {index < quest.sequence.length - 1 && (
              <div className="text-gray-600">→</div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Status */}
      <div className="text-xs text-center">
        {isCompleted && <span className="text-green-500 font-bold">COMPLETADA!</span>}
        {isFailed && <span className="text-red-500 font-bold">FALHADA</span>}
        {quest.status === QuestStatus.ACTIVE && (
          <span className="text-gray-400">
            Progresso: {quest.progress}/{quest.sequence.length}
          </span>
        )}
      </div>
    </div>
  );
}

