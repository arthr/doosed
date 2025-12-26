/**
 * ResultsScreen - Tela de resultados da partida
 *
 * T088: Wire match end detection (via useMatchEndDetection no MatchScreen)
 * T089: Wire ResultsScreen "Jogar Novamente" button
 * T090: Wire ResultsScreen "Menu Principal" button
 *
 * Funcionalidades:
 * - Exibicao do vencedor
 * - Stats da partida (pills, dano, colapsos)
 * - XP e Schmeckles ganhos
 * - Botoes de navegacao
 */

import React, { useMemo } from 'react';
import { Button } from '../components/ui/button';
import { useGameStore } from '../stores/gameStore';
import { useProgressionStore } from '../stores/progressionStore';
import { MatchPhase } from '../types/game';
import { PillType } from '../types/pill';
import { DEFAULT_GAME_CONFIG } from '../config/game-config';

export function ResultsScreen() {
  // Store state e actions
  const match = useGameStore((state) => state.match);
  const rounds = useGameStore((state) => state.rounds);
  const getAllPlayers = useGameStore((state) => state.getAllPlayers);
  const resetMatch = useGameStore((state) => state.resetMatch);
  const navigateToLobby = useGameStore((state) => state.navigateToLobby);

  // Profile data
  const profile = useProgressionStore();

  // Dados derivados
  const players = useMemo(() => getAllPlayers(), [getAllPlayers]);

  const humanPlayer = useMemo(
    () => players.find((p) => !p.isBot) || null,
    [players]
  );

  const winner = useMemo(() => {
    if (!match?.winnerId) return null;
    return players.find((p) => p.id === match.winnerId) || null;
  }, [match?.winnerId, players]);

  const isPlayerWinner = useMemo(
    () => winner?.id === humanPlayer?.id,
    [winner?.id, humanPlayer?.id]
  );

  // Calcula stats da partida
  const stats = useMemo(() => {
    const totalRounds = rounds.length;

    // Stats calculados a partir dos resumos das rodadas
    const pillsConsumed: Record<string, number> = {
      [PillType.SAFE]: 0,
      [PillType.DMG_LOW]: 0,
      [PillType.DMG_HIGH]: 0,
      [PillType.HEAL]: 0,
      [PillType.FATAL]: 0,
      [PillType.LIFE]: 0,
    };

    // Contagem total de pills consumidas (aproximacao)
    let totalPillsConsumed = 0;
    rounds.forEach((round) => {
      totalPillsConsumed += round.pillsConsumed;
    });

    // Distribui uniformemente por tipo (aproximacao sem tracking real)
    const pillTypes = Object.keys(pillsConsumed);
    const perType = Math.floor(totalPillsConsumed / pillTypes.length);
    pillTypes.forEach((type) => {
      pillsConsumed[type] = perType;
    });

    return {
      pillsConsumed,
      itemsUsed: 0, // TODO: tracking real em US2
      damageDealt: 0, // TODO: tracking real
      damageReceived: 0, // TODO: tracking real
      collapses: humanPlayer?.totalCollapses ?? 0,
      questsCompleted: 0, // TODO: tracking real em US2
      pillCoinsEarned: 0, // TODO: tracking real em US2
      pillCoinsSpent: 0, // TODO: tracking real em US2
      totalRounds,
    };
  }, [rounds, humanPlayer]);

  // Calcula rewards
  const rewards = useMemo(() => {
    const { xp: xpConfig } = DEFAULT_GAME_CONFIG;
    const baseXP = stats.totalRounds * xpConfig.xpPerRound;
    const winBonus = isPlayerWinner ? xpConfig.victoryBonus : 0;
    const xp = baseXP + winBonus;

    const schmeckles = isPlayerWinner
      ? xpConfig.schmecklesBase + stats.totalRounds * xpConfig.schmecklesPerRound
      : 0;

    return { xp, schmeckles };
  }, [stats.totalRounds, isPlayerWinner]);

  // T089: Jogar Novamente - reseta e vai para lobby
  const handlePlayAgain = () => {
    resetMatch();
    navigateToLobby();
  };

  // T090: Menu Principal - reseta apenas (volta para HOME que e null match)
  const handleMainMenu = () => {
    resetMatch();
  };

  // Guarda de seguranca
  if (!match || match.phase !== MatchPhase.RESULTS) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando resultados...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Winner Announcement */}
        <div className="text-center mb-8">
          {isPlayerWinner ? (
            <>
              <h1 className="text-6xl font-bold text-green-500 mb-4">VITORIA!</h1>
              <p className="text-gray-400 text-xl">
                Voce sobreviveu ao caos farmaceutico!
              </p>
            </>
          ) : (
            <>
              <h1 className="text-6xl font-bold text-red-500 mb-4">ELIMINADO</h1>
              <p className="text-gray-400 text-xl">
                Vencedor:{' '}
                <span className="text-white font-bold">
                  {winner?.name || 'Desconhecido'}
                </span>
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
          <h2 className="text-white font-bold text-2xl mb-4">
            Estatisticas da Partida
          </h2>

          {/* Pills Consumed */}
          <div className="mb-4">
            <div className="text-gray-400 text-sm font-bold mb-2">
              Pills Consumidas
            </div>
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
              <div className="text-white font-bold text-xl">
                {stats.damageReceived}
              </div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Colapsos</div>
              <div className="text-white font-bold text-xl">{stats.collapses}</div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Quests Completadas</div>
              <div className="text-white font-bold text-xl">
                {stats.questsCompleted}
              </div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Coins Ganhos</div>
              <div className="text-white font-bold text-xl">
                {stats.pillCoinsEarned}
              </div>
            </div>
            <div className="bg-gray-900 rounded px-3 py-2">
              <div className="text-gray-400 text-xs">Coins Gastos</div>
              <div className="text-white font-bold text-xl">
                {stats.pillCoinsSpent}
              </div>
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
