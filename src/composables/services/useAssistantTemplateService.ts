import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

enum AssistantTemplateRoute {
  ASSISTANT_TEMPLATE = '/assistant-template', // GET
  ASSISTANT_TEMPLATE_PAGINATED = '/assistant-template/paginated', // GET
  ASSISTANT_TEMPLATE_RANDOM = '/assistant-template/random', // GET
  ASSISTANT_TEMPLATE_ID = '/assistant-template/one/:templateId', // GET
  ASSISTANT_CATEGORY_ID = '/assistant-template/category/one/:categoryId', // GET
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

export interface AssistantTemplateCategory {
  id: string;
  name: string;
}

interface AssistantTemplateCategoriesResponse {
  categories: AssistantTemplateCategory[];
}

export interface AssistantTemplate {
  id: string;
  llmId: string;
  title: string;
  description: string;
  systemPrompt: AssistantTemplatePrompt;
}

interface AssistantTemplateResponse {
  templates: AssistantTemplate[];
}

interface AssistantTemplatePaginatedResponse {
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

    const { status, data } = await api
      .GET<AssistantTemplateResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to fetch assistant templates');
    }

    return data;
  }

  /**
   * Fetch all assistant templates paginated
   */
  async function fetchAllTemplatesPaginated(params: PaginateDto) {
    const api = newApiRequest();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_TEMPLATE_PAGINATED);

    const { status, data } = await api
      .GET<AssistantTemplatePaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to fetch assistant templates');
    }

    return data;
  }

  /**
   * Fetch random assistant templates
   */
  async function fetchRandomTemplates(params: RandomTemplatesParams) {
    const api = newApiRequest();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_TEMPLATE_RANDOM);

    const { status, data } = await api
      .GET<AssistantTemplateResponse, RandomTemplatesParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to fetch random assistant templates');
    }

    return data;
  }

  /**
   * Fetch all templates categories
   */
  async function fetchAllCategories() {
    const api = newApiRequest();
    const route = getRoute(AssistantTemplateRoute.ASSISTANT_CATEGORY);

    const { status, data } = await api
      .GET<AssistantTemplateCategoriesResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to fetch assistant templates categories');
    }

    return data;
  }

  onScopeDispose(() => {
    ac.abort();
  });

  return {
    fetchAllCategories,
    fetchAllTemplates,
    fetchAllTemplatesPaginated,
    fetchRandomTemplates,
  };
}
