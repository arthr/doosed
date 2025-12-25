/**
 * Log Store - Gerencia logs estruturados do jogo
 * 
 * Responsabilidades:
 * - Armazenar logs com timestamp, categoria, severity, mensagem
 * - Filtrar logs por categoria/severity
 * - Exportar logs (JSON)
 * 
 * T062: Zustand Store para Logs com structured logging
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type LogCategory = 
  | 'turn'
  | 'item'
  | 'pill'
  | 'status'
  | 'bot_decision'
  | 'error'
  | 'phase'
  | 'round'
  | 'match';

export type LogSeverity = 'debug' | 'info' | 'warn' | 'error';

export interface GameLog {
  id: string;
  timestamp: number;
  category: LogCategory;
  severity: LogSeverity;
  message: string;
  context?: Record<string, unknown>;
}

interface LogState {
  // Array de logs
  logs: GameLog[];

  // Actions
  addLog: (category: LogCategory, severity: LogSeverity, message: string, context?: Record<string, unknown>) => void;
  filterLogs: (filters: { category?: LogCategory; severity?: LogSeverity }) => GameLog[];
  exportLogs: () => string;
  clearLogs: () => void;
}

export const useLogStore = create<LogState>()(
  immer((set, get) => ({
    logs: [],

    /**
     * Adiciona log estruturado
     * - Gera ID único
     * - Captura timestamp
     * - Armazena contexto opcional
     */
    addLog: (category, severity, message, context) =>
      set((state) => {
        const log: GameLog = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          category,
          severity,
          message,
          context,
        };

        state.logs.push(log);

        // Log no console em DEV mode
        if (import.meta.env.DEV) {
          const emoji = {
            debug: '🔍',
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
          }[severity];

          console.log(`${emoji} [${category}] ${message}`, context || '');
        }
      }),

    /**
     * Filtra logs por categoria e/ou severity
     */
    filterLogs: (filters) => {
      const { logs } = get();
      
      return logs.filter((log) => {
        if (filters.category && log.category !== filters.category) return false;
        if (filters.severity && log.severity !== filters.severity) return false;
        return true;
      });
    },

    /**
     * Exporta logs como JSON
     */
    exportLogs: () => {
      const { logs } = get();
      return JSON.stringify(logs, null, 2);
    },

    /**
     * Limpa todos os logs
     */
    clearLogs: () =>
      set((state) => {
        state.logs = [];
      }),
  }))
);

