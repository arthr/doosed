import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LobbyPanel } from '@/components/lobby/LobbyPanel';

interface ChatInterfaceProps {
  isOpen: boolean;
  onToggle: () => void;
}

const desktopTerminalClassName = cn(
  'relative hidden flex-2 flex-col',
  'border-border rounded-xl border-4 bg-black',
  'text-rick-green p-2 font-mono',
  'shadow-pixel md:flex',
);

export function ChatInterface({ isOpen, onToggle }: ChatInterfaceProps) {
  return (
    <>
      {/* Desktop View: Always visible terminal */}
      <div className={desktopTerminalClassName}>
        <div className="border-border bg-ui-panel/50 absolute top-0 right-0 left-0 flex h-6 items-center border-b px-2 text-xs text-neutral-500 select-none">
          TERMINAL_LOG.TXT
        </div>

        <div className="custom-scrollbar mt-6 h-full grow space-y-1 overflow-y-auto p-2">
          <div className="opacity-80">
            <span className="text-neutral-500">[12:01]</span>{' '}
            <span className="font-bold text-neutral-300">RICK:</span> Hurry up, Morty, I got places
            to be!
          </div>
          <div className="opacity-80">
            <span className="text-neutral-500">[12:02]</span>{' '}
            <span className="font-bold text-neutral-300">MORTY:</span> Aw jeez, are we starting
            soon?
          </div>
          <div className="opacity-80">
            <span className="text-neutral-500">[12:03]</span>{' '}
            <span className="font-bold text-neutral-300">BIRDPERSON:</span> Patience, Morty.
          </div>
          <div className="opacity-80">
            <span className="text-neutral-500">[12:03]</span>{' '}
            <span className="font-bold text-neutral-300">SQUANCHY:</span> I'm squanching here!
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 pb-1">
          <span className="animate-pulse">{'>'}</span>
          <input
            type="text"
            placeholder="Enter message..."
            className="text-rick-green w-full border-none bg-transparent font-mono placeholder-neutral-700 focus:ring-0 focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile View: Toggle Button + Modal/Drawer logic (Simplified to toggle for now) */}
      <button
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
          <MessageSquareIcon className="h-5 w-5" />
          CHAT LOG {isOpen ? '(OPEN)' : ''}
        </span>
        <ChevronRight className={cn('transition-transform', isOpen ? 'rotate-90' : '')} />
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
          <LobbyPanel className="border-rick-green text-rick-green grow overflow-y-auto border bg-black p-2 font-mono">
            <div>&gt; Rick: Hurry up!</div>
            <div>&gt; Morty: Ok ok!</div>
          </LobbyPanel>
          <input
            className="border-border mt-2 border bg-black p-4 text-white"
            placeholder="Type here..."
            autoFocus
          />
        </div>
      )}
    </>
  );
}

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
