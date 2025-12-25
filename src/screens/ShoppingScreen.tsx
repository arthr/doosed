/**
 * ShoppingScreen - Tela de compras entre rodadas
 * 
 * Será implementada na US2, mas criando estrutura agora
 */

import React from 'react';
import { Button } from '../components/ui/button';

export function ShoppingScreen() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-green-500 mb-4">Shopping Phase</h1>
        <p className="text-gray-400 mb-8">Esta tela será implementada na User Story 2</p>
        <Button onClick={() => console.log('Skip shopping')} variant="primary">
          Continuar
        </Button>
      </div>
    </div>
  );
}

