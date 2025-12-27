/**
 * ShopGrid Component - Grid de itens da loja
 * 
 * Será usado nas Screens, criando agora para completude
 */

import React from 'react';
import type { Item } from '../../types/game';
import { Button } from '../ui/button';

interface ShopGridProps {
  items: Item[];
  playerCoins: number;
  onItemPurchase?: (item: Item) => void;
  availability?: 'DRAFT' | 'MATCH' | 'BOTH';
}

export function ShopGrid({ items, playerCoins, onItemPurchase, availability }: ShopGridProps) {
  const filteredItems = availability
    ? items.filter((item) => item.availability === availability || item.availability === 'BOTH')
    : items;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredItems.map((item) => {
        const canAfford = playerCoins >= item.cost;

        return (
          <div
            key={item.id}
            className="bg-gray-800 rounded-xs p-4 border border-gray-700 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="text-white font-bold text-sm">{item.name}</div>
              <div className="text-yellow-500 font-bold text-lg">{item.cost}</div>
            </div>

            {/* Descrição */}
            <div className="text-gray-400 text-xs mb-3 flex-1">{item.description}</div>

            {/* Categoria e Targeting */}
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-gray-500">{item.category}</span>
              {item.targeting !== 'NONE' && (
                <span className="text-blue-400">{item.targeting}</span>
              )}
            </div>

            {/* Stackable */}
            {item.isStackable && (
              <div className="text-xs text-purple-400 mb-2">
                Stack: {item.stackLimit}x
              </div>
            )}

            {/* Botão de compra */}
            <Button
              onClick={() => onItemPurchase?.(item)}
              disabled={!canAfford}
              variant={canAfford ? 'primary' : 'secondary'}
              size="sm"
            >
              {canAfford ? 'Comprar' : 'Sem coins'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

