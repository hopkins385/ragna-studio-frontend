// usePromise composable

import type { UnwrapRef } from 'vue';

interface PromiseError {
  message: string;
  name: string;
  stack?: string;
}

interface State<T> {
  data: T | undefined;
  error: PromiseError | null;
  loading: boolean;
}

export async function usePromise<T>(
  promiseFactory: () => Promise<T>,
  options?: { lazy?: boolean },
) {
  const { lazy = false } = options || {};
  const data = shallowRef<T | undefined>(undefined);
  const loading = shallowRef(false);
  const error = shallowRef<PromiseError | null>(null);

  const execute = async () => {
    loading.value = true;
    error.value = null;
    data.value = undefined;
    try {
      const result = await promiseFactory();
      data.value = result as unknown as UnwrapRef<T>;
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = {
          message: err.message,
          name: err.name,
          stack: err.stack,
        };
      } else {
        error.value = {
          message: String(error),
          name: 'UnknownError',
        };
      }
    } finally {
      loading.value = false;
    }
  };

  // If lazy is false, execute the promise immediately
  if (!lazy) {
    await execute();
  }

  return {
    data,
    error,
    loading: readonly(loading),
    execute,
  };
}
