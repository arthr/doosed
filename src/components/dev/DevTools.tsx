/**
 * DevTools - Overlay de debug para DEV mode
 *
 * T081-minimal: DevTools overlay basico
 *
 * Funcionalidades:
 * - Toggle visibility (ALT+SHIFT+D)
 * - Pause/Resume (útil para inspecionar estados)
 * - Current state viewer (JSON)
 * - Simple log viewer
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { useLogStore } from '../../stores/logStore';

export function DevTools() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<'state' | 'logs'>('state');
  const [stateSnapshot, setStateSnapshot] = useState<any>(null);

  // Toggle visibility com ALT+SHIFT+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Captura snapshot periodicamente (throttled) ao invés de toda mudança
  useEffect(() => {
    if (!isVisible || isPaused) return;

    const captureSnapshot = () => {
      const store = useGameStore.getState();
      const logStore = useLogStore.getState();

      const match = store.match;
      const currentRound = store.currentRound;
      const players = store.getAllPlayers();

      setStateSnapshot({
        match: match ? {
          id: match.id,
          phase: match.phase,
          turnOrder: match.turnOrder,
          activeTurnIndex: match.activeTurnIndex,
          winnerId: match.winnerId,
        } : null,
        currentRound: currentRound ? {
          number: currentRound.number,
          poolSize: currentRound.pool.size,
          pillsRemaining: currentRound.pool.pills.length,
          state: currentRound.state,
        } : null,
        players: players.map((p) => ({
          id: p.id,
          name: p.name,
          isBot: p.isBot,
          lives: p.lives,
          resistance: p.resistance,
          pillCoins: p.pillCoins,
          isActiveTurn: p.isActiveTurn,
          isEliminated: p.isEliminated,
          inventoryCount: p.inventory.length,
        })),
        logCount: logStore.logs.length,
      });
    };

    // Snapshot inicial
    captureSnapshot();

    // Atualiza a cada 500ms
    const interval = setInterval(captureSnapshot, 500);

    return () => clearInterval(interval);
  }, [isVisible, isPaused]);

  // Logs separadamente (pra aba de logs)
  const logs = useLogStore((state) => state.logs);

  const handlePauseToggle = useCallback(() => {
    setIsPaused((p) => !p);
  }, []);

  const handleCopyState = useCallback(() => {
    if (stateSnapshot) {
      navigator.clipboard.writeText(JSON.stringify(stateSnapshot, null, 2));
      alert('State copiado para clipboard!');
    }
  }, [stateSnapshot]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-xs text-xs border border-gray-600 shadow-lg">
        Press <kbd className="bg-gray-700 px-2 py-1 rounded">ALT+SHIFT+D</kbd> to open DevTools
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Overlay */}
      <div className="absolute bottom-0 right-0 w-full md:w-2/3 lg:w-1/2 h-1/2 bg-gray-900 border-t-2 border-l-2 border-green-500 shadow-2xl pointer-events-auto overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <h3 className="text-green-500 font-bold text-sm">DOSED DevTools</h3>

            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab('state')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeTab === 'state'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                State
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${activeTab === 'logs'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                Logs ({logs.length})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePauseToggle}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${isPaused
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {isPaused ? 'Paused' : 'Live'}
            </button>

            <button
              onClick={handleCopyState}
              className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Copy State
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="px-3 py-1 rounded text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Close (ALT+SHIFT+D)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {activeTab === 'state' && (
            <div className="space-y-4">
              {isPaused && (
                <div className="bg-yellow-900 border border-yellow-600 text-yellow-200 px-3 py-2 rounded text-xs">
                  State PAUSADO - clique em "Live" para voltar ao estado atual
                </div>
              )}

              <div className="bg-gray-800 rounded-xs p-3 border border-gray-700">
                <h4 className="text-white font-bold text-sm mb-2">Match State</h4>
                <pre className="text-xs text-green-400 overflow-x-auto">
                  {JSON.stringify(stateSnapshot?.match, null, 2)}
                </pre>
              </div>

              <div className="bg-gray-800 rounded-xs p-3 border border-gray-700">
                <h4 className="text-white font-bold text-sm mb-2">Current Round</h4>
                <pre className="text-xs text-green-400 overflow-x-auto">
                  {JSON.stringify(stateSnapshot?.currentRound, null, 2)}
                </pre>
              </div>

              <div className="bg-gray-800 rounded-xs p-3 border border-gray-700">
                <h4 className="text-white font-bold text-sm mb-2">Players ({stateSnapshot?.players?.length || 0})</h4>
                <pre className="text-xs text-green-400 overflow-x-auto">
                  {JSON.stringify(stateSnapshot?.players, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-1">
              {logs.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-4">
                  Nenhum log ainda
                </div>
              )}
              {logs.slice().reverse().map((log, index) => (
                <div
                  key={`${log.timestamp}-${index}`}
                  className={`text-xs p-2 rounded border ${log.severity === 'error'
                      ? 'bg-red-900 border-red-600 text-red-200'
                      : log.severity === 'warn'
                        ? 'bg-yellow-900 border-yellow-600 text-yellow-200'
                        : log.severity === 'info'
                          ? 'bg-blue-900 border-blue-600 text-blue-200'
                          : 'bg-gray-800 border-gray-600 text-gray-300'
                    }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="font-bold uppercase">
                      [{log.category}]
                    </span>
                    <span className="flex-1">{log.message}</span>
                  </div>
                  {log.context && Object.keys(log.context).length > 0 && (
                    <pre className="mt-1 text-xs opacity-75 overflow-x-auto">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
