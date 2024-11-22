import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum CollectionAbleRoute {
  ATTACH = 'collection-able/attach', // POST
  DETACH = 'collection-able/detach', // POST
  DETACH_ALL = 'collection-able/detach-all', // POST
  REPLACE = 'collection-able/replace', // POST
}

export interface CollectionAbleModel {
  id: string;
  type: string;
}

export default function useCollectionAbleService() {
  const ac = new AbortController();

  const detachCollectionFrom = async (
    collectionId: string,
    payload: {
      model: CollectionAbleModel;
    },
  ) => {
    const body = {
      model: payload.model,
      collectionId,
    };
    const route = getRoute(CollectionAbleRoute.DETACH);
    const response = await $axios.post<any>(route, body, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to detach collection');
    }

    return response.data;
  };

  const detachAllCollectionsFrom = async (payload: {
    model: CollectionAbleModel;
  }) => {
    const body = payload;
    const route = getRoute(CollectionAbleRoute.DETACH_ALL);
    const response = await $axios.post<any>(route, body, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to detach all collections');
    }

    return response.data;
  };

  const replaceCollectionTo = async (
    collectionId: string,
    payload: {
      model: CollectionAbleModel;
    },
  ) => {
    const body = {
      model: payload.model,
      collectionId,
    };
    const route = getRoute(CollectionAbleRoute.REPLACE);
    const response = await $axios.post<any>(route, body, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to replace collection');
    }

    return response.data;
  };

  return {
    detachCollectionFrom,
    detachAllCollectionsFrom,
    replaceCollectionTo,
  };
}
