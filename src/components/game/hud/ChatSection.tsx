import { cn } from '@/lib/cn';
import { Chat } from '@/components/chat/Chat';

export function ChatSection({ threadId, className = '', displayTime = true, displayAuthor = true }: { threadId: string; className?: string; displayTime?: boolean; displayAuthor?: boolean }) {
    return (
        <div className={cn('flex flex-col', className)}>
            {/* <SectionHeader
                icon={<Terminal size={20} />}
                title="Chat"
                className="hidden md:flex"
            /> */}
            <div className="flex h-auto shrink-0 flex-col gap-3 md:h-40 md:flex-row md:gap-4">
                <Chat
                    mode="inline"
                    threadId={threadId}
                    textClass="text-[10px] md:text-xs"
                    className="h-full"
                    displayTime={displayTime}
                    displayAuthor={displayAuthor}
                />
            </div>

        </div>
    );
}