import '@/index.css';
import { Chat } from '@/components/chat/Chat';
import { initChatSystemBridge } from '@/stores/initChatSystemBridge';
import { DevScreen } from '@/screens/DevScreen';
import HomeScreen from '@/screens/HomeScreen';

initChatSystemBridge();

function App() {
  return (
    <>
      <HomeScreen />
      <Chat mode="dock" />
      {import.meta.env.DEV ? <DevScreen /> : null}
    </>
  );
}
export default App;
