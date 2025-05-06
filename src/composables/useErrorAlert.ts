// composables/useErrorAlert.ts

interface ErrorAlertState {
  open: boolean;
  title: string | null;
  description: string | null;
}

interface ErrorAlertPayload {
  title: string;
  description: string;
}

export function useErrorAlert() {
  const errorAlert = reactive<ErrorAlertState>({
    open: false,
    title: null,
    description: null,
  });

  const setErrorAlert = (error: ErrorAlertPayload | Error | unknown) => {
    if (error instanceof Error) {
      errorAlert.title = error.name;
      errorAlert.description = error.message;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'description' in error &&
      'title' in error
    ) {
      errorAlert.title = error?.title ? (error.title as string) : 'alert.error.default.title';
      errorAlert.description = error?.description
        ? (error.description as string)
        : 'alert.error.default.description';
    } else if (typeof error === 'string') {
      // Handle string errors
      errorAlert.title = 'alert.error.default.title';
      errorAlert.description = error;
    } else if (Array.isArray(error)) {
      // Handle array errors
      errorAlert.title = 'alert.error.default.title';
      errorAlert.description = error.join(', ');
    } else {
      // Default case for truly unknown types
      errorAlert.title = 'alert.error.default.title';
      errorAlert.description = 'alert.error.default.description';
    }
    errorAlert.open = true;
  };

  const setDefaultErrorAlert = () => {
    errorAlert.open = true;
    errorAlert.title = 'alert.error.default.title';
    errorAlert.description = 'alert.error.default.description';
  };

  const unsetErrorAlert = () => {
    errorAlert.open = false;
    errorAlert.title = null;
    errorAlert.description = null;
  };

  return {
    errorAlert,
    setErrorAlert,
    setDefaultErrorAlert,
    unsetErrorAlert,
  };
}
