import { cn } from '@/lib/cn';
import type { Phase } from '@/core/state-machines/phase';
import type { NotificationVariant } from '@/stores/notificationStore';
import { DevPhaseControls } from './DevPhaseControls';
import { NotificationPlayground } from './NotificationPlayground';

export interface DevMenuScreenOption {
  key: string;
  label: string;
}

export interface DevMenuProps {
  selectedKey: string | null;
  setSelectedKey: (value: string | null) => void;
  screenOptions: DevMenuScreenOption[];

  phase: Phase;
  setPhaseGuarded: (phase: Phase) => void;
  resetRun: () => void;

  showNotification: (args: { message: string; variant: NotificationVariant; durationTime: number }) => void;
  dismissNotification: () => void;
  clearNotifications: () => void;

  onClosePreview: () => void;
}

export function DevMenu({
  selectedKey,
  setSelectedKey,
  screenOptions,
  phase,
  setPhaseGuarded,
  resetRun,
  showNotification,
  dismissNotification,
  clearNotifications,
  onClosePreview,
}: DevMenuProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-2">
        <span className="text-xs tracking-wider text-neutral-400 uppercase">Tela</span>
        <select
          value={selectedKey ?? ''}
          onChange={e => setSelectedKey(e.target.value ? e.target.value : null)}
          className={cn(
            'w-full',
            'rounded border-2 border-neutral-700 bg-black',
            'px-3 py-2 text-sm text-white',
            'focus:ring-2 focus:ring-neutral-600 focus:outline-none',
          )}
        >
          <option value="">(sem preview)</option>
          <option value="__phase__">(seguir phase)</option>
          {screenOptions.map(screen => (
            <option key={screen.key} value={screen.key}>
              {screen.label}
            </option>
          ))}
        </select>
      </label>

      <DevPhaseControls phase={phase} setPhaseGuarded={setPhaseGuarded} resetRun={resetRun} />

      <NotificationPlayground
        showNotification={showNotification}
        dismissNotification={dismissNotification}
        clearNotifications={clearNotifications}
      />

      <button
        type="button"
        onClick={onClosePreview}
        className={cn(
          'font-pixel',
          'rounded border-2 border-neutral-700 bg-neutral-900',
          'px-3 py-2 text-xs tracking-wider text-white uppercase',
          'hover:border-neutral-300 hover:bg-neutral-800',
        )}
      >
        Fechar preview
      </button>
    </div>
  );
}
