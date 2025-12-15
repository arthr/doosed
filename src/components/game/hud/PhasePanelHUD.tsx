import type { ReactNode } from 'react';
import { Backpack, Joystick, Terminal } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Chat } from '@/components/chat/Chat';
import { InventorySlot, type InventoryItem } from '@/components/game/hud/InventorySlot';
import { PlayerDashboardPanel } from '@/components/game/hud/PlayerDashboardPanel';

type BaseProps = {
    className?: string;
};

export type PhasePanelHUDInventory = {
    items: InventoryItem[];
    maxSlots: number;
    title?: string;
};

export type PhasePanelHUDProps =
    | ({
        phase: 'lobby';
        chatThreadId: string;
        actions: ReactNode;
    } & BaseProps)
    | ({
        phase: 'draft';
        chatThreadId: string;
        inventory: PhasePanelHUDInventory;
        actions: ReactNode;
    } & BaseProps)
    | ({
        phase: 'match';
        chatThreadId: string;
        actions: ReactNode;
    } & BaseProps);

function PanelShell({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                'border-border-muted bg-panel shadow-pixel rounded-xl border-4',
                'p-3 sm:p-4 md:p-6',
                'min-h-0',
                className,
            )}
        >
            {children}
        </div>
    );
}

function SectionHeader({
    icon,
    title,
    className = '',
}: {
    icon: ReactNode;
    title: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('text-text-muted border-border-muted flex items-center gap-2 pb-4', className)}>
            {icon}
            <h2 className="text-sm uppercase">{title}</h2>
        </div>
    );
}

function InventorySection({
    inventory,
    className = '',
}: {
    inventory: PhasePanelHUDInventory;
    className?: string;
}) {
    const { items, maxSlots } = inventory;
    const title =
        inventory.title ??
        (typeof maxSlots === 'number' ? `Backpack (${items.length}/${maxSlots} Slots)` : 'Backpack');

    return (
        <div className={cn('min-h-0', className)}>
            <SectionHeader icon={<Backpack size={20} />} title={title} />
            <div className="grid grid-cols-8 gap-2 sm:gap-3 md:grid-cols-4 md:gap-4">
                {[...Array(maxSlots)].map((_, i) => (
                    <div key={i} className="col-span-1 w-full">
                        <InventorySlot item={items[i]} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ChatSection({ threadId, className = '' }: { threadId: string; className?: string }) {
    return (
        <div className={cn('flex min-h-0 flex-col', className)}>
            <SectionHeader
                icon={<Terminal size={20} />}
                title="Chat"
                className="hidden md:flex"
            />
            <div className="flex h-auto shrink-0 flex-col gap-3 md:h-full md:min-h-0 md:gap-4">
                <Chat mode="inline" threadId={threadId} />
            </div>

        </div>
    );
}

function ActionsSection({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex min-h-0 flex-col', className)}>
            <SectionHeader icon={<Joystick size={20} />} title="Actions" />
            <div className="flex h-full min-h-0 flex-col">{children}</div>
        </div>
    );
}

export function PhasePanelHUD(props: PhasePanelHUDProps) {
    if (props.phase === 'lobby') {
        return (
            <PanelShell className={cn('w-full', props.className)}>
                <div className="grid min-h-0 grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
                    <ChatSection threadId={props.chatThreadId} className="md:col-span-8" />
                    <ActionsSection className="md:col-span-4">{props.actions}</ActionsSection>
                </div>
            </PanelShell>
        );
    }

    if (props.phase === 'draft') {
        return (
            <PanelShell className={cn('w-full', props.className)}>
                <div className="grid min-h-0 grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
                    <InventorySection inventory={props.inventory} className="md:col-span-4" />
                    <ChatSection threadId={props.chatThreadId} className="md:col-span-5" />
                    <ActionsSection className="md:col-span-3">{props.actions}</ActionsSection>
                </div>
            </PanelShell>
        );
    }

    // match
    return (
        <PanelShell className={cn('w-full', props.className)}>
            <div className="grid min-h-0 grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
                <PlayerDashboardPanel className="md:col-span-3" />
                <ChatSection threadId={props.chatThreadId} className="md:col-span-6" />
                <ActionsSection className="md:col-span-3">{props.actions}</ActionsSection>
            </div>
        </PanelShell>
    );
}


