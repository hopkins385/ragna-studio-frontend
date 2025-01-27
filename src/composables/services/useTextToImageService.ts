import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

const ImageGenRoute = {
  FLUX_PRO: '/text-to-image/flux-pro', // POST
  FLUX_ULTRA: '/text-to-image/flux-ultra', // POST
  FOLDERS: '/text-to-image/folders', // GET
  FOLDER_RUNS: '/text-to-image/:id', // GET
  FOLDER_RUNS_PAGINATED: '/text-to-image/:folderId/paginated', // GET
  TOGGLE_HIDE: '/text-to-image/:runId/toggle-hide', // POST
} as const;

type ImageUrl = string;

type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

type OutputFormat = 'jpeg' | 'png';

interface ImageGenFolder {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FluxProPayload {
  folderId: string;
  prompt: string;
  imgCount: number;
  width: number;
  height: number;
  guidance: number;
  promptUpsampling?: boolean;
  safetyTolerance?: number;
  outputFormat: OutputFormat;
}

interface FluxUltraPayload {
  // Required fields
  folderId: string;
  imgCount: number;
  prompt: string;
  // Optional fields
  seed?: number;
  aspectRatio?: string;
  safetyTolerance?: number;
  outputFormat?: OutputFormat;
  raw?: boolean;
  imagePrompt?: string;
  imagePromptStrength?: number;
}

export interface TextToImage {
  path: string;
  status: string;
  id: string;
  name: string;
}

interface ImageRunSettings {
  provider: string;
}

export interface ImageRun {
  prompt: string;
  status: string;
  id: string;
  deletedAt: Date;
  settings: ImageRunSettings;
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

  const generateFluxProImages = async (payload: FluxProPayload) => {
    acGen = new AbortController();

    const bodyData = {
      ...payload,
      safety_tolerance: 4,
    };

    const api = newApiRequest();
    const route = getRoute(ImageGenRoute.FLUX_PRO);
    const { status, data } = await api
      .POST<ImageGenResponse, never, FluxProPayload>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(acGen.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const generateFluxUltraImages = async (payload: FluxUltraPayload) => {
    acGen = new AbortController();

    const bodyData = {
      ...payload,
      safety_tolerance: 4,
    };

    const api = newApiRequest();
    const route = getRoute(ImageGenRoute.FLUX_ULTRA);
    const { status, data } = await api
      .POST<ImageGenResponse, never, FluxUltraPayload>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(acGen.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const toggleHideRun = async (payload: { runId: string }) => {
    const api = newApiRequest();
    const route = getRoute(ImageGenRoute.TOGGLE_HIDE, {
      ':runId': payload.runId,
    });
    const { status, data } = await api
      .PATCH<ImageGenResponse, never, typeof payload>()
      .setRoute(route)
      //.setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchFolders = async () => {
    const api = newApiRequest();
    const route = getRoute(ImageGenRoute.FOLDERS);
    const { status, data } = await api
      .GET<ImageGenFolderResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const fetchRunsPaginated = async (
    { folderId }: { folderId: string },
    params: PaginateDto & { showHidden?: boolean },
  ) => {
    const api = newApiRequest();
    const route = getRoute(ImageGenRoute.FOLDER_RUNS_PAGINATED, {
      ':folderId': folderId,
    });
    const { status, data } = await api
      .GET<ImageGenPaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    toggleHideRun,
    generateFluxProImages,
    generateFluxUltraImages,
    fetchFolders,
    fetchRunsPaginated,
  };
}
