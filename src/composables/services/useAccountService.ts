import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum AccountRoute {
  BASE = 'account', // GET
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

  async function updateAccountData(data: {
    name: string;
    email: string;
    age: number;
  }) {
    // This is a placeholder for the actual implementation
    console.log('Updating account data:', data);
  }

  // TODO: find alternative to onScopeDispose
  // onScopeDispose(() => {
  //   ac.abort();
  // });

  return {
    fetchAccountData,
    updateAccountData,
  };
}
