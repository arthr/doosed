import { create } from 'zustand';

export type NotificationType = 'critical' | 'warning' | 'info' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number; // ms, 0 = persistent
}

interface NotificationStore {
  current: Notification | null;
  queue: Notification[];

  show: (params: { type: NotificationType; message: string; duration?: number }) => string;
  dismiss: (id?: string) => void;
  clear: () => void;
}

const DEFAULT_DURATION = 5000; // 5 segundos

function makeId() {
  const safeCrypto = typeof crypto !== 'undefined' ? crypto : undefined;
  const random = safeCrypto?.randomUUID?.();
  if (random) return `notif_${random}`;
  return `notif_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  current: null,
  queue: [],

  show: ({ type, message, duration = DEFAULT_DURATION }) => {
    const id = makeId();
    const notification: Notification = { id, type, message, duration };

    set(state => {
      // Se nao ha notificacao atual, exibe diretamente
      if (!state.current) {
        return { current: notification };
      }
      // Caso contrario, adiciona na fila
      return { queue: [...state.queue, notification] };
    });

    // Auto-dismiss se tiver duracao
    if (duration > 0) {
      setTimeout(() => {
        get().dismiss(id);
      }, duration);
    }

    return id;
  },

  dismiss: id => {
    set(state => {
      // Se nenhum ID especificado ou o ID corresponde ao atual
      if (!id || state.current?.id === id) {
        const [next, ...rest] = state.queue;
        // Inicia timer para proxima notificacao se existir
        if (next && next.duration > 0) {
          setTimeout(() => {
            get().dismiss(next.id);
          }, next.duration);
        }
        return { current: next ?? null, queue: rest };
      }
      // Remove da fila se estiver la
      return { queue: state.queue.filter(n => n.id !== id) };
    });
  },

  clear: () => {
    set({ current: null, queue: [] });
  },
}));

// Actions para uso externo (sem hooks)
export const notificationActions = {
  show(params: { type: NotificationType; message: string; duration?: number }) {
    return useNotificationStore.getState().show(params);
  },
  dismiss(id?: string) {
    useNotificationStore.getState().dismiss(id);
  },
  clear() {
    useNotificationStore.getState().clear();
  },
  // Helpers semanticos
  critical(message: string, duration?: number) {
    return this.show({ type: 'critical', message, duration });
  },
  warning(message: string, duration?: number) {
    return this.show({ type: 'warning', message, duration });
  },
  info(message: string, duration?: number) {
    return this.show({ type: 'info', message, duration });
  },
  success(message: string, duration?: number) {
    return this.show({ type: 'success', message, duration });
  },
};
