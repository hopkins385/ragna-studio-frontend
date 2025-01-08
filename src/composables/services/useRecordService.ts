import { $axios } from '@/axios/axiosInstance';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

enum RecordRoute {
  BASE = 'record',
  RECORD = 'record/:recordId',
  ALL_RECORDS = 'record/:collectionId',
  ALL_RECORDS_PAGINATED = 'record/:collectionId/paginated',
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
    const route = getRoute(RecordRoute.ALL_RECORDS, {
      ':collectionId': payload.collectionId,
    });
    const response = await $axios.get<AllRecordsResponse>(route, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch records');
    }

    return response.data;
  };

  const fetchAllPaginated = async (payload: {
    collectionId: string;
    params: PaginateDto;
  }) => {
    const route = getRoute(RecordRoute.ALL_RECORDS_PAGINATED, {
      ':collectionId': payload.collectionId,
    });
    const response = await $axios.get<RecordsPaginatedResponse>(route, {
      params: payload.params,
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch records');
    }

    return response.data;
  };

  const createRecord = async (payload: CreateRecordDto) => {
    const route = getRoute(RecordRoute.BASE);
    const body = {
      ...payload,
    };
    const response = await $axios.post(route, body, {
      signal: ac.signal,
    });

    if (response.status !== 201) {
      throw new Error('Failed to create record');
    }

    return response.data;
  };

  const deleteRecord = async (recordId: string) => {
    const route = getRoute(RecordRoute.RECORD, { ':recordId': recordId });
    const response = await $axios.delete(route, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to delete record');
    }

    return response.data;
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
