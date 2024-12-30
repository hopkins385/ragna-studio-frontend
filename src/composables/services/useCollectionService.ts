import { $axios } from '@/axios/axiosInstance';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';
import type { CollectionAbleModel } from './useCollectionAbleService';

enum CollectionRoute {
  BASE = 'collection',
  COLLECTION = 'collection/:collectionId', // GET, PATCH, DELETE
  ALL = 'collection/all',
  FOR = 'collection/for',
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  model: CollectionAbleModel;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionResponse {
  collection: Collection;
}

export interface CollectionsResponse {
  collections: Collection[];
}

export interface CollectionsPaginatedResponse {
  collections: Collection[];
  meta: PaginateMeta;
}

export interface CollectionRequest {}

export interface CreateCollectionDto {
  name: string;
  description: string;
}

export interface EditCollectionDto {
  name: string;
  description?: string;
}

class CollectionServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CollectionServiceError';
  }
}

export default function useCollectionService() {
  const ac = new AbortController();

  const handleError = (err: unknown, customMessage?: string) => {
    if (err instanceof Error) {
    }
    console.error(err);
    throw new CollectionServiceError(customMessage || 'Failed to fetch data');
  };

  const createCollection = async (payload: CreateCollectionDto) => {
    const body = payload;
    try {
      const route = getRoute(CollectionRoute.BASE);
      const response = await $axios.post<CollectionResponse>(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 201) {
        throw new Error('Failed to create collection');
      }

      return response.data;
    } catch (error: unknown) {
      return handleError(error, 'Failed to create collection');
    }
  };

  const editCollection = async (
    collectionId: string,
    payload: EditCollectionDto,
  ) => {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }
    try {
      const body = payload;
      const route = getRoute(CollectionRoute.COLLECTION, {
        ':collectionId': collectionId,
      });
      const response = await $axios.patch<CollectionResponse>(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to edit collection');
      }

      return response.data;
    } catch (error: unknown) {
      return handleError(error, 'Failed to edit collection');
    }
  };

  const fetchFirst = async (collectionId: string) => {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }
    try {
      const route = getRoute(CollectionRoute.COLLECTION, {
        ':collectionId': collectionId,
      });
      const response = await $axios.get<CollectionResponse>(route, {
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch collection');
      }
      return response.data;
    } catch (error: unknown) {
      return handleError(error, 'Failed to fetch collection');
    }
  };

  const fetchAll = async () => {
    try {
      const route = getRoute(CollectionRoute.ALL);
      const response = await $axios.get<CollectionsResponse>(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch collection');
      }

      return response.data;
    } catch (error: unknown) {
      return handleError(error, 'Failed to fetch collection');
    }
  };

  const fetchAllPaginated = async (params: PaginateDto) => {
    try {
      const route = getRoute(CollectionRoute.BASE);
      const response = await $axios.get<CollectionsPaginatedResponse>(route, {
        params,
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch collection');
      }

      return response.data;
    } catch (error: unknown) {
      return handleError(error, 'Failed to fetch collection');
    }
  };

  const fetchAllCollectionsFor = async (payload: {
    model: CollectionAbleModel;
  }) => {
    try {
      const body = payload;
      const route = getRoute(CollectionRoute.FOR);
      const response = await $axios.post<CollectionsResponse>(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch collection');
      }

      return response.data;
    } catch (error: unknown) {
      return handleError(error, 'Failed to fetch collection');
    }
  };

  const deleteCollection = async (collectionId: string) => {
    if (!collectionId) {
      throw new Error('Collection ID is required');
    }
    try {
      const route = getRoute(CollectionRoute.COLLECTION, {
        ':collectionId': collectionId,
      });
      const response = await $axios.delete<CollectionResponse>(route, {
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to delete collection');
      }
      return response.data;
    } catch (error: unknown) {
      return handleError(error, 'Failed to delete collection');
    }
  };

  return {
    createCollection,
    editCollection,
    fetchFirst,
    fetchAll,
    fetchAllPaginated,
    fetchAllCollectionsFor,
    deleteCollection,
  };
}
