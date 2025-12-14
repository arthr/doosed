import { useEffect } from 'react';
import { cn } from '@/lib/cn';
import { useChatStore } from '@/stores/chatStore';
import type { ChatAuthor } from '@/types/chat';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { MobileChatToggleButton } from '@/components/chat/MobileChatToggleButton';

interface ChatInlineProps {
  threadId: string;
  className?: string;
  currentUser?: ChatAuthor;
  placeholder?: string;
}

export function ChatInline({
  threadId,
  className = '',
  currentUser,
  placeholder,
}: ChatInlineProps) {
  const isOpen = useChatStore(state => state.isOpen);
  const toggle = useChatStore(state => state.toggle);
  const ensureThread = useChatStore(state => state.ensureThread);
  const markRead = useChatStore(state => state.markRead);
  const unreadCount = useChatStore(state => state.threads[threadId]?.unreadCount ?? 0);

  useEffect(() => {
    ensureThread(threadId);
  }, [ensureThread, threadId]);

  useEffect(() => {
    const unregister = useChatStore.getState().registerInlineHost();
    return unregister;
  }, []);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="hidden md:flex md:h-full">
        <ChatPanel
          threadId={threadId}
          currentUser={currentUser}
          placeholder={placeholder}
          className="h-full"
        />
      </div>

      <MobileChatToggleButton
        isOpen={isOpen}
        unreadCount={unreadCount}
        onToggle={() => {
          toggle(threadId);
          markRead(threadId);
        }}
      />

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 md:hidden">
          <div className="mb-4 flex items-center justify-between">
            <div className="font-bold tracking-widest text-neutral-300 uppercase">CHAT</div>
            <button
              type="button"
              onClick={() => toggle(threadId)}
              className="border border-white px-4 py-2 font-bold text-white uppercase"
            >
              Fechar [X]
            </button>
          </div>
          <ChatPanel
            threadId={threadId}
            currentUser={currentUser}
            placeholder={placeholder}
            className="grow"
          />
        </div>
      ) : null}
    </div>
  );
}
