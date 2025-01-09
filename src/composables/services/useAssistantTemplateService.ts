import { $axios } from '@/axios/axiosInstance';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import type { PaginateDto } from '@/interfaces/paginate.interface';
import { getRoute } from '@/utils/route.util';

enum AssistantTemplateRoute {
  TEMPLATE_ID = '/assistant-template/:templateId', // GET
  ALL_TEMPLATES = '/assistant-template', // GET
  ALL_TEMPLATES_PAGINATED = '/assistant-template/paginated', // GET
  RANDOM_TEMPLATES = '/assistant-template/random', // GET
  CATEGORY_ID = '/assistant-template/category/:categoryId', // GET
  ALL_CATEGORIES = '/assistant-template/category', // GET
  ALL_CATEGORIES_PAGINATED = '/assistant-template/category/paginated', // GET
}

interface AssistantTemplatePrompt {
  de: string;
  en: string;
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
    try {
      const route = getRoute(AssistantTemplateRoute.ALL_TEMPLATES);
      const response = await $axios.get<AssistantTemplateResponse>(route, {
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch assistant templates');
      }
      return response.data;
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Fetch all assistant templates paginated
   */
  async function fetchAllTemplatesPaginated(params: PaginateDto) {
    try {
      const route = getRoute(AssistantTemplateRoute.ALL_TEMPLATES_PAGINATED);
      const response = await $axios.get<AssistantTemplatePaginatedResponse>(
        route,
        {
          params,
          signal: ac.signal,
        },
      );
      if (response.status !== 200) {
        throw new Error('Failed to fetch assistant templates');
      }
      return response.data;
    } catch (e) {
      return handleError(e);
    }
  }

  async function fetchRandomTemplates(params: { limit: number }) {
    try {
      const route = getRoute(AssistantTemplateRoute.RANDOM_TEMPLATES);
      const response = await $axios.get<AssistantTemplateResponse>(route, {
        params,
        signal: ac.signal,
      });
      if (response.status !== 200) {
        throw new Error('Failed to fetch random assistant templates');
      }
      return response.data;
    } catch (e) {
      return handleError(e);
    }
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
