import '@/index.css';
import { initChatSystemBridge } from '@/stores/initChatSystemBridge';
import HomeScreen from '@/screens/HomeScreen';
import { ScreenShell } from '@/components/app/ScreenShell';
import { DevToolsOverlay } from '@/components/dev/DevToolsOverlay';

initChatSystemBridge();

function App() {
  return (
    <ScreenShell devTools={import.meta.env.DEV ? <DevToolsOverlay /> : null}>
      <HomeScreen />
    </ScreenShell>
  );
}
export default App;
