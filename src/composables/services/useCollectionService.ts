import { BadRequestError } from '@/common/errors/bad-request.error';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';
import type { CollectionAbleModel } from './useCollectionAbleService';

const CollectionRoute = {
  BASE: '/collection',
  COLLECTION: '/collection/:collectionId', // GET, PATCH, DELETE
  ALL: '/collection/all',
  FOR: '/collection/for',
} as const;

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

export default function useCollectionService() {
  const ac = new AbortController();

  const createCollection = async (payload: CreateCollectionDto) => {
    const api = newApiRequest();
    const route = getRoute(CollectionRoute.BASE);
    const { status, data } = await api
      .POST<CollectionResponse, never, CreateCollectionDto>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const editCollection = async (
    collectionId: string,
    payload: EditCollectionDto,
  ) => {
    if (!collectionId) {
      throw new BadRequestError('Collection ID is required');
    }
    const api = newApiRequest();
    const route = getRoute(CollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await api
      .PATCH<CollectionResponse, never, EditCollectionDto>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchFirst = async (collectionId: string) => {
    if (!collectionId) {
      throw new BadRequestError('Collection ID is required');
    }
    const api = newApiRequest();
    const route = getRoute(CollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await api
      .GET<CollectionResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAll = async () => {
    const api = newApiRequest();
    const route = getRoute(CollectionRoute.ALL);
    const { status, data } = await api
      .GET<CollectionsResponse, never, never>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAllPaginated = async (params: PaginateDto) => {
    const api = newApiRequest();
    const route = getRoute(CollectionRoute.BASE);
    const { status, data } = await api
      .GET<CollectionsPaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAllCollectionsFor = async (payload: {
    model: CollectionAbleModel;
  }) => {
    const api = newApiRequest();
    const route = getRoute(CollectionRoute.FOR);
    const { status, data } = await api
      .POST<CollectionsResponse, never, { model: CollectionAbleModel }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const deleteCollection = async (collectionId: string) => {
    if (!collectionId) {
      throw new BadRequestError('Collection ID is required');
    }
    const api = newApiRequest();
    const route = getRoute(CollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await api
      .DELETE<CollectionResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
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
