import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type {
  TokenUsageHistoryParams,
  TokenUsageHistoryResponse,
} from '@/modules/account/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiAccountStatsRoute = {
  TOKEN_HISTORY: '/token-usage/history', // GET
} as const;

export type ApiAccountStatsRoute = (typeof ApiAccountStatsRoute)[keyof typeof ApiAccountStatsRoute];

export class AccountStatsService extends BaseApiService {
  constructor() {
    super();
  }

  public async fetchTokenHistory(params: TokenUsageHistoryParams) {
    const route = getRoute(ApiAccountStatsRoute.TOKEN_HISTORY);
    const { status, data } = await this.api
      .GET<TokenUsageHistoryResponse, TokenUsageHistoryParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const accountStatsService = new AccountStatsService();
