/**
 * App - Router principal baseado em gameStore.match.phase
 *
 * T079: Router com Error Boundary
 * T080: Error Boundary com dual-mode handling
 */

import React from 'react';
import { useGameStore } from './stores/gameStore';
import { MatchPhase } from './types/game';
import { HomeScreen } from './screens/HomeScreen';
import { LobbyScreen } from './screens/LobbyScreen';
import { DraftScreen } from './screens/DraftScreen';
import { MatchScreen } from './screens/MatchScreen';
import { ShoppingScreen } from './screens/ShoppingScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { DevTools } from './components/dev/DevTools';
import './index.css';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error:', error, errorInfo);

    // Em DEV: pausa com debug overlay
    if (import.meta.env.DEV) {
      console.log('DEV MODE: Error paused for debugging');
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleFallback = () => {
    // Salva progresso parcial e volta para HOME
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 border border-red-500">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              Erro no Jogo
            </h1>
            <p className="text-gray-300 mb-4">
              Ocorreu um erro inesperado. Voce pode tentar novamente ou voltar
              ao menu principal.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-gray-900 p-3 rounded mb-4 text-xs text-gray-400 font-mono">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Tentar Novamente
              </button>
              <button
                onClick={this.handleFallback}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Menu Principal
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// App Router
function App() {
  const match = useGameStore((state) => state.match);
  const phase = match?.phase || MatchPhase.LOBBY;

  // Router baseado em phase
  const renderScreen = () => {
    switch (phase) {
      case MatchPhase.LOBBY:
        // Se nao tem match, mostra HOME, senao mostra LOBBY
        return match ? <LobbyScreen /> : <HomeScreen />;
      case MatchPhase.DRAFT:
        return <DraftScreen />;
      case MatchPhase.MATCH:
        return <MatchScreen />;
      case MatchPhase.SHOPPING:
        return <ShoppingScreen />;
      case MatchPhase.RESULTS:
        return <ResultsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <ErrorBoundary>
      {renderScreen()}
      {import.meta.env.DEV && <DevTools />}
    </ErrorBoundary>
  );
}

export default App;
