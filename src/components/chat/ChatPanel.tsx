import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useChatStore } from '@/store/useChatStore';
import type { ChatAuthor } from '@/types/chat';
import { ChatMessageRow } from '@/components/chat/ChatMessageRow';

interface ChatPanelProps {
  threadId: string;
  currentUser?: ChatAuthor;
  placeholder?: string;
  className?: string;
}

export function ChatPanel({
  threadId,
  currentUser,
  placeholder = 'Digite uma mensagem...',
  className = '',
}: ChatPanelProps) {
  const messages = useChatStore(state => state.threads[threadId]?.messages ?? []);
  const sendMessage = useChatStore(state => state.sendMessage);
  const focusInputNonce = useChatStore(state => state.focusInputNonce);

  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [focusInputNonce]);

  const onSubmit = () => {
    const value = text;
    sendMessage({ text: value, author: currentUser, threadId });
    setText('');
  };

  return (
    <div
      className={cn(
        'border-border shadow-pixel relative flex flex-col overflow-hidden rounded-xl border-4 bg-black',
        'font-mono text-xs md:text-sm',
        className,
      )}
    >
      <div className={cn('bg-scanlines pointer-events-none absolute inset-0 opacity-20')} />

      <div
        role="log"
        aria-label="Chat"
        aria-live="polite"
        className={cn('custom-scrollbar relative h-full grow space-y-1 overflow-y-auto p-3')}
      >
        {messages.map(message => (
          <ChatMessageRow key={message.id} message={message} />
        ))}
        <div ref={endRef} />
      </div>

      <form
        className="relative flex items-center gap-2 border-t border-neutral-800 px-3 py-2"
        onSubmit={event => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <span className="animate-pulse text-neutral-400">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'text-rick-green w-full border-none bg-transparent font-mono placeholder-neutral-700',
            'focus:ring-0 focus:outline-none',
          )}
        />
        <button
          type="submit"
          className={cn(
            'border-border bg-ui-panel text-foreground rounded border px-3 py-1 font-bold uppercase',
            'hover:bg-black/20 active:translate-y-0.5',
          )}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
