import { create } from 'zustand';
import { IGameState } from '@/types/game';
const initialState: IGameState = {
  round: 2,
  currentTurnPlayerId: 'player-1',
  players: [
    {
      id: 'p2',
      name: 'Birdperson',
      avatarUrl:
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23663300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2240%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22white%22%3EBP%3C/text%3E%3C/svg%3E',
      hp: 4,
      maxHp: 5,
      shields: 2,
      goldShields: 1,
      isDead: false,
      inventory: [],
    },
    {
      id: 'p3',
      name: 'Cromulon',
      avatarUrl:
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2300aa00%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2240%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22white%22%3ECR%3C/text%3E%3C/svg%3E',
      hp: 5,
      maxHp: 5,
      shields: 2,
      goldShields: 0,
      isDead: false,
      inventory: [],
    },
    {
      id: 'p4',
      name: 'Squanchy',
      avatarUrl:
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ff8c00%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2240%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22white%22%3ESQ%3C/text%3E%3C/svg%3E',
      hp: 2,
      maxHp: 5,
      shields: 1,
      goldShields: 0,
      isDead: false,
      inventory: [],
    },
    {
      id: 'p5',
      name: 'Evil Morty',
      avatarUrl:
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%238b0000%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2240%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22white%22%3EEM%3C/text%3E%3C/svg%3E',
      hp: 3,
      maxHp: 5,
      shields: 3,
      goldShields: 1,
      isDead: false,
      inventory: [],
    },
    {
      id: 'p6',
      name: 'Mr. PB',
      avatarUrl:
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%23ffcc00%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2240%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22black%22%3EPB%3C/text%3E%3C/svg%3E',
      hp: 2,
      maxHp: 5,
      shields: 0,
      goldShields: 0,
      isDead: false,
      inventory: [],
    },
    {
      id: 'player-1',
      name: 'Rick Sanchez',
      avatarUrl:
        'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect width=%22100%22 height=%22100%22 fill=%22%2300e0e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2240%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 fill=%22white%22%3ERS%3C/text%3E%3C/svg%3E',
      hp: 4,
      maxHp: 5,
      shields: 3,
      goldShields: 1,
      isDead: false,
      inventory: [
        { id: 'item-1', name: 'Beer', icon: 'beer', description: 'Cura 1 HP' },
        { id: 'item-2', name: 'Magnifying Glass', icon: 'search', description: 'Reveal a pill' },
        { id: 'item-3', name: 'Handcuffs', icon: ' handcuff', description: 'Skip opponent turn' },
        { id: 'item-4', name: 'Knife', icon: 'knife', description: 'Deal 1 damage' },
        { id: 'item-5', name: 'Syringe', icon: 'syringe', description: 'Antidote' },
        { id: 'item-6', name: 'Portal Gun', icon: 'portal-gun', description: 'Escape' },
        { id: 'item-7', name: 'Seed', icon: 'seed', description: 'Boost intelligence' },
        { id: 'item-8', name: 'Wrench', icon: ' wrench', description: 'Repair shield' },
        { id: 'item-9', name: 'Remote', icon: ' remote', description: 'Change channel' },
        { id: 'item-10', name: 'Potion', icon: ' potion', description: 'Mystery effect' },
      ],
    },
  ],
  pillPool: { safe: 7, poison: 4, toxic: 2, antidote: 1, lethal: 0 },
  tablePills: Array(8).fill({ id: 'pill-x', type: 'UNKNOWN', revealed: false }),
  gameLog: [
    '> System initialized...',
    '> Round 2 started.',
    '> Rick Sanchez used Beer.',
    '> Ejected shell.',
  ],
};
interface GameStore extends IGameState {
  addLog: (msg: string) => void;
}
export const useGameStore = create<GameStore>(set => ({
  ...initialState,
  addLog: msg => set(state => ({ gameLog: [...state.gameLog, msg] })),
}));
