import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum AccountRoute {
  BASE = 'account', // GET, DELETE
  NAME = 'account/name', // PATCH
  PASSWORD = 'account/password', // PATCH
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

// Error class
export class AccountServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountServiceError';
  }
}

export function useAccountService() {
  const ac = new AbortController();

  const fetchAccountData = async () => {
    try {
      const route = getRoute(AccountRoute.BASE);
      const response = await $axios.get<AccountData>(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch account data');
      }

      return response.data;
    } catch (error) {
      throw new AccountServiceError('Failed to fetch account data');
    }
  };

  const updateName = async (payload: {
    firstName: string;
    lastName: string;
  }) => {
    const body = {
      firstName: payload.firstName,
      lastName: payload.lastName,
    };

    try {
      const route = getRoute(AccountRoute.NAME);
      const response = await $axios.patch(route, body);
      if (response.status !== 200) {
        throw new Error('Failed to update name');
      }
      return response.data;
    } catch (error) {
      throw new AccountServiceError('Failed to update name');
    }
  };

  const updatePassword = async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const body = {
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword,
    };

    try {
      const route = getRoute(AccountRoute.PASSWORD);
      const response = await $axios.patch(route, body);
      if (response.status !== 200) {
        throw new Error('Failed to update password');
      }
      return response.data;
    } catch (error) {
      throw new AccountServiceError('Failed to update password');
    }
  };

  const deleteAccount = async ({ password }: { password: string }) => {
    const body = {
      password,
    };
    // TODO: check for valid password
    try {
      const route = getRoute(AccountRoute.BASE);
      const response = await $axios.delete(route);
      if (response.status !== 200) {
        throw new Error('Failed to delete account');
      }
      return response.data;
    } catch (error) {
      throw new AccountServiceError('Failed to delete account');
    }
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
