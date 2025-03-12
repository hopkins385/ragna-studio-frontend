import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { BaseApiService } from '@/common/service/base-api.service';
import type { AccountData } from '@/modules/account/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiAccountRoute = {
  BASE: '/account', // GET
  NAME: '/account/name', // PATCH
  PASSWORD: '/account/password', // PATCH
  DELETE: '/account/delete', // DELETE
} as const;

export class AiChatService extends BaseApiService {
  constructor() {
    super();
  }

  public async fetchAccountData() {
    const api = newApiRequest();
    const route = getRoute(ApiAccountRoute.BASE);
    const { status, data } = await this.api
      .GET<AccountData>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateName(payload: { firstName: string; lastName: string }) {
    const route = getRoute(ApiAccountRoute.NAME);
    const { status, data } = await this.api
      .PATCH<AccountData, never, { firstName: string; lastName: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updatePassword(payload: { oldPassword: string; newPassword: string }) {
    const route = getRoute(ApiAccountRoute.PASSWORD);
    const { status, data } = await this.api
      .PATCH<AccountData, never, { oldPassword: string; newPassword: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteAccount(payload: { password: string }) {
    const route = getRoute(ApiAccountRoute.DELETE);
    const { status, data } = await this.api
      .DELETE<AccountData, never, { password: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const accountService = new AiChatService();
