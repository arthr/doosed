import { useMemo, useState } from 'react';
import { useFlowStore } from '@/stores/flowStore';
import { useNotification } from '@/stores/notificationStore';
import { LobbyScreen } from '@/screens/LobbyScreen';
import { DraftScreen } from '@/screens/DraftScreen';
import { MatchScreen } from '@/screens/MatchScreen';
import ResultScreen from '@/screens/ResultScreen';
import { DevOverlayPreview } from '@/components/dev/DevOverlayPreview';
import { DevDock } from '@/components/dev/DevDock';
import { DevMenu } from '@/components/dev/DevMenu';

type ScreenComponent = () => JSX.Element;

type DetectedScreen = {
  key: string;
  label: string;
  Component: ScreenComponent;
};

function getScreenLabelFromPath(path: string) {
  const file = path.split('/').pop() ?? path;
  return file.replace(/\.tsx$/i, '').replace(/Screen$/i, ' Screen');
}

function pickScreenComponent(moduleExports: Record<string, unknown>): ScreenComponent | null {
  const maybeDefault = moduleExports.default;
  if (typeof maybeDefault === 'function') return maybeDefault as ScreenComponent;

  // Prefer exports that end with "Screen"
  const screenExportKey = Object.keys(moduleExports).find(
    key => /Screen$/.test(key) && typeof moduleExports[key] === 'function',
  );
  if (screenExportKey) return moduleExports[screenExportKey] as ScreenComponent;

  // Fallback: first function export
  const anyFnKey = Object.keys(moduleExports).find(key => typeof moduleExports[key] === 'function');
  if (anyFnKey) return moduleExports[anyFnKey] as ScreenComponent;

  return null;
}

/**
 * DevToolsOverlay é um overlay de DEV (fora das Screens) que permite:
 * - pré-visualizar Screens (incluindo por Phase)
 * - abrir um dock flutuante com ações e playgrounds
 */
export function DevToolsOverlay() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Flow Store
  const phase = useFlowStore(state => state.phase);
  const setPhaseGuarded = useFlowStore(state => state.setPhaseGuarded);
  const resetRun = useFlowStore(state => state.resetRun);

  // Notification Store
  const { show: showNotification, dismiss: dismissNotification, clear: clearNotifications } = useNotification();

  const screens = useMemo<DetectedScreen[]>(() => {
    const modules = import.meta.glob('../../screens/*.tsx', { eager: true }) as Record<
      string,
      Record<string, unknown>
    >;

    return Object.entries(modules)
      .map(([path, mod]) => {
        const Component = pickScreenComponent(mod);
        if (!Component) return null;

        const label = getScreenLabelFromPath(path);
        const key = path;
        return { key, label, Component };
      })
      .filter((x): x is DetectedScreen => Boolean(x))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const selected =
    selectedKey && selectedKey !== '__phase__' ? (screens.find(s => s.key === selectedKey) ?? null) : null;

  const PhaseRouterPreview = useMemo(() => {
    switch (phase) {
      case 'LOBBY':
        return <LobbyScreen />;
      case 'DRAFT':
        return <DraftScreen />;
      case 'MATCH':
        return <MatchScreen />;
      case 'RESULTS':
        return <ResultScreen />;
      default: {
        const _exhaustive: never = phase;
        return _exhaustive;
      }
    }
  }, [phase]);

  const previewNode = selectedKey === '__phase__' ? PhaseRouterPreview : selected ? <selected.Component /> : null;

  const screenOptions = useMemo(
    () => screens.map(screen => ({ key: screen.key, label: screen.label })),
    [screens],
  );

  return (
    <>
      <DevOverlayPreview preview={previewNode} />

      <DevDock>
        <DevMenu
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          screenOptions={screenOptions}
          phase={phase}
          setPhaseGuarded={setPhaseGuarded}
          resetRun={resetRun}
          showNotification={showNotification}
          dismissNotification={dismissNotification}
          clearNotifications={clearNotifications}
          onClosePreview={() => setSelectedKey(null)}
        />
      </DevDock>
    </>
  );
}


