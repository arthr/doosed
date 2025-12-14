import { DevScreen } from '@/screens/DevScreen';
import '@/index.css';
import { Chat } from '@/components/chat/Chat';
function App() {
  return (
    <>
      <DevScreen />
      <Chat mode="dock" />
    </>
  );
}
export default App;
