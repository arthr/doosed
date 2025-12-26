/**
 * ResultsScreen - Tela de resultados da partida
 * 
 * STATUS: DESINTEGRADO - Apenas estrutura visual
 * TODO REFACTOR: Reintegrar após refatoração de hooks e stores
 * 
 * Lógica removida (será reintegrada):
 * - Cálculo de stats (pills, damage, collapses)
 * - Cálculo de rewards (XP, Schmeckles)
 * - Reset de match
 * - Transições de fase
 */

import React from 'react';
import { Button } from '../components/ui/button';

export function ResultsScreen() {
  // TODO REFACTOR: Reintegrar hooks refatorados aqui
  // - useMatchResults() - dados de resultados
  // - useRewardsCalculation() - cálculo de XP/Schmeckles
  // - useMatchReset() - reset de partida

  // Mock data para manter estrutura visual
  const mockIsPlayerWinner = true;
  const mockWinner = { name: 'Você' };

  // Mock stats - será calculado dinamicamente
  const stats = {
    pillsConsumed: {
      SAFE: 5,
      DMG_LOW: 3,
      DMG_HIGH: 2,
      HEAL: 4,
      FATAL: 0,
      LIFE: 1,
    },
    itemsUsed: 8,
    damageDealt: 24,
    damageReceived: 18,
    collapses: humanPlayer?.totalCollapses || 0,
    questsCompleted: 2,
    pillCoinsEarned: 45,
    pillCoinsSpent: 100,
    totalRounds: match?.rounds.length || 0,
  };

  // Mock rewards - será calculado pela progressionStore
  const rewards = {
    xp: 150,
    schmeckles: isPlayerWinner ? 75 : 0,
  };

  const handlePlayAgain = () => {
    console.log('[DESINTEGRADO] Play again clicked');
    // TODO REFACTOR: Reintegrar reset + transição
  };

  const handleMainMenu = () => {
    console.log('[DESINTEGRADO] Main menu clicked');
    // TODO REFACTOR: Reintegrar reset + transição
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Winner Announcement */}
        <div className="text-center mb-8">
          {mockIsPlayerWinner ? (
            <>
              <h1 className="text-6xl font-bold text-green-500 mb-4">VITÓRIA!</h1>
              <p className="text-gray-400 text-xl">Você sobreviveu ao caos farmacêutico!</p>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-bold text-red-500 mb-4">ELIMINADO</h1>
              <p className="text-gray-400 text-xl">
                Vencedor: <span className="text-white font-bold">{mockWinner?.name || 'Desconhecido'}</span>
              </p>
            </>
          )}
        </div>

        {/* Rewards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <div className="text-gray-400 text-sm mb-2">XP Ganho</div>
            <div className="text-green-500 font-bold text-4xl">+{rewards.xp}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
            <div className="text-gray-400 text-sm mb-2">Schmeckles</div>
            <div className="text-yellow-500 font-bold text-4xl">
              {rewards.schmeckles > 0 ? `+${rewards.schmeckles}` : '0'}
            </div>
          </div>
        </div>

        {/* Match Stats */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-white font-bold text-2xl mb-4">Estatísticas da Partida</h2>

          {/* Pills Consumed */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm font-bold mb-2">Pills Consumidas</div>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(stats.pillsConsumed).map(([type, count]) => (
                <div
                  key={type}
                  className="bg-gray-900 rounded px-3 py-2 flex items-center justify-between"
                >
                  <span className="text-gray-300 text-sm">{type}</span>
                  <span className="text-white font-bold">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* General Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Itens Usados</div>
              <div className="text-white font-bold text-xl">{stats.itemsUsed}</div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Dano Causado</div>
              <div className="text-white font-bold text-xl">{stats.damageDealt}</div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Dano Sofrido</div>
              <div className="text-white font-bold text-xl">{stats.damageReceived}</div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Colapsos</div>
              <div className="text-white font-bold text-xl">{stats.collapses}</div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Quests Completadas</div>
              <div className="text-white font-bold text-xl">{stats.questsCompleted}</div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Coins Ganhos</div>
              <div className="text-white font-bold text-xl">{stats.pillCoinsEarned}</div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Coins Gastos</div>
              <div className="text-white font-bold text-xl">{stats.pillCoinsSpent}</div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Total de Rodadas</div>
              <div className="text-white font-bold text-xl">{stats.totalRounds}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleMainMenu} variant="secondary" className="flex-1">
            Menu Principal
          </Button>
          <Button onClick={handlePlayAgain} variant="primary" className="flex-1">
            Jogar Novamente
          </Button>
        </div>
      </div>
    </div>
  );
}

