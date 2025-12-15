import { User } from 'lucide-react';
import { cn } from '@/lib/cn';
import { PlayerDashboardPanel } from '@/components/game/hud/PlayerDashboardPanel';
import { SectionHeader } from '@/components/game/hud/SectionHeader';
import { InventorySection } from '@/components/game/hud/InventorySection';
import { ChatSection } from '@/components/game/hud/ChatSection';
import { ActionsSection } from '@/components/game/hud/ActionsSections';
import { PanelShell } from '@/components/game/hud/PanelShell';

import type { PhasePanelHUDProps } from '@/types/hud';


export function PhasePanelHUD(props: PhasePanelHUDProps) {
    if (props.phase === 'lobby') {
        return (
            <PanelShell className={cn('w-full', props.className)}>
                <div className="grid min-h-0 grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
                    <ChatSection
                        threadId={props.chatThreadId}
                        displayTime={false}
                        displayAuthor={false}
                        className="flex flex-col md:col-span-8"
                    />
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
                    <ChatSection
                        threadId={props.chatThreadId}
                        displayTime={false}
                        displayAuthor={false}
                        className="flex flex-col md:col-span-5"
                    />
                    <ActionsSection className="md:col-span-3">{props.actions}</ActionsSection>
                </div>
            </PanelShell>
        );
    }

    if (props.phase === 'match') {
        return (
            <PanelShell className={cn('w-full', props.className)}>
                <div className="grid min-h-0 grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
                    <div className="md:col-span-4 min-h-0">
                        <SectionHeader icon={<User size={20} />} title="PROFILE" />
                        <PlayerDashboardPanel playerName="Rick Sanchez" />
                    </div>
                    <ChatSection
                        threadId={props.chatThreadId}
                        displayTime={false}
                        displayAuthor={false}
                        className="flex flex-col md:col-span-5"
                    />
                    <ActionsSection className="md:col-span-3">{props.actions}</ActionsSection>
                </div>
            </PanelShell>
        );
    }

    return null;
}


