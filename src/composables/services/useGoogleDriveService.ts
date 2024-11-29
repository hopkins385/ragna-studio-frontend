import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

enum GoogleDriveRoute {
  BASE = '/google-drive',
}

class GoogleDriveServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleDriveServiceError';
  }
}

export function useGoogleDriveService() {
  const ac = new AbortController();

  onScopeDispose(() => {
    ac.abort();
  });

  const fetchDriveData = async (payload: {
    folderId: string | null;
    pageToken?: string | null;
  }) => {
    try {
      const route = getRoute(GoogleDriveRoute.BASE);
      const params = {
        searchFolderId: payload.folderId,
        pageToken: payload.pageToken,
      };
      const response = await $axios.get(route, {
        params,
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to fetch drive data');
      }

      return response.data;
    } catch (error: any) {
      throw new GoogleDriveServiceError(error?.message);
    }
  };

  return {
    fetchDriveData,
  };
}
