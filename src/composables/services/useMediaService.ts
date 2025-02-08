import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

const MediaRoute = {
  UPLOAD: '/upload',
  BASE: '/media', // POST
  MEDIA: '/media/:mediaId', // GET, PATCH, DELETE
  FOR: '/media/for', // POST
  FOR_PAGINATE: '/media/for/paginate', // POST
} as const;

export function useMediaService() {
  const ac = new AbortController();

  const dropzoneFiles = ref<File[]>([]);
  const isLoading = ref(false);
  const refreshData = ref(false);

  // upload files to server
  const uploadFiles = async (files: File[], vision: boolean = false) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file, encodeURIComponent(file.name));
    });
    // add to form vision key
    formData.append('vision', vision.toString());

    isLoading.value = true;

    const api = newApiRequest();
    const route = getRoute(MediaRoute.UPLOAD);
    const { status, data } = await api
      .POST<any, never, FormData>()
      .setHeaders({
        'Content-Type': 'multipart/form-data',
      })
      .setRoute(route)
      .setData(formData)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    isLoading.value = false;
    dropzoneFiles.value = [];
    refreshData.value = true;

    return data;
  };

  const fetchAllMediaFor = async (
    model: {
      id: string;
      type: any;
    },
    params: PaginateDto,
  ) => {
    const bodyData = {
      model: {
        id: model.id,
        type: model.type,
      },
    };
    const api = newApiRequest();
    const route = getRoute(MediaRoute.FOR_PAGINATE);
    const { status, data } = await api
      .POST<any, PaginateDto, { model: { id: string; type: any } }>()
      .setRoute(route)
      .setParams(params)
      .setData(bodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  const deleteMedia = async (mediaId: string) => {
    const api = newApiRequest();
    const route = getRoute(MediaRoute.MEDIA, { ':mediaId': mediaId });
    const { status, data } = await api
      .DELETE<any, never, never>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    dropzoneFiles,
    isLoading,
    refreshData,
    uploadFiles,
    fetchAllMediaFor,
    deleteMedia,
  };
}
