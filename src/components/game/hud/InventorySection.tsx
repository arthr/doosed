import { cn } from "@/lib/cn";
import { Backpack } from "lucide-react";
import { SectionHeader } from "@/components/game/hud/SectionHeader";
import { InventorySlot } from "@/components/game/hud/InventorySlot";

import type { PhasePanelHUDInventory } from "@/types/inventory";

export function InventorySection({
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
            <div className="grid grid-cols-8 gap-2 sm:gap-4 md:grid-cols-5 md:gap-4">
                {[...Array(maxSlots)].map((_, i) => (
                    <div key={i} className="col-span-1 w-full">
                        <InventorySlot item={items[i]} />
                    </div>
                ))}
            </div>
        </div>
    );
}