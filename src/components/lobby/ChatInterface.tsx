import React from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

interface ChatInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* Desktop View: Always visible terminal */}
      <div className="relative hidden flex-2 flex-col rounded-lg border-4 border-zinc-600 bg-black p-2 font-mono text-green-500 shadow-inner md:flex">
        <div className="absolute top-0 right-0 left-0 flex h-6 items-center border-b border-zinc-700 bg-zinc-800/50 px-2 text-xs text-zinc-500 select-none">
          TERMINAL_LOG.TXT
        </div>

        <div className="custom-scrollbar mt-6 h-full grow space-y-1 overflow-y-auto p-2">
          <div className="opacity-80">
            <span className="text-zinc-500">[12:01]</span>{' '}
            <span className="font-bold text-zinc-300">RICK:</span> Hurry up, Morty, I got places to
            be!
          </div>
          <div className="opacity-80">
            <span className="text-zinc-500">[12:02]</span>{' '}
            <span className="font-bold text-zinc-300">MORTY:</span> Aw jeez, are we starting soon?
          </div>
          <div className="opacity-80">
            <span className="text-zinc-500">[12:03]</span>{' '}
            <span className="font-bold text-zinc-300">BIRDPERSON:</span> Patience, Morty.
          </div>
          <div className="opacity-80">
            <span className="text-zinc-500">[12:03]</span>{' '}
            <span className="font-bold text-zinc-300">SQUANCHY:</span> I'm squanching here!
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 pb-1">
          <span className="animate-pulse">{'>'}</span>
          <input
            type="text"
            placeholder="Enter message..."
            className="w-full border-none bg-transparent font-mono text-green-400 placeholder-zinc-700 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile View: Toggle Button + Modal/Drawer logic (Simplified to toggle for now) */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-lg border-2 border-zinc-600 bg-zinc-800 p-4 font-bold text-zinc-300 active:bg-zinc-700 md:hidden"
      >
        <span className="flex items-center gap-2">
          <MessageSquareIcon className="h-5 w-5" />
          CHAT LOG {isOpen ? '(OPEN)' : ''}
        </span>
        <ChevronRight className={clsx('transition-transform', isOpen ? 'rotate-90' : '')} />
      </button>

      {/* Mobile Chat Drawer (Conditional) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-4 md:hidden">
          <div className="mb-4 flex justify-end">
            <button
              onClick={onToggle}
              className="border border-white px-4 py-2 font-bold text-white uppercase"
            >
              Close [X]
            </button>
          </div>
          <div className="grow overflow-y-auto border border-green-500 p-2 font-mono text-green-500">
            <div>&gt; Rick: Hurry up!</div>
            <div>&gt; Morty: Ok ok!</div>
          </div>
          <input
            className="mt-2 border border-zinc-700 bg-zinc-900 p-4 text-white"
            placeholder="Type here..."
            autoFocus
          />
        </div>
      )}
    </>
  );
};

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
