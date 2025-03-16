import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { User, UserCreate, UsersPaginated } from '@/modules/user/interfaces';
import { getRoute } from '@/utils/route.util';

type UserUpdate = Omit<User, 'id'>;

const ApiUserRoute = {
  BASE: 'user', // GET, POST
  USER: 'user/:userId', // GET, PATCH, DELETE
} as const;

export class UserService extends BaseApiService {
  constructor() {
    super();
  }

  /**
   * Fetches all users from the system
   */
  async fetchAllUsers(): Promise<UsersPaginated> {
    const route = getRoute(ApiUserRoute.BASE);
    const { status, data } = await this.api
      .GET<UsersPaginated>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetches a user by their ID
   * @param id User ID
   */
  async fetchUserById(id: string): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error('User ID is required');

    const route = getRoute(ApiUserRoute.USER, { ':userId': userId });
    const { status, data } = await this.api
      .GET<User>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Creates a new user
   * @param user User data
   */
  async createUser(user: UserCreate): Promise<User> {
    if (!user.name || !user.email || !user.password) {
      throw new Error('Name, email and password are required');
    }

    const route = getRoute(ApiUserRoute.BASE);
    const { status, data } = await this.api
      .POST<User, never, UserCreate>()
      .setRoute(route)
      .setData(user)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Updates an existing user
   * @param user User data with ID
   */
  async updateUser(id: string, updateData: UserUpdate): Promise<User> {
    const userId = id.toLowerCase();
    if (!userId) throw new Error('User ID is required');

    const route = getRoute(ApiUserRoute.USER, { ':userId': userId });
    const { status, data } = await this.api
      .PATCH<User, never, UserUpdate>()
      .setRoute(route)
      .setData(updateData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Deletes a user
   * @param id User ID
   */
  async deleteUser(id: string): Promise<void> {
    const userId = id.toLowerCase();
    if (!userId) {
      throw new Error('User ID is required');
    }

    const route = getRoute(ApiUserRoute.USER, { ':userId': userId });
    const { status } = await this.api
      .DELETE<never, never, never>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return;
  }
}

export const userService = new UserService();
