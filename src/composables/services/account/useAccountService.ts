import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

const AccountRoute = {
  BASE: '/account', // GET
  NAME: '/account/name', // PATCH
  PASSWORD: '/account/password', // PATCH
  DELETE: '/account/delete', // DELETE
} as const;

export interface AccountData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  totalCredits: number;
  email: string;
  emailVerified: boolean;
  organisation: any;
  roles: any;
  teams: any;
  firstTeamId: string;
  onboardedAt: string | null;
}

export function useAccountService() {
  const ac = new AbortController();

  const fetchAccountData = async () => {
    const api = newApiRequest();
    const route = getRoute(AccountRoute.BASE);
    const { status, data } = await api
      .GET<AccountData>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const updateName = async (payload: { firstName: string; lastName: string }) => {
    const api = newApiRequest();
    const route = getRoute(AccountRoute.NAME);
    const { status, data } = await api
      .PATCH<AccountData, never, { firstName: string; lastName: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const updatePassword = async (payload: { oldPassword: string; newPassword: string }) => {
    const api = newApiRequest();
    const route = getRoute(AccountRoute.PASSWORD);
    const { status, data } = await api
      .PATCH<AccountData, never, { oldPassword: string; newPassword: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const deleteAccount = async (payload: { password: string }) => {
    const api = newApiRequest();
    const route = getRoute(AccountRoute.DELETE);
    const { status, data } = await api
      .DELETE<AccountData, never, { password: string }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  // TODO: find alternative to onScopeDispose
  // onScopeDispose(() => {
  //   ac.abort();
  // });

  return {
    fetchAccountData,
    updateName,
    updatePassword,
    deleteAccount,
  };
}
