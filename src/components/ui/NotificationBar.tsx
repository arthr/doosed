import { useNotificationStore, type NotificationType } from '@/stores/notificationStore';
import { cn } from '@/lib/cn';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';

const typeStyles: Record<NotificationType, { container: string; icon: typeof AlertTriangle }> = {
  critical: {
    container: 'bg-red-900/95 border-red-600 shadow-[0_-5px_20px_rgba(220,38,38,0.5)]',
    icon: XCircle,
  },
  warning: {
    container: 'bg-yellow-900/95 border-yellow-600 shadow-[0_-5px_20px_rgba(202,138,4,0.5)]',
    icon: AlertTriangle,
  },
  info: {
    container: 'bg-cyan-900/95 border-cyan-600 shadow-[0_-5px_20px_rgba(6,182,212,0.5)]',
    icon: Info,
  },
  success: {
    container: 'bg-green-900/95 border-green-600 shadow-[0_-5px_20px_rgba(34,197,94,0.5)]',
    icon: CheckCircle,
  },
};

const typeTextColors: Record<NotificationType, string> = {
  critical: 'text-red-100',
  warning: 'text-yellow-100',
  info: 'text-cyan-100',
  success: 'text-green-100',
};

export function NotificationBar() {
  const current = useNotificationStore(state => state.current);
  const dismiss = useNotificationStore(state => state.dismiss);

  if (!current) return null;

  const style = typeStyles[current.type];
  const Icon = style.icon;
  const textColor = typeTextColors[current.type];

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 w-full border-t-4 p-2 z-50',
        'animate-in slide-in-from-bottom duration-300',
        style.container,
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
        <Icon className={cn('h-5 w-5 shrink-0', textColor)} />
        <span
          className={cn(
            'font-pixel text-sm lg:text-base uppercase tracking-wider',
            textColor,
          )}
        >
          {current.message}
        </span>
        {current.duration === 0 && (
          <button
            onClick={() => dismiss(current.id)}
            className={cn('p-1 hover:bg-white/10 rounded', textColor)}
            aria-label="Fechar notificacao"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
