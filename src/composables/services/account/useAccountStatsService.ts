import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

const AccountStatsRoute = {
  TOKEN_HISTORY: '/token-usage/history', // GET
} as const;

export type AccountStatsRoute = (typeof AccountStatsRoute)[keyof typeof AccountStatsRoute];

export interface TokenUsage {
  totalTokens: number;
  createdAt: Date;
  llm: {
    provider: string;
    displayName: string;
  };
}

interface TokenUsageHistoryResponse {
  tokenUsages: TokenUsage[];
}

export function useAccountStatsService() {
  let ac = new AbortController();

  const abortRequest = () => {
    if (ac) ac.abort();
    ac = new AbortController();
  };

  const fetchTokenHistory = async () => {
    const api = newApiRequest();
    const route = getRoute(AccountStatsRoute.TOKEN_HISTORY);
    const { status, data } = await api
      .GET<TokenUsageHistoryResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  onScopeDispose(() => {
    abortRequest();
  });

  return {
    abortRequest,
    fetchTokenHistory,
  };
}
