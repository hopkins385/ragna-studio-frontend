import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

enum AssistantTemplateRoute {
  ASSISTANT_TEMPLATE = '/assistant-template', // GET
  ASSISTANT_TEMPLATE_PAGINATED = '/assistant-template/paginated', // GET
  ASSISTANT_TEMPLATE_RANDOM = '/assistant-template/random', // GET
  ASSISTANT_TEMPLATE_ID = '/assistant-template/one/:templateId', // GET
  ASSISTANT_TEMPLATE_BY_CATEGORY = '/assistant-template/category/:categoryId/templates', // GET
  ASSISTANT_TEMPLATES_BY_CATEGORY_IDS = '/assistant-template/categories/templates', // POST
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

export interface AssistantTemplateConfig {
  icon: string;
  color: string;
  free: boolean;
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
  config: AssistantTemplateConfig;
}

interface AssistantTemplatesResponse {
  templates: AssistantTemplate[];
}

interface AssistantTemplatesPaginatedResponse {
  templates: AssistantTemplate[];
  meta: PaginateMeta;
}

export interface CategoryWithTemplates {
  id: string;
  name: string;
  templates: AssistantTemplate[];
}

interface CategoriesWithTemplatesResponse {
  categories: CategoryWithTemplates[];
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
      .GET<AssistantTemplatesResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
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
      .GET<AssistantTemplatesPaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
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
      .GET<AssistantTemplatesResponse, RandomTemplatesParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
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
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch all templates for a category
   */
  async function fetchTemplatesByCategory(categoryId: string) {
    const api = newApiRequest();
    const route = getRoute(
      AssistantTemplateRoute.ASSISTANT_TEMPLATE_BY_CATEGORY,
      {
        ':categoryId': categoryId,
      },
    );
    const { status, data } = await api
      .GET<AssistantTemplatesResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch many templates by many category ids
   */
  async function fetchTemplatesByCategoryIds(payload: {
    categoryIds: string[];
  }) {
    const api = newApiRequest();
    const route = getRoute(
      AssistantTemplateRoute.ASSISTANT_TEMPLATES_BY_CATEGORY_IDS,
    );
    const { status, data } = await api
      .POST<CategoriesWithTemplatesResponse, never, { categoryIds: string[] }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    // The expected status code is 200 in this case.
    if (status !== 200) {
      throw new BadResponseError();
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
    fetchTemplatesByCategory,
    fetchTemplatesByCategoryIds,
  };
}
