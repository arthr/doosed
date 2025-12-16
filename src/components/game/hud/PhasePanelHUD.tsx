import { cn } from '@/lib/cn';
import { StatsInventorySection } from '@/components/game/hud/StatsInventorySection';
import { ChatSection } from '@/components/game/hud/ChatSection';
import { ActionsSection } from '@/components/game/hud/ActionsSections';
import { PanelShell } from '@/components/game/hud/PanelShell';

import type { PhasePanelHUDProps } from '@/types/hud';
import PlayerInfo from './PlayerInfo';
import { Chat } from '@/components/chat/Chat';


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
                    <PlayerInfo
                        size='md'
                        characterName="Rick Sanchez"
                        avatarSrc="/images/avatar/rick_winner.png"
                        currentHealth={2}
                        currentResistance={3}
                        inventoryItems={[]}
                        totalInventorySlots={8}
                        className="flex flex-col md:col-span-5"
                    />

                    <div className="flex flex-col gap-2 md:col-start-7 md:col-span-6">
                        <div className={cn('flex min-h-0 flex-col')}>
                            {/* <SectionHeader icon={<Joystick size={20} />} title="Actions" /> */}
                            <div className="flex h-full min-h-0 flex-col">{props.actions}</div>
                        </div>
                        <Chat
                            mode="inline"
                            threadId={props.chatThreadId}
                            textClass="text-[10px] md:text-xs"
                            displayTime={false}
                            displayAuthor={false}
                            className="h-40"
                        />
                    </div>
                </div>
            </PanelShell>
        );
    }

    if (props.phase === 'match') {
        return (
            <PanelShell className={cn('w-full', props.className)}>
                <div className="grid min-h-0 grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
                    <StatsInventorySection playerName="Rick Sanchez" inventory={props.inventory ?? { items: [], maxSlots: 8 }} className="md:col-span-4" />
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


