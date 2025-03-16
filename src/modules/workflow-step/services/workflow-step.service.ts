import { HttpStatus } from '@/axios/utils/http-status';
import { BadResponseError } from '@/common/errors/bad-response.error';
import { BaseApiService } from '@/common/service/base-api.service';
import type {
  CreateWorkflowRowDto,
  CreateWorkflowStepDto,
} from '@/modules/workflow-step/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiWorkflowStepRoute = {
  BASE: '/workflow-step',
  ROW: '/workflow-step/row',
  STEP: '/workflow-step/:workflowStepId',
  INPUT_STEPS: '/workflow-step/:workflowStepId/input-steps',
  STEP_ASSISTANT: '/workflow-step/:workflowStepId/assistant',
  ITEM: '/workflow-step/:stepId/item/:itemId',
} as const;

export class WorkflowStepService extends BaseApiService {
  constructor() {
    super();
  }

  public async createWorkflowStep(workflowId: string, payload: CreateWorkflowStepDto) {
    const bodyData = {
      workflowId,
      ...payload,
    };

    const route = getRoute(ApiWorkflowStepRoute.BASE);
    const { status, data } = await this.api
      .POST<any, never, CreateWorkflowStepDto>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async createWorkflowRow(workflowId: string, payload: CreateWorkflowRowDto) {
    const bodyData = {
      workflowId,
      items: payload.items,
    };

    const route = getRoute(ApiWorkflowStepRoute.ROW);
    const { status, data } = await this.api
      .POST<any, never, CreateWorkflowRowDto>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateInputSteps(workflowStepId: string, payload: { inputStepIds: string[] }) {
    // const bodyData = {
    //   ...payload,
    // };
    const route = getRoute(ApiWorkflowStepRoute.INPUT_STEPS, {
      ':workflowStepId': workflowStepId,
    });
    const { status, data } = await this.api
      .PATCH<any, never, { inputStepIds: string[] }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateWorkflowStep(workflowId: string, payload: { name?: string }) {
    const bodyData = {
      name: payload.name,
    };

    const route = getRoute(ApiWorkflowStepRoute.STEP, {
      ':workflowStepId': workflowId,
    });
    const { status, data } = await this.api
      .PATCH<any, never, { name?: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateWorkflowStepAssistant(
    workflowStepId: string,
    payload: { assistantId: string },
  ) {
    const bodyData = {
      assistantId: payload.assistantId,
    };

    const route = getRoute(ApiWorkflowStepRoute.STEP_ASSISTANT, {
      ':workflowStepId': workflowStepId,
    });
    const { status, data } = await this.api
      .PATCH<any, never, { assistantId: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async deleteWorkflowStep(workflowStepId: string) {
    const route = getRoute(ApiWorkflowStepRoute.STEP, {
      ':workflowStepId': workflowStepId,
    });
    const { status, data } = await this.api
      .DELETE<any, never, never>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }

  public async updateItemContent({
    stepId,
    itemId,
    content,
  }: {
    stepId: string;
    itemId: string;
    content: string;
  }) {
    if (!stepId || !itemId) {
      throw new Error('Invalid stepId or itemId');
    }
    const route = getRoute(ApiWorkflowStepRoute.ITEM, {
      ':stepId': stepId,
      ':itemId': itemId,
    });
    const bodyData = {
      itemContent: content,
    };

    const { status, data } = await this.api
      .PATCH<any, never, { itemContent: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new BadResponseError();
    }

    return data;
  }
}

export const workflowStepService = new WorkflowStepService();
