import { HttpStatus } from '@/axios/utils/http-status';
import { BadRequestError } from '@/common/errors/bad-request.error';
import { newApiRequest, type ApiRequest } from '@/common/http/http-request.builder';
import type { CollectionAbleModel } from '@/modules/collection-able/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiCollectionAbleRoute = {
  ATTACH: '/collection-able/attach', // POST
  DETACH: '/collection-able/detach', // POST
  DETACH_ALL: '/collection-able/detach-all', // POST
  REPLACE: '/collection-able/replace', // POST
} as const;

export class CollectionAbleService {
  private ac: AbortController;
  private api: ApiRequest;

  constructor() {
    this.ac = new AbortController();
    this.api = newApiRequest();
  }

  async detachCollectionFrom(
    collectionId: string,
    payload: {
      model: CollectionAbleModel;
    },
  ) {
    const body = {
      model: payload.model,
      collectionId,
    };

    const route = getRoute(ApiCollectionAbleRoute.DETACH);
    const { status, data } = await this.api
      .POST<any, never, { model: CollectionAbleModel; collectionId: string }>()
      .setRoute(route)
      .setData(body)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadRequestError();
    }

    return data;
  }

  async detachAllCollectionsFrom(payload: { model: CollectionAbleModel }) {
    const route = getRoute(ApiCollectionAbleRoute.DETACH_ALL);
    const { status, data } = await this.api
      .POST<any, never, { model: CollectionAbleModel }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadRequestError();
    }

    return data;
  }

  async replaceCollectionTo(
    collectionId: string,
    payload: {
      model: CollectionAbleModel;
    },
  ) {
    const route = getRoute(ApiCollectionAbleRoute.REPLACE);
    const { status, data } = await this.api
      .POST<any, never, { model: CollectionAbleModel; collectionId: string }>()
      .setRoute(route)
      .setData({ model: payload.model, collectionId })
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadRequestError();
    }

    return data;
  }

  public abortRequest() {
    this.ac.abort();
    this.ac = new AbortController();
  }
}

export const collectionAbleService = new CollectionAbleService();
