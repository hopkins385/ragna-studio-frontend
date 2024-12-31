import { $axios } from '@/axios/axiosInstance';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

enum MediaRoute {
  UPLOAD = 'upload',
  BASE = 'media', // POST
  MEDIA = 'media/:mediaId', // GET, PATCH, DELETE
  FOR = 'media/for', // POST
  FOR_PAGINATE = 'media/for/paginate', // POST
}

export function useMediaService() {
  const ac = new AbortController();

  const dropzoneFiles = ref<File[]>([]);
  const isLoading = ref(false);
  const refreshData = ref(false);

  // upload files to server
  const uploadFiles = async (files: File[], vision: boolean = false) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });

    // add to form vision key
    formData.append('vision', vision.toString());

    try {
      isLoading.value = true;
      const route = getRoute(MediaRoute.UPLOAD);
      const response = await $axios.post(route, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: ac.signal,
      });
      if (response.status !== 201) {
        throw new Error('Error uploading files');
      }
      dropzoneFiles.value = [];
      isLoading.value = false;
      refreshData.value = true;
      return response.data;
    } catch (err) {
      console.error(err);
      isLoading.value = false;
    }
  };

  const fetchAllMediaFor = async (
    model: {
      id: string;
      type: any;
    },
    params: PaginateDto,
  ) => {
    const body = {
      model: {
        id: model.id,
        type: model.type,
      },
    };
    const route = getRoute(MediaRoute.FOR_PAGINATE);
    const response = await $axios.post(route, body, {
      params,
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch media');
    }

    return response.data;
  };

  const deleteMedia = async (mediaId: string) => {
    const route = getRoute(MediaRoute.MEDIA, { ':mediaId': mediaId });
    const response = await $axios.delete(route, {
      signal: ac.signal,
    });

    if (response.status !== 200) {
      throw new Error('Failed to delete media');
    }

    return response.data;
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
