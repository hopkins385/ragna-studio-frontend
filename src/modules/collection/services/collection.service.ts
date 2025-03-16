import { HttpStatus } from '@/axios/utils/http-status';
import { BadRequestError } from '@/common/errors/bad-request.error';
import { BadResponseError } from '@/common/errors/bad-response.error';
import type { PaginateDto } from '@/common/interfaces/paginate.interface';
import { BaseApiService } from '@/common/service/base-api.service';
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

export class CollectionService extends BaseApiService {
  constructor() {
    super();
  }

  public async createCollection(payload: CreateCollectionPayload) {
    const route = getRoute(ApiCollectionRoute.BASE);
    const { status, data } = await this.api
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
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await this.api
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
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await this.api
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
    const route = getRoute(ApiCollectionRoute.ALL);
    const { status, data } = await this.api
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
    const route = getRoute(ApiCollectionRoute.BASE);
    const { status, data } = await this.api
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
    const route = getRoute(ApiCollectionRoute.FOR);
    const { status, data } = await this.api
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
    const route = getRoute(ApiCollectionRoute.COLLECTION, {
      ':collectionId': collectionId,
    });
    const { status, data } = await this.api
      .DELETE<CollectionResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const collectionService = new CollectionService();
