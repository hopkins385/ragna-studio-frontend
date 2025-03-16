import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { DriveParams } from '@/modules/google-drive/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiGoogleDriveRoute = {
  BASE: '/google-drive',
};

export class GoogleDriveService extends BaseApiService {
  constructor() {
    super();
  }

  public async fetchDriveData(params: DriveParams) {
    const route = getRoute(ApiGoogleDriveRoute.BASE);
    const { status, data } = await this.api
      .GET<any, DriveParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const googleDriveService = new GoogleDriveService();
