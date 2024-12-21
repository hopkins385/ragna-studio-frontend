import { $axios } from '@/axios/axiosInstance';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';
import type { CollectionAbleModel } from './useCollectionAbleService';

enum CollectionRoute {
  BASE = 'collection',
  COLLECTION = 'collection/:collectionId',
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

export default function useCollectionService() {
  const ac = new AbortController();

  const createCollection = async (payload: CreateCollectionDto) => {
    const body = payload;
    const route = getRoute(CollectionRoute.BASE);
    const response = await $axios.post<CollectionResponse>(route, body, {
      signal: ac.signal,
    });

    if (response.status !== 201) {
      throw new Error('Failed to create collection');
    }

    return response.data;
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
    } catch (error: any) {
      throw new Error('Failed to fetch collection');
    }
  };

  const fetchAll = async () => {
    const route = getRoute(CollectionRoute.ALL);
    const response = await $axios.get<CollectionsResponse>(route, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch collection');
    }

    return response.data;
  };

  const fetchAllPaginated = async (params: PaginateDto) => {
    const route = getRoute(CollectionRoute.BASE);
    const response = await $axios.get<CollectionsPaginatedResponse>(route, {
      params,
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch collection');
    }

    return response.data;
  };

  const fetchAllCollectionsFor = async (payload: {
    model: CollectionAbleModel;
  }) => {
    const body = payload;
    const route = getRoute(CollectionRoute.FOR);
    const response = await $axios.post<CollectionsResponse>(route, body, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch collection');
    }

    return response.data;
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
    } catch (error: any) {
      throw new Error('Failed to delete collection');
    }
  };

  return {
    createCollection,
    fetchFirst,
    fetchAll,
    fetchAllPaginated,
    fetchAllCollectionsFor,
    deleteCollection,
  };
}
