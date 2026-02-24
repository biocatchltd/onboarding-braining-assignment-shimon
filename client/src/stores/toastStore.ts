import { makeAutoObservable } from 'mobx';

/** Toast severity levels */
export type ToastSeverity = 'success' | 'error' | 'info';

/**
 * MobX store for global toast notifications.
 * Used to show success/error messages after API calls.
 */
export class ToastStore {
  open = false;
  message = '';
  severity: ToastSeverity = 'info';

  constructor() {
    makeAutoObservable(this);
  }

  /** Show a toast with the given message and severity */
  show(message: string, severity: ToastSeverity = 'info') {
    this.message = message;
    this.severity = severity;
    this.open = true;
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  close() {
    this.open = false;
  }
}

export const toastStore = new ToastStore();
