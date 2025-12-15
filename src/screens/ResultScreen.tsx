import { useState } from 'react';

// --- COMPONENTS ---

// 1. Titulo do Header (VICTORY / DEAD)
const HeaderPlaceholder = ({ result }: { result: 'victory' | 'defeat' }) => {
  const isVictory = result === 'victory';
  const text = isVictory ? 'VICTORY' : 'DEAD';
  const borderColor = isVictory ? 'border-primary' : 'border-destructive';
  const textColor = isVictory ? 'text-rick-green' : 'text-destructive';

  return (
    <div className={`w-64 mx-auto mb-4 p-2 text-center bg-ui-panel border-4 ${borderColor} rounded-full`}>
      <h2 className={`text-xl font-bold tracking-widest ${textColor}`}>{text}</h2>
    </div>
  );
};

// 2. Titulo Principal (SURVIVED / DIED)
const MainTitlePlaceholder = ({ result }: { result: 'victory' | 'defeat' }) => {
  const isVictory = result === 'victory';
  const text = isVictory ? 'SURVIVED' : 'DIED';
  const textColor = isVictory ? 'text-morty-yellow' : 'text-destructive';

  return (
    <div className="text-center mb-6">
      <h1 className={`text-6xl font-black uppercase drop-shadow-md ${textColor}`}>{text}</h1>
    </div>
  );
};

// 3. Avatar Central (Rick)
const AvatarPlaceholder = ({ result }: { result: 'victory' | 'defeat' }) => {
  const isVictory = result === 'victory';
  const mood = isVictory ? 'HAPPY RICK' : 'DEAD RICK';
  const halo = !isVictory && (
    <div className="absolute -top-6 text-morty-yellow text-xs font-bold uppercase">HALO</div>
  );

  return (
    <div className="relative flex justify-center mb-6">
      {halo}
      <div className="w-40 h-40 bg-card border-4 border-border rounded-full flex items-center justify-center text-center p-2">
        <span className="text-foreground font-bold">{mood}</span>
      </div>
    </div>
  );
};

// 4. Painel de Estatisticas (Esquerda)
const StatsPanelPlaceholder = ({ result }: { result: 'victory' | 'defeat' }) => {
  const isVictory = result === 'victory';
  const borderColor = isVictory ? 'border-primary' : 'border-destructive';
  const titleColor = isVictory ? 'text-rick-green' : 'text-destructive';

  // Labels mudam levemente dependendo do contexto
  const labels = {
    pills: isVictory ? 'Pills Survived: 12' : 'Pills Taken: 12',
    items: isVictory ? 'Items Used: 5' : 'Items Wasted: 5',
    turns: isVictory ? 'Turns Survived: 8' : 'Turns Lasted: 8',
  };

  return (
    <div
      className={`flex-1 bg-ui-panel/80 border-4 ${borderColor} rounded-xl p-4 flex flex-col justify-between min-h-[200px]`}
    >
      <h3 className={`text-center font-bold mb-4 uppercase ${titleColor}`}>Match Stats</h3>

      <div className="space-y-4 text-foreground text-lg font-mono">
        <div className="flex justify-between">
          <span>{labels.pills}</span>
          <span className="text-xs text-muted-foreground">PILLS</span>
        </div>
        <div className="flex justify-between">
          <span>{labels.items}</span>
          <span className="text-xs text-muted-foreground">ITEMS</span>
        </div>
        <div className="flex justify-between">
          <span>{labels.turns}</span>
          <span className="text-xs text-muted-foreground">TURNS</span>
        </div>
      </div>

      {/* Icones decorativos extras no rodape do painel */}
      <div className="mt-4 flex justify-center gap-2 text-2xl">{isVictory ? 'OK' : 'DEFEAT'}</div>
    </div>
  );
};

