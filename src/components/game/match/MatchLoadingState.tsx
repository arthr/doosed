/**
 * MatchLoadingState - Estado de loading da partida
 * 
 * Componente especifico do MatchScreen
 * Exibido enquanto dados da partida sao carregados
 */

import React from 'react';

export function MatchLoadingState() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Carregando partida...</div>
    </div>
  );
}

