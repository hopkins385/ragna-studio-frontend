import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import type {
  AllRecordsResponse,
  CreateRecordDto,
  RecordsPaginatedResponse,
} from '@/modules/record/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiRecordRoute = {
  BASE: '/record',
  RECORD: '/record/:recordId',
  ALL_RECORDS: '/record/:collectionId',
  ALL_RECORDS_PAGINATED: '/record/:collectionId/paginated',
} as const;

export class RecordService extends BaseApiService {
  constructor() {
    super();
  }

  public async fetchAll(payload: { collectionId: string }) {
    const route = getRoute(ApiRecordRoute.ALL_RECORDS, {
      ':collectionId': payload.collectionId,
    });
    const { status, data } = await this.api
      .GET<AllRecordsResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllPaginated(payload: { collectionId: string; params: PaginateDto }) {
    const route = getRoute(ApiRecordRoute.ALL_RECORDS_PAGINATED, {
      ':collectionId': payload.collectionId,
    });
    const { status, data } = await this.api
      .GET<RecordsPaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(payload.params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async createRecord(payload: CreateRecordDto) {
    const route = getRoute(ApiRecordRoute.BASE);
    const { status, data } = await this.api
      .POST<any, never, CreateRecordDto>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteRecord(recordId: string) {
    const route = getRoute(ApiRecordRoute.RECORD, { ':recordId': recordId });
    const { status, data } = await this.api
      .DELETE<any, never, never>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const recordService = new RecordService();
