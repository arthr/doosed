/**
 * MatchHeader - Header da tela de partida
 * 
 * Componente especifico do MatchScreen
 * Mostra informacoes da rodada, timer e botao de sair
 */

import React from 'react';
import { TimerDisplay } from '../../ui/timer-display';
import { Button } from '../../ui/button';

interface MatchHeaderProps {
  roundNumber: number;
  activePlayerName?: string;
  isHumanTurn: boolean;
  timeRemaining: number;
  turnTime: number;
  isOpponentBot: boolean;
  onLeave: () => void;
}

export function MatchHeader({
  roundNumber,
  activePlayerName,
  isHumanTurn,
  timeRemaining,
  turnTime,
  isOpponentBot,
  onLeave,
}: MatchHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold text-green-500">Match em Andamento</h1>
        <p className="text-gray-400 text-sm">
          Rodada {roundNumber} | Turno: {activePlayerName || '...'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {isHumanTurn && (
          <TimerDisplay
            seconds={timeRemaining}
            maxSeconds={turnTime}
            label="Seu Turno"
            size="md"
          />
        )}
        {!isHumanTurn && isOpponentBot && (
          <div className="text-yellow-500 text-sm font-bold animate-pulse">
            Bot pensando...
          </div>
        )}
        <Button onClick={onLeave} variant="danger" size="sm">
          Sair
        </Button>
      </div>
    </div>
  );
}

