import { getRagnaClient } from '@/common/http/ragna.client';

export function useRagnaClient() {
  const client = getRagnaClient();

  if (!client) {
    throw new Error('RagnaClient is not provided');
  }
  return client;
}
