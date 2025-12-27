/**
 * LogViewer Component - Visualizador de logs do jogo
 * 
 * T069: Renderiza logs do logStore em formato user-friendly
 */

import React, { useState } from 'react';
import { useLogStore, type LogCategory, type LogSeverity } from '../../stores/logStore';

interface LogViewerProps {
  maxHeight?: string;
}

const SEVERITY_COLORS: Record<LogSeverity, string> = {
  debug: 'text-gray-400',
  info: 'text-blue-400',
  warn: 'text-yellow-400',
  error: 'text-red-400',
};

const CATEGORY_ICONS: Record<LogCategory, string> = {
  turn: '🔄',
  item: '🎒',
  pill: '💊',
  status: '✨',
  bot_decision: '🤖',
  error: '❌',
  phase: '📍',
  round: '🔢',
  match: '🎮',
};

export function LogViewer({ maxHeight = '300px' }: LogViewerProps) {
  const { logs } = useLogStore();
  const [filterCategory, setFilterCategory] = useState<LogCategory | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<LogSeverity | 'all'>('all');

  const filteredLogs = logs.filter((log) => {
    if (filterCategory !== 'all' && log.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && log.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="bg-gray-900 rounded-xs p-3 border border-gray-700">
      {/* Header com filtros */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
        <div className="text-white font-bold text-sm">Game Log</div>

        <div className="flex gap-2">
          {/* Filtro de categoria */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as LogCategory | 'all')}
            className="bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-700"
          >
            <option value="all">Todas</option>
            <option value="turn">Turnos</option>
            <option value="item">Itens</option>
            <option value="pill">Pills</option>
            <option value="status">Status</option>
            <option value="bot_decision">Bot IA</option>
            <option value="error">Erros</option>
            <option value="phase">Fases</option>
            <option value="round">Rodadas</option>
            <option value="match">Partida</option>
          </select>

          {/* Filtro de severidade */}
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as LogSeverity | 'all')}
            className="bg-gray-800 text-white text-xs px-2 py-1 rounded border border-gray-700"
          >
            <option value="all">Todos</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      {/* Lista de logs */}
      <div
        className="overflow-y-auto space-y-1"
        style={{ maxHeight }}
      >
        {filteredLogs.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">Nenhum log disponível</div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="text-xs p-2 bg-gray-800 rounded hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-start gap-2">
                {/* Ícone da categoria */}
                <span className="text-base">{CATEGORY_ICONS[log.category]}</span>

                {/* Conteúdo */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${SEVERITY_COLORS[log.severity]}`}>
                      [{log.severity.toUpperCase()}]
                    </span>
                    <span className="text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                  <div className="text-gray-300 mt-0.5">{log.message}</div>

                  {/* Contexto (se houver) */}
                  {log.context && Object.keys(log.context).length > 0 && (
                    <div className="text-gray-500 text-xs mt-1 font-mono">
                      {JSON.stringify(log.context, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

