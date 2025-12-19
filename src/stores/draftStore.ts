
import { create } from 'zustand';
import type { DraftShopItem } from '@/types/draft';
import { postSystemMessage } from '@/lib/systemMessages';

interface DraftState {
    pillCoins: number;
    inventory: DraftShopItem[];
    timeLeft: number;
    isConfirmed: boolean;
    maxSlots: number;
}

interface DraftActions {
    initDraft: (coins?: number, time?: number) => void;
    buyItem: (item: DraftShopItem) => boolean;
    sellItem: (index: number) => void;
    toggleConfirm: () => void;
    tickTimer: () => void;
    reset: () => void;
}

const INITIAL_STATE: DraftState = {
    pillCoins: 150,
    inventory: [],
    timeLeft: 30,
    isConfirmed: false,
    maxSlots: 8
};

export const useDraftStore = create<DraftState & DraftActions>((set, get) => ({
    ...INITIAL_STATE,

    initDraft: (coins = 150, time = 30) => {
        set({ ...INITIAL_STATE, pillCoins: coins, timeLeft: time });
    },

    buyItem: (item) => {
        const { pillCoins, inventory, maxSlots, timeLeft } = get();

        if (timeLeft <= 0) return false;
        if (inventory.length >= maxSlots) {
            postSystemMessage('draft', 'Inventário cheio!');
            return false;
        }
        if (pillCoins < item.price) {
            postSystemMessage('draft', 'Saldo insuficiente!');
            return false;
        }

        set(state => ({
            pillCoins: state.pillCoins - item.price,
            inventory: [...state.inventory, item]
        }));
        postSystemMessage('draft', `Comprou ${item.name} (-${item.price})`);
        return true;
    },

    sellItem: (index) => {
        // Venda retorna 50% do valor (regra de gameplay)
        const item = get().inventory[index];
        if (!item) return;

        const refund = Math.floor(item.price * 0.5);

        set(state => ({
            inventory: state.inventory.filter((_, i) => i !== index),
            pillCoins: state.pillCoins + refund
        }));
        postSystemMessage('draft', `Vendeu ${item.name} (+${refund})`);
    },

    toggleConfirm: () => {
        set(state => ({ isConfirmed: !state.isConfirmed }));
    },

    tickTimer: () => {
        const { timeLeft, isConfirmed } = get();
        if (timeLeft > 0 && !isConfirmed) {
            set({ timeLeft: timeLeft - 1 });
        }
    },

    reset: () => set(INITIAL_STATE)
}));
