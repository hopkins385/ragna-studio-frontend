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
