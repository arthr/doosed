/**
 * useTurnTimer - Hook para gerenciar timer de turno
 * 
 * T087: Wire turn timer expiration
 * 
 * NOTA: Use key prop no componente pai para resetar o timer automaticamente
 * quando o turno mudar (ex: key={activePlayerId})
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTurnTimerOptions {
  duration: number; // duração em segundos
  onTimeout: () => void;
  autoStart?: boolean;
}

export function useTurnTimer({ duration, onTimeout, autoStart = true }: UseTurnTimerOptions) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const onTimeoutRef = useRef(onTimeout);

  // Mantém ref atualizada
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Countdown - único efeito necessário
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          // Timeout assíncrono para evitar problemas de render
          setTimeout(() => onTimeoutRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setTimeRemaining(duration);
    setIsRunning(true);
  }, [duration]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  return {
    timeRemaining,
    isRunning,
    resetTimer,
    stopTimer,
    startTimer,
  };
}
