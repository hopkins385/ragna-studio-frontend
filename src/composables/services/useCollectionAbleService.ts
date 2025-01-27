import { BadRequestError } from '@/common/errors/bad-request.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

const CollectionAbleRoute = {
  ATTACH: '/collection-able/attach', // POST
  DETACH: '/collection-able/detach', // POST
  DETACH_ALL: '/collection-able/detach-all', // POST
  REPLACE: '/collection-able/replace', // POST
} as const;

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

    const api = newApiRequest();
    const route = getRoute(CollectionAbleRoute.DETACH);
    const { status, data } = await api
      .POST<any, never, { model: CollectionAbleModel; collectionId: string }>()
      .setRoute(route)
      .setData(body)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadRequestError();
    }

    return data;
  };

  const detachAllCollectionsFrom = async (payload: {
    model: CollectionAbleModel;
  }) => {
    const api = newApiRequest();
    const route = getRoute(CollectionAbleRoute.DETACH_ALL);
    const { status, data } = await api
      .POST<any, never, { model: CollectionAbleModel }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadRequestError();
    }

    return data;
  };

  const replaceCollectionTo = async (
    collectionId: string,
    payload: {
      model: CollectionAbleModel;
    },
  ) => {
    const api = newApiRequest();
    const route = getRoute(CollectionAbleRoute.REPLACE);
    const { status, data } = await api
      .POST<any, never, { model: CollectionAbleModel; collectionId: string }>()
      .setRoute(route)
      .setData({ model: payload.model, collectionId })
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadRequestError();
    }

    return data;
  };

  return {
    detachCollectionFrom,
    detachAllCollectionsFrom,
    replaceCollectionTo,
  };
}
