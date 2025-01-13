import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import { getRoute } from '@/utils/route.util';

enum UserRoute {
  BASE = 'user', // GET, POST
  USER = 'user/:userId', // GET, PATCH, DELETE
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UsersPaginated {
  users: User[];
  meta: PaginateMeta;
}

export interface UserCreate extends Omit<User, 'id'> {
  password: string;
}

type UserUpdate = Omit<User, 'id'>;

/**
 * Composable for managing user operations
 */
export function useUserService() {
  const ac = new AbortController();

  /**
   * Fetches all users from the system
   */
  async function fetchAllUsers(): Promise<UsersPaginated> {
    const api = newApiRequest();
    const route = getRoute(UserRoute.BASE);
    const { status, data } = await api
      .GET<UsersPaginated>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetches a user by their ID
   * @param id User ID
   */
  async function fetchUserById(id: string): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error('User ID is required');

    const api = newApiRequest();
    const route = getRoute(UserRoute.USER, { ':userId': userId });
    const { status, data } = await api
      .GET<User>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Creates a new user
   * @param user User data
   */
  async function createUser(user: UserCreate): Promise<User> {
    if (!user.name || !user.email || !user.password) {
      throw new Error('Name, email and password are required');
    }

    const api = newApiRequest();
    const route = getRoute(UserRoute.BASE);
    const { status, data } = await api
      .POST<User, never, UserCreate>()
      .setRoute(route)
      .setData(user)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Updates an existing user
   * @param user User data with ID
   */
  async function updateUser(id: string, updateData: UserUpdate): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error('User ID is required');

    const api = newApiRequest();
    const route = getRoute(UserRoute.USER, { ':userId': userId });
    const { status, data } = await api
      .PATCH<User, never, UserUpdate>()
      .setRoute(route)
      .setData(updateData)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Deletes a user
   * @param id User ID
   */
  async function deleteUser(id: string): Promise<void> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error('User ID is required');

    const api = newApiRequest();
    const route = getRoute(UserRoute.USER, { ':userId': userId });
    const { status } = await api
      .DELETE<never, never, never>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return;
  }

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    fetchAllUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  };
}
