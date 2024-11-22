import { $axios } from '@/axios/axiosInstance';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import { getRoute } from '@/utils/route.util';

enum UserRoute {
  BASE = 'user', // GET, POST
  USER = 'user/:id', // GET, PATCH, DELETE
}

// Custom error class
export class UserServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'UserServiceError';
  }
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
   * @throws {UserServiceError} If the request fails
   */
  async function fetchAllUsers(): Promise<UsersPaginated> {
    try {
      const route = getRoute(UserRoute.BASE);
      const response = await $axios.get<UsersPaginated>(route, {
        signal: ac.signal,
      });
      return response.data;
    } catch (error: any) {
      throw new UserServiceError(
        error.response?.status ?? 500,
        'Failed to fetch users',
      );
    }
  }

  /**
   * Fetches a user by their ID
   * @param id User ID
   * @throws {UserServiceError} If the request fails
   */
  async function fetchUserById(id: string): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error('User ID is required');

    try {
      const route = getRoute(UserRoute.USER, userId);
      const response = await $axios.get<User>(route, {
        signal: ac.signal,
      });
      return response.data;
    } catch (error: any) {
      throw new UserServiceError(
        error.response?.status ?? 500,
        `Failed to fetch user with ID ${userId}`,
      );
    }
  }

  /**
   * Creates a new user
   * @param user User data
   * @throws {UserServiceError} If the request fails
   */
  async function createUser(user: UserCreate): Promise<User> {
    if (!user.name || !user.email || !user.password) {
      throw new Error('Name, email and password are required');
    }

    try {
      const route = getRoute(UserRoute.BASE);
      const response = await $axios.post<User>(route, user, {
        signal: ac.signal,
      });
      return response.data;
    } catch (error: any) {
      throw new UserServiceError(
        error.response?.status ?? 500,
        'Failed to create user',
      );
    }
  }

  /**
   * Updates an existing user
   * @param user User data with ID
   * @throws {UserServiceError} If the request fails
   */
  async function updateUser(id: string, data: UserUpdate): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error('User ID is required');

    try {
      const route = getRoute(UserRoute.USER, userId);
      const response = await $axios.patch<User>(route, data, {
        signal: ac.signal,
      });
      return response.data;
    } catch (error: any) {
      throw new UserServiceError(
        error.response?.status ?? 500,
        `Failed to update user with ID ${userId}`,
      );
    }
  }

  /**
   * Deletes a user
   * @param id User ID
   * @throws {UserServiceError} If the request fails
   */
  async function deleteUser(id: string): Promise<void> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error('User ID is required');

    try {
      const route = getRoute(UserRoute.USER, userId);
      await $axios.delete(route, {
        signal: ac.signal,
      });
    } catch (error: any) {
      throw new UserServiceError(
        error.response?.status ?? 500,
        `Failed to delete user with ID ${userId}`,
      );
    }
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
