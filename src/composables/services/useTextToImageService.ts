import { $axios } from '@/axios/axiosInstance';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { useImgGenSettingsStore } from '@/stores/image-gen-settings.store';
import { getRoute } from '@/utils/route.util';

enum ImageGenStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
}

enum ImageGenRoute {
  GENERATE = '/text-to-image', // POST
  FOLDERS = '/text-to-image/folders', // GET
  FOLDER_RUNS = '/text-to-image/:id', // GET
  FOLDER_RUNS_PAGINATED = '/text-to-image/:id/paginated', // GET
}

type ImageUrl = string;

type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

interface ImageGenFolder {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TextToImage {
  path: string;
  status: string;
  id: string;
  name: string;
}

export interface ImageRun {
  prompt: string;
  status: string;
  id: string;
  deletedAt: Date;
  settings: JsonValue;
  images: TextToImage[];
}

export interface ImageGenResponse {
  imageUrls: ImageUrl[];
}

export interface ImageGenFolderResponse {
  folders: ImageGenFolder[];
}

export interface ImageGenPaginatedResponse {
  runs: ImageRun[];
  meta: PaginateMeta;
}

export function useTextToImageService() {
  const ac = new AbortController();
  let acGen: AbortController | null = null;

  const generateImages = async (payload: {
    folderId: string;
    prompt: string;
    imgCount: number;
    width: number;
    height: number;
    guidance: number;
    prompt_upsampling: boolean;
    output_format: string;
  }) => {
    acGen = new AbortController();

    // remove output_format from payload

    const body = {
      ...payload,
      safety_tolerance: 4,
    };

    try {
      const route = getRoute(ImageGenRoute.GENERATE);
      const response = await $axios.post<ImageGenResponse>(route, body, {
        signal: acGen.signal,
      });
      return response.data;
    } catch (error) {}
  };

  const toggleHideRun = async ({ runId }: { runId: string }) => {
    throw new Error('Not implemented');
  };

  const fetchFolders = async () => {
    try {
      const route = getRoute(ImageGenRoute.FOLDERS);
      const response = await $axios.get<ImageGenFolderResponse>(route, {
        signal: ac.signal,
      });
      return response.data;
    } catch (error) {}
  };

  const fetchRunsPaginated = async (
    { folderId }: { folderId: string },
    params: PaginateDto,
  ) => {
    try {
      const route = getRoute(ImageGenRoute.FOLDER_RUNS_PAGINATED, folderId);
      const response = await $axios.get<ImageGenPaginatedResponse>(route, {
        params,
        signal: ac.signal,
      });
      return response.data;
    } catch (error) {}
  };

  return {
    toggleHideRun,
    generateImages,
    fetchFolders,
    fetchRunsPaginated,
  };
}
