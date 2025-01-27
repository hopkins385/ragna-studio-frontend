import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

const GoogleDriveRoute = {
  BASE: '/google-drive',
};

interface DriveParams {
  folderId: string | null;
  fileName?: string | null;
  pageToken?: string | null;
}

export function useGoogleDriveService() {
  const ac = new AbortController();

  const fetchDriveData = async (params: DriveParams) => {
    const api = newApiRequest();
    const route = getRoute(GoogleDriveRoute.BASE);
    const { status, data } = await api
      .GET<any, DriveParams>()
      .setRoute(route)
      .setParams(params)
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
    fetchDriveData,
  };
}
