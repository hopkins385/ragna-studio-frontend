import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

const ApiMediaRoute = {
  UPLOAD: '/upload',
  BASE: '/media', // POST
  MEDIA: '/media/:mediaId', // GET, PATCH, DELETE
  FOR: '/media/for', // POST
  FOR_PAGINATE: '/media/for/paginate', // POST
} as const;

export class MediaService extends BaseApiService {
  constructor() {
    super();
  }

  public async uploadFiles(files: File[], vision: boolean = false) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file, encodeURIComponent(file.name));
    });
    // add to form vision key
    formData.append('vision', vision.toString());

    const route = getRoute(ApiMediaRoute.UPLOAD);
    const { status, data } = await this.api
      .POST<any, never, FormData>()
      .setHeaders({
        'Content-Type': 'multipart/form-data',
      })
      .setRoute(route)
      .setData(formData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async fetchAllMediaFor(
    model: {
      id: string;
      type: any;
    },
    params: PaginateDto,
  ) {
    const bodyData = {
      model: {
        id: model.id,
        type: model.type,
      },
    };
    const route = getRoute(ApiMediaRoute.FOR_PAGINATE);
    const { status, data } = await this.api
      .POST<any, PaginateDto, { model: { id: string; type: any } }>()
      .setRoute(route)
      .setParams(params)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteMedia(mediaId: string) {
    const route = getRoute(ApiMediaRoute.MEDIA, { ':mediaId': mediaId });
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

export const mediaService = new MediaService();
