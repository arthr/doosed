import '@/index.css';
import { initChatSystemBridge } from '@/stores/initChatSystemBridge';
import { DevScreen } from '@/screens/DevScreen';
import HomeScreen from '@/screens/HomeScreen';
import { ScreenShell } from '@/components/app/ScreenShell';

initChatSystemBridge();

function App() {
  return (
    <ScreenShell devTools={import.meta.env.DEV ? <DevScreen /> : null}>
      <HomeScreen />
    </ScreenShell>
  );
}
export default App;
