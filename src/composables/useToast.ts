import { toast } from 'vue-sonner';

interface IToast {
  description: string;
}

export default function useToast() {
  const { t } = useI18n();
  const config = {
    successDuration: 2000,
    errorDuration: 4000,
  };

  const success = (payload: IToast) => {
    toast.success(t('toast.success.title'), {
      description: t(payload.description),
      duration: config.successDuration,
    });
  };

  const error = (payload: IToast) => {
    toast.error(t('toast.error.title'), {
      description: payload.description,
      duration: config.errorDuration,
    });
  };

  const info = (payload: IToast) => {
    toast.info(t('toast.info.title'), {
      description: payload.description,
      duration: config.errorDuration,
    });
  };

  return {
    success,
    error,
    info,
  };
}
