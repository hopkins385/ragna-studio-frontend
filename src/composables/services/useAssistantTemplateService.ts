import { createApiClient } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

enum AssistantTemplateRoute {
  ASSISTANT_TEMPLATE = '/assistant-template', // GET
  ASSISTANT_TEMPLATE_PAGINATED = '/assistant-template/paginated', // GET
  ASSISTANT_TEMPLATE_RANDOM = '/assistant-template/random', // GET
  ASSISTANT_TEMPLATE_ID = '/assistant-template/:templateId', // GET
  ASSISTANT_CATEGORY_ID = '/assistant-template/category/:categoryId', // GET
  ASSISTANT_CATEGORY = '/assistant-template/category', // GET
  ASSISTANT_CATEGORY_PAGINATED = '/assistant-template/category/paginated', // GET
}

interface AssistantTemplatePrompt {
  de: string;
  en: string;
}

interface RandomTemplatesParams {
  limit: number;
}

export interface AssistantTemplate {
  id: string;
  llmId: string;
  title: string;
  description: string;
  systemPrompt: AssistantTemplatePrompt;
}

export interface AssistantTemplateResponse {
  templates: AssistantTemplate[];
}

export interface AssistantTemplatePaginatedResponse {
  templates: AssistantTemplate[];
  meta: PaginateMeta;
}

class AssistantTemplateServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssistantTemplateServiceError';
  }
}

export function useAssistantTemplateService() {
  const ac = new AbortController();

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
    }
    console.error(err);
    throw new AssistantTemplateServiceError('Failed to fetch data');
  };

  /**
   * Fetch all assistant templates
   */
  async function fetchAllTemplates() {
    const api = createApiClient();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_TEMPLATE);
    const response = await api
      .request<AssistantTemplateResponse>()
      .setRoute(route)
      .setErrorHandler(handleError)
      .execute();

    if (response.status !== 200) {
      throw new Error('Failed to fetch assistant templates');
    }

    return response.data;
  }

  /**
   * Fetch all assistant templates paginated
   */
  async function fetchAllTemplatesPaginated(params: PaginateDto) {
    const api = createApiClient();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_TEMPLATE_PAGINATED);
    const response = await api
      .request<AssistantTemplatePaginatedResponse, PaginateDto>()
      .setSignal(ac.signal)
      .setRoute(route)
      .setParams(params)
      .setErrorHandler(handleError)
      .execute();

    if (response.status !== 200) {
      throw new Error('Failed to fetch assistant templates');
    }

    return response.data;
  }

  async function fetchRandomTemplates(params: RandomTemplatesParams) {
    const api = createApiClient();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_TEMPLATE_RANDOM);
    const response = await api
      .request<AssistantTemplateResponse, RandomTemplatesParams>()
      .setSignal(ac.signal)
      .setRoute(route)
      .setParams(params)
      .setErrorHandler(handleError)
      .execute();

    if (response.status !== 200) {
      throw new Error('Failed to fetch random assistant templates');
    }

    return response.data;
  }

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    fetchAllTemplates,
    fetchAllTemplatesPaginated,
    fetchRandomTemplates,
  };
}
