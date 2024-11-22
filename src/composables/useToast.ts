import { toast } from 'vue-sonner';

interface IToast {
  description: string;
}

export default function useToast() {
  const config = {
    successDuration: 2000,
    errorDuration: 4000,
  };

  function success(payload: IToast) {
    toast.success('Success', {
      description: payload.description,
      duration: config.successDuration,
    });
  }

  function error(payload: IToast) {
    toast.error('Error', {
      description: payload.description,
      duration: config.errorDuration,
    });
  }

  return {
    success,
    error,
  };
}
