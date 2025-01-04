import { $axios } from '@/axios/axiosInstance';
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

export enum UserFavoriteType {}

export enum UserFavoriteRoute {
  BASE = '/user-favorite', // GET, POST
  DELETE = '/user-favorite/:entityId', // DELETE
  TYPE = '/user-favorite/type/:favoriteType', // GET
}

class UserFavoriteServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserFavoriteServiceError';
  }
}

export function useUserFavoriteService() {
  const ac = new AbortController();

  const addFavorite = async (payload: UserFavoriteDto) => {
    const body = {
      favoriteId: payload.id,
      favoriteType: payload.type,
    };
    try {
      const route = getRoute(UserFavoriteRoute.BASE);
      const response = await $axios.post<UserFavoriteResponse>(route, body, {
        signal: ac.signal,
      });
      if (response.status !== 201) {
        throw new Error('Failed to add favorite');
      }
      return response.data;
    } catch (error: any) {
      throw new UserFavoriteServiceError(
        error?.message ?? 'Failed to add favorite',
      );
    }
  };

  const fetchAllFavorites = async () => {
    try {
      const route = getRoute(UserFavoriteRoute.BASE);
      const response = await $axios.get<UserFavoritesResponse>(route, {
        signal: ac.signal,
      });
      return response.data;
    } catch (error: any) {
      throw new UserFavoriteServiceError(
        error?.message ?? 'Failed to get all favorites',
      );
    }
  };

  const fetchAllFavoritesByType = async (favoriteType: string) => {
    try {
      const route = UserFavoriteRoute.TYPE.replace(
        ':favoriteType',
        favoriteType,
      );
      const response = await $axios.get<UserFavoritesResponse>(route, {
        signal: ac.signal,
      });
      return response.data;
    } catch (error: any) {
      throw new UserFavoriteServiceError(
        error?.message ?? 'Failed to get all favorites by type',
      );
    }
  };

  const deleteFavorite = async (payload: {
    entityId: string;
    favoriteType: string;
  }) => {
    if (!payload.entityId) {
      throw new Error('id missing');
    }
    const body = {
      favoriteType: payload.favoriteType,
    };
    try {
      const route = getRoute(UserFavoriteRoute.DELETE, {
        ':entityId': payload.entityId,
      });
      const response = await $axios.delete<UserFavoriteResponse>(route, {
        data: body,
        signal: ac.signal,
      });
      return response.data;
    } catch (error: any) {
      throw new UserFavoriteServiceError(
        error?.message ?? 'Failed to delete favorite',
      );
    }
  };

  return {
    addFavorite,
    fetchAllFavorites,
    fetchAllFavoritesByType,
    deleteFavorite,
  };
}
