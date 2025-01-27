import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

export interface UserFavorite {
  favoriteId: string;
  favoriteType: string;
  detail: {
    id: string;
    title: string;
    name: string;
    description: string;
  };
}

export interface UserFavoriteDto {
  id: string;
  type: string;
}

export interface UserFavoriteResponse {
  favorite: UserFavorite;
}

export interface UserFavoritesResponse {
  favorites: UserFavorite[];
}

export const UserFavoriteType = {};

export const UserFavoriteRoute = {
  BASE: '/user-favorite', // GET, POST
  DELETE: '/user-favorite/:entityId', // DELETE
  TYPE: '/user-favorite/type/:favoriteType', // GET
} as const;

class UserFavoriteServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserFavoriteServiceError';
  }
}

export function useUserFavoriteService() {
  const ac = new AbortController();

  const addFavorite = async (payload: UserFavoriteDto) => {
    const bodyData = {
      favoriteId: payload.id,
      favoriteType: payload.type,
    };
    const api = newApiRequest();
    const route = getRoute(UserFavoriteRoute.BASE);
    const { status, data } = await api
      .POST<UserFavoriteResponse, never, any>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAllFavorites = async () => {
    const api = newApiRequest();
    const route = getRoute(UserFavoriteRoute.BASE);
    const { status, data } = await api
      .GET<UserFavoritesResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAllFavoritesByType = async (favoriteType: string) => {
    const api = newApiRequest();
    const route = UserFavoriteRoute.TYPE.replace(':favoriteType', favoriteType);
    const { status, data } = await api
      .GET<UserFavoritesResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const deleteFavorite = async (payload: {
    entityId: string;
    favoriteType: string;
  }) => {
    if (!payload.entityId) {
      throw new Error('id missing');
    }
    const bodyData = {
      favoriteType: payload.favoriteType,
    };
    const api = newApiRequest();
    const route = getRoute(UserFavoriteRoute.DELETE, {
      ':entityId': payload.entityId,
    });
    const { status, data } = await api
      .DELETE<UserFavoriteResponse, never, { favoriteType: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    addFavorite,
    fetchAllFavorites,
    fetchAllFavoritesByType,
    deleteFavorite,
  };
}
