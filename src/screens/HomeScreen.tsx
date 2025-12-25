
/**
 * HomeScreen - Tela inicial do jogo
 * 
 * T074: "ENTER THE VOID" button + profile info (level, xp, schmeckles)
 */

import React from 'react';
import { useMatchStore } from '../stores/matchStore';
import { useProgressionStore, useProgressionInfo } from '../stores/progressionStore';
import { Button } from '../components/ui/button';

export function HomeScreen() {
  const { navigateToLobby } = useMatchStore();
  const profile = useProgressionStore();
  const progressionInfo = useProgressionInfo();

  const handleEnterGame = () => {
    // T082: HOME → LOBBY navigation
    navigateToLobby();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-green-500 mb-4">DOSED</h1>
          <p className="text-gray-400 text-lg">Pill Roulette Game</p>
        </div>

        {/* Profile Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              {profile.avatar.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-xl">{profile.name}</div>
              <div className="text-gray-400">Nível {profile.level}</div>
            </div>
            <div className="text-right">
              <div className="text-yellow-500 font-bold text-2xl">{profile.schmeckles}</div>
              <div className="text-gray-400 text-sm">Schmeckles</div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>XP para Nível {profile.level + 1}</span>
              <span>
                {progressionInfo.xpProgress}/{progressionInfo.xpNeeded}
              </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progressionInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
            <div className="text-center">
              <div className="text-white font-bold text-lg">{profile.gamesPlayed}</div>
              <div className="text-gray-400 text-xs">Partidas</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">{profile.wins}</div>
              <div className="text-gray-400 text-xs">Vitórias</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-lg">{profile.totalRoundsSurvived}</div>
              <div className="text-gray-400 text-xs">Rodadas</div>
            </div>
          </div>
        </div>

        {/* Enter Button */}
        <Button onClick={handleEnterGame} variant="primary" size="lg" className="w-full">
          ENTER THE VOID
        </Button>

        {/* Version/Credits */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          v0.1.0 MVP | Inspirado em Rick and Morty
        </div>
      </div>
    </div>
  );
}
