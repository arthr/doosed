import '@/index.css';
import { Chat } from '@/components/chat/Chat';
import { NotificationBar } from '@/components/ui/NotificationBar';
import { initChatSystemBridge } from '@/stores/initChatSystemBridge';
import { DevScreen } from '@/screens/DevScreen';
import HomeScreen from '@/screens/HomeScreen';
import { PortalBackgroundAnimated } from './components/ui/decorations/PortalBackgroundAnimated';

initChatSystemBridge();

function App() {
  return (
    <>
      <PortalBackgroundAnimated quality="balanced" gooMotion="off" stars="full" portalScale={0.5} />
      <HomeScreen />
      <Chat mode="dock" />
      <NotificationBar />
      {import.meta.env.DEV ? <DevScreen /> : null}
    </>
  );
}
export default App;
