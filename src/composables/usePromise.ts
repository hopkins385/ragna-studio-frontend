// usePromise composable

import type { UnwrapRef } from 'vue';
import { reactive, toRefs } from 'vue';

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

export async function usePromise<T>(promise: Promise<T>, options?: { lazy?: boolean }) {
  const { lazy = false } = options || {};
  const state = reactive<State<T>>({
    data: undefined,
    error: null,
    loading: false,
  });

  const execute = async () => {
    state.loading = true;
    state.error = null;
    state.data = undefined;
    try {
      const result = await promise;
      state.data = result as unknown as UnwrapRef<T>;
    } catch (error: unknown) {
      if (error instanceof Error) {
        state.error = {
          message: error.message,
          name: error.name,
          stack: error.stack,
        };
      } else {
        state.error = {
          message: String(error),
          name: 'UnknownError',
        };
      }
    } finally {
      state.loading = false;
    }
  };

  // If lazy is false, execute the promise immediately
  if (!lazy) {
    await execute();
  }

  return {
    ...toRefs(state),
    execute,
  };
}
