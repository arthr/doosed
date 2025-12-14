import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useChatStore } from '@/store/useChatStore';
import type { ChatAuthor, ChatMessage } from '@/types/chat';

type ChatMode = 'dock' | 'inline';

export interface ChatProps {
  mode: ChatMode;
  threadId?: string;
  className?: string;
  currentUser?: ChatAuthor;
  placeholder?: string;
}

function formatTime(createdAt: number) {
  try {
    const date = new Date(createdAt);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--:--';
  }
}

function MessageRow({ message }: { message: ChatMessage }) {
  if (message.kind === 'system') {
    return (
      <div className="opacity-80">
        <span className="text-neutral-500">[{formatTime(message.createdAt)}]</span>{' '}
        <span className="font-bold text-neutral-400">SISTEMA:</span>{' '}
        <span className="text-neutral-300">{message.text}</span>
      </div>
    );
  }

  const authorName = message.author?.name ?? 'PLAYER';
  return (
    <div className="opacity-90">
      <span className="text-neutral-500">[{formatTime(message.createdAt)}]</span>{' '}
      <span className="font-bold text-neutral-300">{authorName.toUpperCase()}:</span>{' '}
      <span className="text-rick-green">{message.text}</span>
    </div>
  );
}

function ChatPanel({
  threadId,
  currentUser,
  placeholder = 'Digite uma mensagem...',
  className = '',
}: {
  threadId: string;
  currentUser?: ChatAuthor;
  placeholder?: string;
  className?: string;
}) {
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
          <MessageRow key={message.id} message={message} />
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

function MobileChatToggleButton({
  isOpen,
  onToggle,
  unreadCount,
}: {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount: number;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'md:hidden',
        'flex w-full items-center justify-between',
        'border-border bg-ui-panel rounded-xl border-2',
        'p-4 font-bold text-neutral-300',
        'active:bg-black/30',
      )}
    >
      <span className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        CHAT {unreadCount > 0 ? `(${unreadCount})` : ''} {isOpen ? '(ABERTO)' : ''}
      </span>
      <ChevronRight className={cn('transition-transform', isOpen ? 'rotate-90' : '')} />
    </button>
  );
}

function InlineChat({
  threadId,
  className = '',
  currentUser,
  placeholder,
}: {
  threadId: string;
  className?: string;
  currentUser?: ChatAuthor;
  placeholder?: string;
}) {
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

function DockChat({
  threadId = 'global',
  currentUser,
  placeholder,
}: Omit<ChatProps, 'mode' | 'className'>) {
  const dockEnabled = useChatStore(state => state.dockEnabled);
  const isOpen = useChatStore(state => state.isOpen);
  const activeThreadId = useChatStore(state => state.activeThreadId);
  const threads = useChatStore(state => state.threads);
  const open = useChatStore(state => state.open);
  const close = useChatStore(state => state.close);
  const setActiveThread = useChatStore(state => state.setActiveThread);
  const markRead = useChatStore(state => state.markRead);

  const unreadTotal = useMemo(() => {
    return Object.values(threads).reduce((sum, t) => sum + (t.unreadCount ?? 0), 0);
  }, [threads]);

  const threadOptions = useMemo(() => {
    return Object.values(threads)
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [threads]);

  if (!dockEnabled) return null;

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => open(threadId)}
        className={cn(
          'fixed right-4 bottom-4 z-50',
          'border-border shadow-pixel bg-ui-panel flex items-center gap-2 rounded-full border-4 px-4 py-2',
          'font-mono text-xs font-black tracking-widest text-neutral-200 uppercase',
          'hover:bg-black/20 active:translate-y-0.5',
        )}
      >
        <MessageSquare className="text-morty-yellow h-4 w-4" />
        CHAT
        {unreadTotal > 0 ? (
          <span className="bg-rick-green text-space-black rounded-full px-2 py-0.5 text-[10px] font-black">
            {unreadTotal}
          </span>
        ) : null}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'fixed md:right-3 bottom-15 z-50',
        'w-full md:w-[min(440px,calc(100vw-2rem))]',
        'h-[min(520px,calc(100vh-2rem))]',
      )}
    >
      <div className="border-border shadow-pixel bg-ui-panel flex items-center justify-between gap-2 rounded-t-xl border-4 border-b-0 px-3 py-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-morty-yellow h-4 w-4" />
          <span className="font-mono text-xs font-black tracking-widest text-neutral-200 uppercase">
            CHAT
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeThreadId}
            onChange={e => {
              const next = e.target.value;
              setActiveThread(next);
              markRead(next);
            }}
            className={cn(
              'border-border bg-black text-neutral-200',
              'rounded border px-2 py-1 font-mono text-xs',
              'focus:ring-0 focus:outline-none',
            )}
          >
            {threadOptions.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            aria-label="Fechar chat"
            onClick={() => close()}
            className={cn(
              'border-border rounded border bg-black p-1 text-neutral-200',
              'hover:bg-black/40 active:translate-y-0.5',
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <ChatPanel
        threadId={activeThreadId}
        currentUser={currentUser}
        placeholder={placeholder}
        className="h-full rounded-t-none border-t-0"
      />
    </div>
  );
}

export function Chat({
  mode,
  threadId = 'global',
  className = '',
  currentUser,
  placeholder,
}: ChatProps) {
  const ensureThread = useChatStore(state => state.ensureThread);
  const threadTitle = useChatStore(state => state.threads[threadId]?.title);

  useEffect(() => {
    ensureThread(threadId, threadTitle ?? threadId.toUpperCase());
  }, [ensureThread, threadId, threadTitle]);

  if (mode === 'inline') {
    return (
      <InlineChat
        threadId={threadId}
        className={className}
        currentUser={currentUser}
        placeholder={placeholder}
      />
    );
  }

  return <DockChat threadId={threadId} currentUser={currentUser} placeholder={placeholder} />;
}
