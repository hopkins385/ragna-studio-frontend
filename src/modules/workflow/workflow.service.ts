import { HttpStatus } from '@/axios/utils/http-status';
import { BaseApiService } from '@/common/service/base-api.service';
import type {
  WorkflowResponse,
  WorkflowsPaginatedResponse,
} from '@/composables/services/useWorkflowService';
import type {
  ICreateWorkflow,
  IReCreateWorkflowFromMedia,
  UpdateWorkflowDto,
} from '@/modules/workflow/interfaces';
import { getRoute } from '@/utils/route.util';

const ApiWorkflowRoute = {
  BASE: '/workflow',
  WORKFLOW: '/workflow/:workflowId', // GET, PATCH, DELETE
  WORKFLOW_FULL: '/workflow/:workflowId/full',
  WORKFLOW_ROW: '/workflow/:workflowId/row', // DELETE
  EXECUTE: '/workflow/:workflowId/execute',
  EXPORT: '/workflow/:workflowId/export',
} as const;

export class WorkflowService extends BaseApiService {
  constructor() {
    super();
  }

  public async createWorkflow(payload: ICreateWorkflow) {
    const route = getRoute(ApiWorkflowRoute.BASE);
    const { status, data } = await this.api
      .POST<WorkflowResponse, never, ICreateWorkflow>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new Error('Failed to create workflow');
    }

    return data;
  }

  public async reCreateWorkflowFromMedia(payload: IReCreateWorkflowFromMedia) {
    throw new Error('Not implemented');
  }

  public async fetchWorkflow(workflowId: string) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW, {
      ':workflowId': workflowId,
    });
    const { status, data } = await this.api
      .GET<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new Error('Failed to fetch workflow');
    }

    return data;
  }

  public async fetchFullWorkflow(workflowId: string) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW_FULL, {
      ':workflowId': workflowId,
    });
    const { status, data } = await this.api
      .GET<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new Error('Failed to fetch workflow');
    }

    return data;
  }

  public async fetchWorkflows() {
    throw new Error('Not implemented');
    /*try {
        const route = getRoute(WorkflowRoute.BASE);
        const response = await $axios.get<WorkflowsResponse>(route, {
          signal: ac.signal,
        });

        if (response.status !== HttpStatus.OK) {
          throw new Error('Response not ok');
        }

        return response.data;
      } catch (error: any) {
        throw new WorkflowServiceError(
          error.status ?? 500,
          'Failed to fetch workflows',
        );
      }*/
  }

  public async fetchWorkflowsPaginated() {
    const route = getRoute(ApiWorkflowRoute.BASE);
    const { status, data } = await this.api
      .GET<WorkflowsPaginatedResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new Error('Failed to fetch workflows');
    }

    return data;
  }

  public async fetchWorkflowSettings(workflowId: string) {
    throw new Error('Not implemented');
  }

  public async updateWorkflow(workflowId: string, payload: Partial<UpdateWorkflowDto>) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW, {
      ':workflowId': workflowId,
    });
    const { status, data } = await this.api
      .PATCH<WorkflowResponse, never, Partial<UpdateWorkflowDto>>()
      .setRoute(route)
      .setData(payload)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new Error('Failed to update workflow');
    }

    return data;
  }

  public async deleteWorkflow(workflowId: string) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW, {
      ':workflowId': workflowId,
    });

    const { status, data } = await this.api
      .DELETE<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new Error('Failed to delete workflow');
    }

    return data;
  }

  public async deleteWorkflowRows(workflowId: string, orderColumns: number[]) {
    const route = getRoute(ApiWorkflowRoute.WORKFLOW_ROW, {
      ':workflowId': workflowId,
    });
    console.log('orderColumns', orderColumns);
    const { status, data } = await this.api
      .PATCH<never, never, { orderColumns: number[] }>()
      .setRoute(route)
      .setData({ orderColumns })
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new Error('Failed to delete workflow rows');
    }

    return data;
  }

  public async exportWorkflow(workflowId: string, format: string) {
    const route = getRoute(ApiWorkflowRoute.EXPORT, {
      ':workflowId': workflowId,
    });
    const { status, data } = await this.api
      .GET<Blob>()
      .setRoute(route)
      .setResponseType('blob')
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.OK) {
      throw new Error('Failed to export workflow');
    }

    return data;
  }

  public async clearAllRows(workflowId: string) {
    throw new Error('Not implemented');
  }

  public async executeWorkflow(workflowId: string) {
    const route = getRoute(ApiWorkflowRoute.EXECUTE, {
      ':workflowId': workflowId,
    });
    const { status, data } = await this.api
      .POST<WorkflowResponse>()
      .setRoute(route)
      .setSignal(this.ac.signal)
      .send();

    if (status !== HttpStatus.CREATED) {
      throw new Error('Failed to execute workflow');
    }

    return data;
  }
}

export const workflowService = new WorkflowService();
