import { CromolumAnimated } from '@/components/ui/decorations/CromolumAnimated';
import { PortalGunAnimated } from '@/components/ui/decorations/PortalGunAnimated';

export function HomeDecorations() {
  return (
    <>
      <div className="hidden lg:block absolute left-[-230px] top-60">
        <PortalGunAnimated size="md" rotation={12} />
      </div>
      <div className="hidden lg:block absolute right-[-230px] top-0">
        <CromolumAnimated size="md" rotation={-12} />
      </div>
    </>
  );
}
