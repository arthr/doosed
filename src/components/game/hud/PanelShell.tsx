import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function PanelShell({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                'border-neon-green shadow-pixel rounded-xl border-4',
                'p-3',
                'min-h-0',
                className,
            )}
        >
            {children}
        </div>
    );
}