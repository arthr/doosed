import { cn } from '@/lib/cn';
import type { ReactNode } from 'react';

export function ActionsSection({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('flex min-h-0 flex-col', className)}>
            {/* <SectionHeader icon={<Joystick size={20} />} title="Actions" /> */}
            <div className="flex h-full min-h-0 flex-col">{children}</div>
        </div>
    );
}