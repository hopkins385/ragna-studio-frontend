import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type {
  UserFavoriteDto,
  UserFavoriteResponse,
  UserFavoritesResponse,
} from '@/modules/user-favorite/interfaces';
import { getRoute } from '@/utils/route.util';

export const ApiUserFavoriteRoute = {
  BASE: '/user-favorite', // GET, POST
  DELETE: '/user-favorite/:entityId', // DELETE
  TYPE: '/user-favorite/type/:favoriteType', // GET
} as const;

export class UserFavoriteService extends BaseApiService {
  constructor() {
    super();
  }

  public async addFavorite(payload: UserFavoriteDto) {
    const bodyData = {
      favoriteId: payload.id,
      favoriteType: payload.type,
    };
    const route = getRoute(ApiUserFavoriteRoute.BASE);
    const { status, data } = await this.api
      .POST<UserFavoriteResponse, never, any>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllFavorites() {
    const route = getRoute(ApiUserFavoriteRoute.BASE);
    const { status, data } = await this.api
      .GET<UserFavoritesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllFavoritesByType(favoriteType: string) {
    const route = ApiUserFavoriteRoute.TYPE.replace(':favoriteType', favoriteType);
    const { status, data } = await this.api
      .GET<UserFavoritesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteFavorite(payload: { entityId: string; favoriteType: string }) {
    if (!payload.entityId) {
      throw new Error('id missing');
    }
    const bodyData = {
      favoriteType: payload.favoriteType,
    };
    const route = getRoute(ApiUserFavoriteRoute.DELETE, {
      ':entityId': payload.entityId,
    });
    const { status, data } = await this.api
      .DELETE<UserFavoriteResponse, never, { favoriteType: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const userFavoriteService = new UserFavoriteService();
