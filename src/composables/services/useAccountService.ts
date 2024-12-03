import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum AccountRoute {
  BASE = 'account', // GET
  NAME = 'account/name', // PATCH
}

export interface AccountData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  credit: any;
  organisation: any;
  team: any;
}

export function useAccountService() {
  const ac = new AbortController();

  async function fetchAccountData() {
    const route = getRoute(AccountRoute.BASE);
    const response = await $axios.get<AccountData>(route, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch account data');
    }

    return response.data;
  }

  async function updateName(data: { firstName: string; lastName: string }) {
    try {
      const route = getRoute(AccountRoute.NAME);
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
      };
      console.log(payload);
      const response = await $axios.patch(route, payload);
      // if (response.status !== 200) {
      //   throw new Error('Failed to update name');
      // }
      return response.data;
    } catch (error) {
      throw new Error('Failed to update name');
    }
  }

  // TODO: find alternative to onScopeDispose
  // onScopeDispose(() => {
  //   ac.abort();
  // });

  return {
    fetchAccountData,
    updateName,
  };
}
