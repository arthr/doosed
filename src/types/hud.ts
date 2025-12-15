import type { ReactNode } from "react";
import { InventoryItem } from "./inventory";

export type BasePhasePanelHUDProps = {
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
    } & BasePhasePanelHUDProps)
    | ({
        phase: 'draft';
        chatThreadId: string;
        inventory: PhasePanelHUDInventory;
        actions: ReactNode;
    } & BasePhasePanelHUDProps)
    | ({
        phase: 'match';
        chatThreadId: string;
        inventory?: PhasePanelHUDInventory;
        actions: ReactNode;
    } & BasePhasePanelHUDProps);