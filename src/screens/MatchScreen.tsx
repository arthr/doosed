import React from 'react';

// --- COMPONENTS ---

// 1. Barra superior com os oponentes
const OpponentCardPlaceholder = ({ name, active }: { name: string, active: boolean }) => (
    <div className={`p-2 border-2 rounded-lg w-32 md:w-40 flex flex-col items-center bg-gray-900 ${active ? 'border-yellow-400' : 'border-purple-500'}`}>
        <div className="w-10 h-10 mb-1 bg-gray-700 rounded-full flex items-center justify-center text-xs text-white">
            [AVATAR]
        </div>
        <span className="text-xs font-bold text-white truncate w-full text-center">{name}</span>
        {/* Placeholder para HP e Escudo */}
        <div className="flex gap-1 mt-1">
            <span className="text-red-500 text-xs">♥♥♥</span>
            <span className="text-blue-500 text-xs">🛡️🛡️</span>
        </div>
    </div>
);

const OpponentsBar = () => (
    <div className="flex justify-between w-full gap-2 mb-4 overflow-x-auto p-2">
        <OpponentCardPlaceholder name="Birdperson" active={false} />
        <OpponentCardPlaceholder name="Cromulon" active={true} />
        <OpponentCardPlaceholder name="K. Michael" active={false} />
        <OpponentCardPlaceholder name="Tammy" active={false} />
        <OpponentCardPlaceholder name="Morty" active={false} />
    </div>
);

// 2. A "Mesa" central (The Table)
const GameTablePlaceholder = () => (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl p-4 mb-4 bg-gray-800 border-4 border-gray-600 rounded-xl relative">
        {/* Header da Mesa */}
        <div className="absolute -top-5 bg-gray-900 px-4 py-1 border-2 border-green-500 text-green-500 font-bold rounded">
            THE TABLE
        </div>

        <div className="w-full text-center mt-2 mb-2">
            <p className="text-green-400 font-mono text-sm">RODADA 2 | TURNO: <span className="text-white">Rick Sanchez</span></p>
        </div>

        {/* Status dos Itens (Counts) */}
        <div className="flex justify-center gap-4 mb-4 text-xs md:text-sm font-mono font-bold">
            <span className="text-green-400">[7] SAFE</span>
            <span className="text-purple-400">[4] POISON</span>
            <span className="text-yellow-400">[2] TOXIC</span>
            <span className="text-orange-400">[1] TOXIC</span>
            <span className="text-blue-400">[1] ANTIDOTE</span>
            <span className="text-red-500">[0] LETHAL</span>
        </div>

        {/* Esteira de Itens (Conveyor Belt) */}
        <div className="w-full bg-gray-900 border-2 border-gray-700 rounded p-4 grid grid-rows-2 gap-2">
            {/* Linha 1 */}
            <div className="flex justify-between gap-2 border-b border-gray-700 pb-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-xs">?</div>
                ))}
            </div>
            {/* Linha 2 */}
            <div className="flex justify-between gap-2 pt-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center text-gray-500 text-xs">?</div>
                ))}
            </div>
        </div>
    </div>
);

// 3. Painel do Jogador (Canto Inferior Esquerdo)
const PlayerDashboardPlaceholder = () => (
    <div className="flex-1 flex p-4 bg-gray-900 border-4 border-green-500 rounded-xl mr-4 min-w-[50%]">
        {/* Avatar Grande */}
        <div className="w-24 h-32 bg-gray-800 border-2 border-green-400 flex items-center justify-center text-white mr-4">
            [YOUR AVATAR]
        </div>

        <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">Rick Sanchez (YOU)</h2>

            {/* Barras de Status */}
            <div className="flex gap-8 mb-2">
                <div>
                    <span className="block text-xs text-gray-400">HEALTH BAR</span>
                    <span className="text-purple-500 text-xl">♥♥♥♥</span>
                </div>
                <div>
                    <span className="block text-xs text-gray-400">RESISTANCE BAR</span>
                    <span className="text-blue-500 text-xl">🛡️🛡️🛡️</span>
                </div>
            </div>

            {/* Grid de Inventário */}
            <div className="mt-2">
                <span className="block text-xs text-gray-400 mb-1">INVENTORY GRID</span>
                <div className="grid grid-cols-5 gap-1 w-full max-w-xs">
                    <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center text-xs">🔍</div>
                    <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center text-xs">🔗</div>
                    <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center text-xs">🔪</div>
                    <div className="w-8 h-8 bg-gray-800 border border-gray-600 flex items-center justify-center text-xs">🍺</div>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="w-8 h-8 bg-transparent border border-gray-700"></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// 4. Painel de Ações e Log (Canto Inferior Direito)
const ActionPanelPlaceholder = () => (
    <div className="w-full md:w-1/3 flex flex-col-reverse md:flex-col gap-2">
        {/* Game Log */}
        <div className="bg-black border-2 border-gray-600 p-2 h-24 overflow-y-auto rounded font-mono text-xs text-green-400">
            <p>{`> Match started.`}</p>
            <p>{`> Round 1 ended.`}</p>
            <p className="text-yellow-300">{`> Rick Sanchez used Beer.`}</p>
            <p>{`> Ejected shell.`}</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
            <button className="bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded border-2 border-green-400 text-xl flex items-center justify-center gap-2">
                🛒 SHOP
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded border-2 border-purple-400 text-xl flex items-center justify-center gap-2">
                💬 CHAT
            </button>
        </div>
    </div>
);

// --- MAIN PAGE ---

export const MatchScreen = () => {
    return (
        <div className="flex flex-col min-h-screen p-2 md:p-6 bg-gray-950 text-white font-sans overflow-hidden">

            {/* Área Superior: Oponentes */}
            <OpponentsBar />

            {/* Área Central: Mesa de Jogo */}
            <div className="flex-1 flex items-center justify-center w-full">
                <GameTablePlaceholder />
            </div>

            {/* Área Inferior: Dashboard e Ações */}
            <div className="w-full flex flex-col md:flex-row gap-4 h-auto md:h-48 mt-auto">
                <PlayerDashboardPlaceholder />
                <ActionPanelPlaceholder />
            </div>

        </div>
    );
};
