import type { PaginateDto } from '@/interfaces/paginate.interface';
import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum RecordRoute {
  BASE = 'record',
  RECORD = 'record/:id',
}

export interface Record {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
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

  const fetchAllPaginated = async (
    collectionId: string,
    params: PaginateDto,
  ) => {
    const route = getRoute(RecordRoute.RECORD, collectionId);
    const response = await $axios.get<RecordsPaginatedResponse>(route, {
      params,
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

  const deleteRecord = async (id: string) => {
    const route = getRoute(RecordRoute.RECORD, id);
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
    fetchAllPaginated,
    createRecord,
    deleteRecord,
  };
}
