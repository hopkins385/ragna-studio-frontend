export interface MediaAbleModel {
  id: string;
  type: string;
}

export function useMediaAbleService() {
  const ac = new AbortController();

  onScopeDispose(() => {
    ac.abort();
  });

  const attachMediaTo = async (
    mediaId: string,
    { model }: { model: MediaAbleModel },
  ) => {
    throw new Error('Not implemented');
  };

  const detachMediaFrom = async () => {
    throw new Error('Not implemented');
  };

  return {
    attachMediaTo,
    detachMediaFrom,
  };
}
