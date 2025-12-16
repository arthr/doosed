import '@/index.css';
import { initChatSystemBridge } from '@/stores/initChatSystemBridge';
import { ScreenShell } from '@/components/app/ScreenShell';
import { DevToolsOverlay } from '@/components/dev/DevToolsOverlay';
import { ScreenRouter } from '@/components/app/ScreenRouter';

initChatSystemBridge();

function App() {
  return (
    <ScreenShell devTools={import.meta.env.DEV ? <DevToolsOverlay /> : null}>
      <ScreenRouter />
    </ScreenShell>
  );
}
export default App;
