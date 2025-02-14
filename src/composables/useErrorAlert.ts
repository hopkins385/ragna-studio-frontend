// composables/useErrorAlert.ts

export function useErrorAlert() {
  const { t } = useI18n();
  const errorAlert = reactive({ open: false, message: '' });

  const setErrorAlert = (error: unknown) => {
    if (error instanceof Error) {
      errorAlert.message = error.message;
    } else if (typeof error === 'string') {
      errorAlert.message = error;
    } else {
      errorAlert.message = t('error.default');
    }
    errorAlert.open = true;
  };

  const setDefaultErrorAlert = () => {
    errorAlert.open = true;
    errorAlert.message = t('error.default');
  };

  const unsetErrorAlert = () => {
    errorAlert.open = false;
    errorAlert.message = '';
  };

  return {
    errorAlert,
    setErrorAlert,
    setDefaultErrorAlert,
    unsetErrorAlert,
  };
}
