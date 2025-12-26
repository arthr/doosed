/**
 * LobbyScreen - Tela de configuração de partida
 * 
 * STATUS: DESINTEGRADO - Apenas estrutura visual
 * TODO REFACTOR: Reintegrar após refatoração de hooks e stores
 * 
 * Lógica removida (será reintegrada):
 * - Criação de participantes (Player objects)
 * - Inicialização de match
 * - Transição para DRAFT phase
 */

import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { BotLevel } from '../types/game';

export function LobbyScreen() {
  // TODO REFACTOR: Reintegrar hooks refatorados aqui
  // - useMatchSetup() - criação de partida
  // - useLobbyParticipants() - gestão de participantes

  const [botCount, setBotCount] = useState(1);
  const [botDifficulty, setBotDifficulty] = useState<BotLevel>(BotLevel.EASY);

  // Mock participants para manter estrutura visual
  const mockParticipants = [
    { id: '1', name: 'Você', avatar: 'player', isBot: false, botLevel: null },
    ...Array.from({ length: botCount }, (_, i) => ({
      id: `bot-${i}`,
      name: `Bot ${i + 1}`,
      avatar: `bot${i + 1}`,
      isBot: true,
      botLevel: botDifficulty,
    })),
  ];

  const handleStart = () => {
    console.log('[DESINTEGRADO] Start match clicked');
    // TODO REFACTOR: Reintegrar inicialização de match
  };

  const handleBack = () => {
    console.log('[DESINTEGRADO] Back clicked');
    // TODO REFACTOR: Reintegrar navegação
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-500 mb-2">Configurar Partida</h1>
          <p className="text-gray-400">Configure os bots e inicie a partida</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configurações */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-white font-bold text-xl mb-4">Bots</h2>

            {/* Quantidade de bots */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm font-bold mb-2 block">
                Quantidade (1-5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={botCount}
                onChange={(e) => setBotCount(Math.min(5, Math.max(1, Number(e.target.value))))}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
              />
            </div>

            {/* Dificuldade */}
            <div className="mb-4">
              <label className="text-gray-400 text-sm font-bold mb-2 block">Dificuldade</label>
              <select
                value={botDifficulty}
                onChange={(e) => setBotDifficulty(e.target.value as BotLevel)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
              >
                <option value={BotLevel.EASY}>Easy - Paciente</option>
                <option value={BotLevel.NORMAL}>Normal - Cobaia</option>
                <option value={BotLevel.HARD}>Hard - Sobrevivente</option>
                <option value={BotLevel.INSANE}>Insane - Hofmann</option>
              </select>
            </div>

            <div className="text-gray-500 text-xs bg-gray-900 p-3 rounded">
              <strong>Nota:</strong> Apenas a dificuldade Easy está implementada no MVP.
            </div>
          </div>

          {/* Participantes */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-white font-bold text-xl mb-4">
              Participantes ({mockParticipants.length})
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockParticipants.map((participant, index) => (
                <div
                  key={participant.id}
                  className="bg-gray-900 rounded-lg p-3 border border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                      {participant.avatar.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-bold">{participant.name}</div>
                      <div className="text-gray-400 text-xs">
                        {participant.isBot
                          ? `Bot - ${participant.botLevel}`
                          : 'Você'}
                      </div>
                    </div>
                    {index === 0 && (
                      <div className="text-green-500 text-xs font-bold">HOST</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mt-8">
          <Button onClick={handleBack} variant="secondary" className="flex-1">
            Voltar
          </Button>
          <Button onClick={handleStart} variant="primary" className="flex-1">
            Iniciar Partida
          </Button>
        </div>
      </div>
    </div>
  );
}

