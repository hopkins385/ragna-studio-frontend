import { toast, type ExternalToast, type ToasterProps } from 'vue-sonner';

interface NotificationOptions {
  duration?: number;
  position?: ToasterProps['position'];
  description?: string;
}

export function useNotification() {
  const defaultOptions: NotificationOptions = {
    duration: 2000,
    position: 'top-right',
  };

  function showNotification(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    options?: NotificationOptions,
  ) {
    const finalOptions: ExternalToast<Component> = {
      ...defaultOptions,
      ...options,
    };
    toast[type](message, finalOptions);
  }

  function showSuccess(message: string, options?: NotificationOptions) {
    showNotification(message, 'success', options);
  }

  function showError(message: string, options?: NotificationOptions) {
    showNotification(message, 'error', options);
  }

  function showWarning(message: string, options?: NotificationOptions) {
    showNotification(message, 'warning', options);
  }

  function showInfo(message: string, options?: NotificationOptions) {
    showNotification(message, 'info', options);
  }

  function promiseNotification<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
    options?: NotificationOptions,
  ) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      ...options,
    });
  }

  function dismiss(toastId?: string) {
    toast.dismiss(toastId);
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    promiseNotification,
    dismiss,
  };
}
