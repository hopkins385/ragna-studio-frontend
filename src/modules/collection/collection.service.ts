import { HttpStatus } from '@/axios/utils/http-status';
import { BadRequestError } from '@/common/errors/bad-request.error';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import type { CollectionAbleModel } from '@/modules/collection-able/interfaces';
import type {
  CollectionResponse,
  CollectionsPaginatedResponse,
  CollectionsResponse,
  CreateCollectionPayload,
  EditCollectionPayload,
} from '@/modules/collection/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiCollectionRoute = {
  BASE: '/collection',
  COLLECTION: '/collection/:collectionId', // GET, PATCH, DELETE
  ALL: '/collection/all',
  FOR: '/collection/for',
} as const;

export class CollectionService {
  private ac: AbortController;

  constructor() {
    this.ac = new AbortController();
  }

  public async createCollection(payload: CreateCollectionPayload) {
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiCollectionRoute.BASE);
    const { status, data } = await api
      .POST<CollectionResponse, never, CreateCollectionPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async editCollection(collectionId: string, payload: EditCollectionPayload) {
    if (!collectionId) {
      throw new BadRequestError('Collection ID is required');
    }
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await api
      .PATCH<CollectionResponse, never, EditCollectionPayload>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchFirst(collectionId: string) {
    if (!collectionId) {
      throw new BadRequestError('Collection ID is required');
    }
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await api
      .GET<CollectionResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAll() {
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiCollectionRoute.ALL);
    const { status, data } = await api
      .GET<CollectionsResponse, never, never>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllPaginated(params: PaginateDto) {
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiCollectionRoute.BASE);
    const { status, data } = await api
      .GET<CollectionsPaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllCollectionsFor(payload: { model: CollectionAbleModel }) {
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiCollectionRoute.FOR);
    const { status, data } = await api
      .POST<CollectionsResponse, never, { model: CollectionAbleModel }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteCollection(collectionId: string) {
    if (!collectionId) {
      throw new BadRequestError('Collection ID is required');
    }
    this.abortRequest();
    const api = newApiRequest();
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await api
      .DELETE<CollectionResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Abort the current request
   */
  abortRequest() {
    this.ac.abort();
    this.ac = new AbortController();
  }
}

export const collectionService = new CollectionService();
