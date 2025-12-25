/**
 * useEventLogger - Hook para logging estruturado de eventos
 * 
 * T091: Add event logging throughout match flow
 */

import { useCallback } from 'react';
import { useLogStore, type LogCategory, type LogSeverity } from '../stores/logStore';

export function useEventLogger() {
  const { addLog } = useLogStore();

  const logEvent = useCallback(
    (category: LogCategory, severity: LogSeverity, message: string, context?: Record<string, unknown>) => {
      addLog(category, severity, message, context);
    },
    [addLog]
  );

  // Helpers para cada categoria
  const logTurn = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('turn', 'info', message, context);
    },
    [logEvent]
  );

  const logItem = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('item', 'info', message, context);
    },
    [logEvent]
  );

  const logPill = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('pill', 'info', message, context);
    },
    [logEvent]
  );

  const logStatus = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('status', 'info', message, context);
    },
    [logEvent]
  );

  const logBotDecision = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('bot_decision', 'debug', message, context);
    },
    [logEvent]
  );

  const logPhase = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('phase', 'info', message, context);
    },
    [logEvent]
  );

  const logRound = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('round', 'info', message, context);
    },
    [logEvent]
  );

  const logMatch = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('match', 'info', message, context);
    },
    [logEvent]
  );

  const logError = useCallback(
    (message: string, context?: Record<string, unknown>) => {
      logEvent('error', 'error', message, context);
    },
    [logEvent]
  );

  return {
    logEvent,
    logTurn,
    logItem,
    logPill,
    logStatus,
    logBotDecision,
    logPhase,
    logRound,
    logMatch,
    logError,
  };
}