// 5. Painel de Recompensas (Direita)
const RewardsPanelPlaceholder = ({ result }: { result: 'victory' | 'defeat' }) => {
  const isVictory = result === 'victory';
  const borderColor = isVictory ? 'border-primary' : 'border-border';
  const titleColor = isVictory ? 'text-rick-green' : 'text-muted-foreground';

  const xpText = isVictory ? '+1200' : '-500';
  const xpColor = isVictory ? 'text-rick-green' : 'text-destructive';
  const lootText = isVictory ? 'Cool Rick Sunglasses' : 'NO LOOT';
  const lootSubtext = isVictory ? 'NEW COSMETIC UNLOCKED!' : '';

  return (
    <div
      className={`flex-1 bg-ui-panel/80 border-4 ${borderColor} rounded-xl p-4 flex flex-col items-center min-h-[200px]`}
    >
      <h3 className={`text-center font-bold mb-2 uppercase ${titleColor}`}>Rewards</h3>

      {/* XP Section */}
      <div className="w-full text-center mb-4">
        <p className="text-foreground text-sm font-bold">XP {isVictory ? 'GAINED' : 'LOST'}:</p>
        <p className={`text-2xl font-black ${xpColor}`}>{xpText}</p>

        {/* Progress Bar Placeholder */}
        <div className="w-full h-4 bg-muted rounded-full mt-1 border border-border overflow-hidden relative">
          <div
            className={`h-full ${isVictory ? 'bg-morty-yellow' : 'bg-destructive'}`}
            style={{ width: isVictory ? '70%' : '30%' }}
          ></div>
        </div>
      </div>

      {/* Loot Section */}
      <div className="flex flex-col items-center justify-center flex-1 w-full border-t border-border pt-2">
        <p className="text-xs text-muted-foreground uppercase mb-1">Loot Drop</p>
        <div className="w-16 h-16 bg-card border-2 border-dashed border-border flex items-center justify-center text-3xl mb-2">
          {isVictory ? 'LOOT' : 'NONE'}
        </div>
        <p className="text-portal-blue font-bold text-sm text-center">{lootText}</p>
        {lootSubtext && <p className="text-morty-yellow text-[10px] font-bold uppercase">{lootSubtext}</p>}
      </div>
    </div>
  );
};

// 6. Botoes de Rodape
const FooterButtons = ({ result }: { result: 'victory' | 'defeat' }) => {
  const isVictory = result === 'victory';
  const btnColor = isVictory
    ? 'bg-primary border-primary hover:bg-game-accent-hover'
    : 'bg-destructive border-destructive hover:opacity-90';
  const btnText = isVictory ? 'PLAY AGAIN' : 'TRY AGAIN';

  return (
    <div className="flex justify-center gap-4 mt-8 w-full max-w-md">
      <button
        className={`flex-1 py-3 px-6 rounded-lg border-b-4 text-foreground font-bold text-lg uppercase shadow-lg transform active:translate-y-1 ${btnColor}`}
      >
        {btnText}
      </button>
      <button className="flex-1 py-3 px-6 bg-muted border-b-4 border-border hover:opacity-90 rounded-lg text-foreground font-bold text-lg uppercase shadow-lg transform active:translate-y-1">
        Main Menu
      </button>
    </div>
  );
};

// --- MAIN PAGE ---

const ResultPage = () => {
  // Estado temporario para debug e alternancia de telas
  const [gameResult, setGameResult] = useState<'victory' | 'defeat'>('victory');

  // Define o background baseado no resultado (Placeholder de cor)
  const bgClass =
    gameResult === 'victory'
      ? 'bg-gradient-to-b from-space-black to-primary/30'
      : 'bg-gradient-to-b from-space-black to-destructive/30';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${bgClass}`}>
      {/* --- DEBUG TOGGLE BUTTON (REMOVER DEPOIS) --- */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setGameResult(prev => (prev === 'victory' ? 'defeat' : 'victory'))}
          className="bg-foreground text-background text-xs font-bold py-2 px-4 rounded shadow hover:opacity-90"
        >
          TOGGLE STATE (Current: {gameResult.toUpperCase()})
        </button>
      </div>
      {/* ------------------------------------------- */}

      <div className="w-full max-w-4xl relative">
        {/* Moldura Decorativa (Placeholder da borda grossa cinza) */}
        <div className="bg-card border-8 border-border rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Background interno (Swirl placeholder) */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://placehold.co/100x100?text=Swirl')] bg-repeat"></div>

          <div className="relative z-10 flex flex-col items-center">
            <HeaderPlaceholder result={gameResult} />
            <MainTitlePlaceholder result={gameResult} />
            <AvatarPlaceholder result={gameResult} />

            {/* Container de Stats e Rewards */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <StatsPanelPlaceholder result={gameResult} />
              <RewardsPanelPlaceholder result={gameResult} />
            </div>

            <FooterButtons result={gameResult} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
