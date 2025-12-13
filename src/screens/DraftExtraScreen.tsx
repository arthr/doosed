import React, { useState, useEffect } from 'react';
import { Beer, Link as Handcuffs, Search, Sword } from 'lucide-react';
import EconomyHeader from '../components/draft/EconomyHeader';
import ShopItemCard from '../components/draft/ShopItemCard';
import InventoryGrid from '../components/draft/InventoryGrid';
import type { Item } from '../types/draft';

// --- Data ---
const SHOP_ITEMS: Item[] = [
    {
        id: 'beer',
        name: 'BEER',
        description: '- Heals 1HP',
        price: 50,
        icon: Beer,
    },
    {
        id: 'handcuffs',
        name: 'HANDCUFFS',
        description: '- Skips enemy turn',
        price: 75,
        icon: Handcuffs,
    },
    {
        id: 'magnifier',
        name: 'MAGNIFYING GLASS',
        description: '- Reveals next pill',
        price: 40,
        icon: Search,
    },
    {
        id: 'knife',
        name: 'SPACE KNIFE',
        description: '- Deals 2 DMG',
        price: 100,
        icon: Sword,
    },
];

const MAX_SLOTS = 8;
const INITIAL_WALLET = 150;
const INITIAL_TIME = 15;

export default function DraftScreen() {
    // --- State ---
    const [wallet, setWallet] = useState(INITIAL_WALLET);
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
    const [inventory, setInventory] = useState<Item[]>([]);
    const [isDraftOver, setIsDraftOver] = useState(false);

    // --- Timer Logic ---
    useEffect(() => {
        if (timeLeft <= 0) {
            setIsDraftOver(true);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // --- Actions ---
    const handleBuy = (item: Item) => {
        if (isDraftOver) return;
        if (wallet < item.price) return;
        if (inventory.length >= MAX_SLOTS) return;

        setWallet((prev) => prev - item.price);
        setInventory((prev) => [...prev, item]);
    };

    const handleConfirmLoadout = () => {
        setIsDraftOver(true);
        alert(`Loadout Confirmed! Ready for Match.\nInventory: ${inventory.map(i => i.name).join(', ') || 'Empty'}`);
    };

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto bg-slate-900 border-x-4 border-slate-800 shadow-2xl relative">

            {/* --- Decorative Pipes/Frame (Top) --- */}
            <div className="h-4 bg-slate-700 w-full border-b-4 border-slate-950 flex justify-between px-4 items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <div className="w-full mx-4 h-1 bg-slate-800 rounded"></div>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>

            {/* --- Header --- */}
            <div className="bg-slate-800 p-2 sm:p-4 border-b-4 border-black">
                <div className="text-center mb-4">
                    <h1 className="font-pixel text-cyan-400 text-sm sm:text-lg tracking-widest uppercase drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
                        Draft / Shop Screen
                    </h1>
                </div>
                <EconomyHeader wallet={wallet} timeLeft={timeLeft} />
            </div>

            {/* --- Main Shop Area (The Conveyor Belt) --- */}
            <div className="flex-1 overflow-y-auto bg-slate-900 relative flex flex-col justify-center py-4">
                {/* Background mechanical details */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(circle, #4fd1c5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="relative z-10 px-4">
                    {/* Mobile: Grid / Desktop: Flex Row */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        {SHOP_ITEMS.map((item) => (
                            <ShopItemCard
                                key={item.id}
                                item={item}
                                canAfford={wallet >= item.price && inventory.length < MAX_SLOTS}
                                onBuy={() => handleBuy(item)}
                                disabled={isDraftOver}
                            />
                        ))}
                    </div>

                    {/* Conveyor Belt Visual (Desktop mostly) */}
                    <div className="hidden sm:block h-6 bg-slate-700 mt-4 border-y-4 border-black relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full w-full flex animate-[slide_2s_linear_infinite]">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div key={i} className="w-8 h-full border-r-2 border-slate-800 transform -skew-x-12 mx-2"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Footer (Inventory) --- */}
            <div className="bg-slate-950 p-4 border-t-8 border-slate-800">
                <InventoryGrid
                    inventory={inventory}
                    maxSlots={MAX_SLOTS}
                />

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleConfirmLoadout}
                        disabled={isDraftOver}
                        className={`
              w-full sm:w-auto px-8 py-4 font-pixel text-lg sm:text-xl uppercase tracking-widest transition-all
              border-b-8 border-r-8 active:border-b-0 active:border-r-0 active:translate-y-2 active:translate-x-2
              ${isDraftOver
                                ? 'bg-gray-600 border-gray-800 text-gray-400 cursor-not-allowed'
                                : 'bg-cyan-500 border-cyan-700 text-white hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'}
            `}
                    >
                        {isDraftOver ? 'Deploying...' : 'Confirm Loadout'}
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50px); }
        }
      `}</style>
        </div>
    );
}
