import '@/index.css';
import { Chat } from '@/components/chat/Chat';
import { NotificationBar } from '@/components/ui/NotificationBar';
import { initChatSystemBridge } from '@/stores/initChatSystemBridge';
import { DevScreen } from '@/screens/DevScreen';
import HomeScreen from '@/screens/HomeScreen';

initChatSystemBridge();

function App() {
  return (
    <>
      <HomeScreen />
      <Chat mode="dock" />
      <NotificationBar />
      {import.meta.env.DEV ? <DevScreen /> : null}
    </>
  );
}
export default App;
