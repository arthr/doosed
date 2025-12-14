import React from 'react';

// Placeholder para o título principal
const TitlePlaceholder = () => (
  <div className="mb-8 text-center">
    {/* Substituir pelo texto/imagem do título "DOSED - PILL ROULETTE" */}
    <h1 className="text-4xl font-bold text-green-500">[TITLE PLACEHOLDER]</h1>
    <p className="text-xl text-white">[SUBTITLE PLACEHOLDER]</p>
  </div>
);

// Placeholder genérico para um botão
const ButtonPlaceholder = ({ text, subtext }: { text: string, subtext: string }) => (
  <div className="w-full p-4 mb-4 text-center text-white bg-gray-800 border-4 border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700">
    {/* Substituir pelo conteúdo do botão */}
    <span className="block text-2xl font-bold">{text}</span>
    <span className="block text-sm">{subtext}</span>
  </div>
);

// Placeholder para o desafio diário
const DailyChallengePlaceholder = () => (
  <div className="p-4 text-center text-white bg-gray-800 border-4 border-gray-600 rounded-lg">
    {/* Substituir pelo conteúdo do desafio diário */}
    <h2 className="text-xl font-bold">[DAILY CHALLENGE PLACEHOLDER]</h2>
    <p className="mt-2">[REWARD PLACEHOLDER]</p>
  </div>
);

// Placeholder para as informações do jogador
const PlayerInfoPlaceholder = () => (
  <div className="p-4 text-center text-white bg-gray-800 border-4 border-gray-600 rounded-lg">
    {/* Substituir pelo conteúdo das informações do jogador */}
    <h2 className="text-xl font-bold">[PLAYER NAME PLACEHOLDER]</h2>
    <p className="mt-2">[LEVEL & CURRENCY PLACEHOLDER]</p>
  </div>
);

// Placeholder para elementos decorativos laterais
const DecorativeElementPlaceholder = ({ side }: { side: 'left' | 'right' }) => (
  <div className={`hidden lg:block ${side === 'left' ? 'mr-8' : 'ml-8'}`}>
    {/* Substituir por imagem/elemento decorativo */}
    <div className="w-32 h-64 bg-gray-900 border-4 border-gray-700 rounded-lg flex items-center justify-center text-white">
      [{side.toUpperCase()} DECORATION PLACEHOLDER]
    </div>
  </div>
);

// Placeholder para a barra de aviso na parte inferior
const WarningBarPlaceholder = () => (
  <div className="w-full p-2 mt-8 text-center text-white bg-red-900 border-t-4 border-red-700">
    {/* Substituir pelo texto de aviso */}
    <p className="text-sm font-bold">[WARNING MESSAGE PLACEHOLDER]</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <TitlePlaceholder />

      <div className="flex w-full max-w-4xl">
        <DecorativeElementPlaceholder side="left" />

        <div className="flex-1">
          <ButtonPlaceholder text="ENTER THE VOID" subtext="Play" />
          <ButtonPlaceholder text="MULTIPLAYER" subtext="Lobby" />
          <ButtonPlaceholder text="THE LAB" subtext="Settings" />
          <ButtonPlaceholder text="EXIT DIMENSION" subtext="Quit" />

          <div className="flex justify-between mt-8">
            <DailyChallengePlaceholder />
            <PlayerInfoPlaceholder />
          </div>
        </div>

        <DecorativeElementPlaceholder side="right" />
      </div>

      <WarningBarPlaceholder />
    </div>
  );
};

export default HomePage;