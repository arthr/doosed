import type { ChatMessage } from '@/types/chat';
import { formatChatTime } from '@/components/chat/chatFormat';

interface ChatMessageRowProps {
  message: ChatMessage;
}

export function ChatMessageRow({ message }: ChatMessageRowProps) {
  if (message.kind === 'system') {
    return (
      <div className="opacity-80">
        <span className="text-neutral-500">[{formatChatTime(message.createdAt)}]</span>{' '}
        <span className="font-normal text-neutral-400">SISTEMA:</span>{' '}
        <span className="text-neutral-300">{message.text}</span>
      </div>
    );
  }

  const authorName = message.author?.name ?? 'PLAYER';
  return (
    <div className="opacity-90">
      <span className="text-neutral-500">[{formatChatTime(message.createdAt)}]</span>{' '}
      <span className="font-normal text-neutral-300">{authorName.toUpperCase()}:</span>{' '}
      <span className="text-neon-green">{message.text}</span>
    </div>
  );
}
