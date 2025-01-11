import { newApiRequest } from '@/common/http/http-request.builder';
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

export function useAssistantTemplateService() {
  const ac = new AbortController();

  /**
   * Fetch all assistant templates
   */
  async function fetchAllTemplates() {
    const api = newApiRequest();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_TEMPLATE);
    const response = await api
      .GET<AssistantTemplateResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
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
    const api = newApiRequest();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_TEMPLATE_PAGINATED);
    const response = await api
      .GET<AssistantTemplatePaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .execute();

    if (response.status !== 200) {
      throw new Error('Failed to fetch assistant templates');
    }

    return response.data;
  }

  /**
   * Fetch random assistant templates
   */
  async function fetchRandomTemplates(params: RandomTemplatesParams) {
    const api = newApiRequest();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_TEMPLATE_RANDOM);
    const response = await api
      .GET<AssistantTemplateResponse, RandomTemplatesParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
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
