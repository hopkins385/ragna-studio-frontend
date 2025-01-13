import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

enum RecordRoute {
  BASE = '/record',
  RECORD = '/record/:recordId',
  ALL_RECORDS = '/record/:collectionId',
  ALL_RECORDS_PAGINATED = '/record/:collectionId/paginated',
}

export interface Record {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllRecordsResponse {
  records: Record[];
}

export interface RecordsPaginatedResponse {
  records: Record[];
  meta: any;
}

export interface CreateRecordDto {
  collectionId: string;
  mediaId: string;
}

export function useRecordService() {
  const ac = new AbortController();

  const fetchAll = async (payload: { collectionId: string }) => {
    const api = newApiRequest();
    const route = getRoute(RecordRoute.ALL_RECORDS, {
      ':collectionId': payload.collectionId,
    });
    const { status, data } = await api
      .GET<AllRecordsResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchAllPaginated = async (payload: {
    collectionId: string;
    params: PaginateDto;
  }) => {
    const api = newApiRequest();
    const route = getRoute(RecordRoute.ALL_RECORDS_PAGINATED, {
      ':collectionId': payload.collectionId,
    });
    const { status, data } = await api
      .GET<RecordsPaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(payload.params)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const createRecord = async (payload: CreateRecordDto) => {
    const api = newApiRequest();
    const route = getRoute(RecordRoute.BASE);
    const { status, data } = await api
      .POST<any, never, CreateRecordDto>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const deleteRecord = async (recordId: string) => {
    const api = newApiRequest();
    const route = getRoute(RecordRoute.RECORD, { ':recordId': recordId });
    const { status, data } = await api
      .DELETE<any, never, never>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    fetchAll,
    fetchAllPaginated,
    createRecord,
    deleteRecord,
  };
}
