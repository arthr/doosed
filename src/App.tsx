import { DevScreen } from '@/screens/DevScreen';
import '@/index.css';
import { Chat } from '@/components/chat/Chat';
import { initChatSystemBridge } from '@/store/initChatSystemBridge';

initChatSystemBridge();
function App() {
  return (
    <>
      <DevScreen />
      <Chat mode="dock" />
    </>
  );
}
export default App;
