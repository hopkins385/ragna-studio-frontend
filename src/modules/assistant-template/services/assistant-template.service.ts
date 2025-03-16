import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import type { PaginateDto } from '@/common/interfaces/paginate.interface';
import { BaseApiService } from '@/common/service/base-api.service';
import type {
  AssistantTemplateCategoriesResponse,
  AssistantTemplatesPaginatedResponse,
  AssistantTemplatesResponse,
  CategoriesWithTemplatesResponse,
  RandomTemplatesParams,
} from '@/modules/assistant-template/interfaces/assistant-template.interfaces';
import { getRoute } from '@/utils/route.util';

const ApiAssistantTemplateRoute = {
  ASSISTANT_TEMPLATE: '/assistant-template', // GET
  ASSISTANT_TEMPLATE_PAGINATED: '/assistant-template/paginated', // GET
  ASSISTANT_TEMPLATE_RANDOM: '/assistant-template/random', // GET
  ASSISTANT_TEMPLATE_ID: '/assistant-template/one/:templateId', // GET
  ASSISTANT_TEMPLATE_BY_CATEGORY: '/assistant-template/category/:categoryId/templates', // GET
  ASSISTANT_TEMPLATES_BY_CATEGORY_IDS: '/assistant-template/categories/templates', // POST
  ASSISTANT_CATEGORY_ID: '/assistant-template/category/one/:categoryId', // GET
  ASSISTANT_CATEGORY: '/assistant-template/category', // GET
  ASSISTANT_CATEGORY_PAGINATED: '/assistant-template/category/paginated', // GET
} as const;

export class AssistantTemplateService extends BaseApiService {
  constructor() {
    super();
  }

  /**
   * Fetch all assistant templates
   */
  async fetchAllTemplates() {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_TEMPLATE);
    const { status, data } = await this.api
      .GET<AssistantTemplatesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch all assistant templates paginated
   */
  async fetchAllTemplatesPaginated(params: PaginateDto) {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_TEMPLATE_PAGINATED);
    const { status, data } = await this.api
      .GET<AssistantTemplatesPaginatedResponse, PaginateDto>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch random assistant templates
   */
  async fetchRandomTemplates(params: RandomTemplatesParams) {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_TEMPLATE_RANDOM);
    const { status, data } = await this.api
      .GET<AssistantTemplatesResponse, RandomTemplatesParams>()
      .setRoute(route)
      .setParams(params)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch all templates categories
   */
  async fetchAllCategories() {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_CATEGORY);
    const { status, data } = await this.api
      .GET<AssistantTemplateCategoriesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch all templates for a category
   */
  async fetchTemplatesByCategory(categoryId: string) {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_TEMPLATE_BY_CATEGORY, {
      ':categoryId': categoryId,
    });
    const { status, data } = await this.api
      .GET<AssistantTemplatesResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  /**
   * Fetch many templates by many category ids
   */
  async fetchTemplatesByCategoryIds(payload: { categoryIds: string[] }) {
    const route = getRoute(ApiAssistantTemplateRoute.ASSISTANT_TEMPLATES_BY_CATEGORY_IDS);
    const { status, data } = await this.api
      .POST<CategoriesWithTemplatesResponse, never, { categoryIds: string[] }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    // The expected status code is HttpStatus.OK in this case.
    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const assistantTemplateService = new AssistantTemplateService();
