import { $axios } from '@/axios/axiosInstance';
import { newApiRequest } from '@/common/http/http-request.builder';
import type { PaginateMeta } from '@/interfaces/paginate-meta.interface';
import { getRoute } from '@/utils/route.util';

class WorkflowServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'WorkflowServiceError';
  }
}

enum WorkflowRoute {
  BASE = '/workflow',
  WORKFLOW = '/workflow/:workflowId', // GET, PATCH, DELETE
  WORKFLOW_FULL = '/workflow/:workflowId/full',
  WORKFLOW_ROW = '/workflow/:workflowId/row', // DELETE
  EXECUTE = '/workflow/:workflowId/execute',
  EXPORT = '/workflow/:workflowId/export',
}

interface ICreateWorkflow {
  name: string;
  description: string;
}

interface IReCreateWorkflowFromMedia {
  workflowId: string;
  mediaId: string;
}

interface UpdateWorkflowDto {
  name: string;
  description: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: any[];
}

export interface WorkflowResponse {
  workflow: Workflow;
}

export interface WorkflowsResponse {
  workflows: Workflow[];
}

export interface WorkflowsPaginatedResponse {
  workflows: Workflow[];
  meta: PaginateMeta;
}

export function useWorkflowService() {
  const ac = new AbortController();

  onScopeDispose(() => {
    ac.abort();
  });

  const createWorkflow = async (payload: ICreateWorkflow) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.BASE);
    const { status, data } = await api
      .POST<WorkflowResponse, never, ICreateWorkflow>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new Error('Failed to create workflow');
    }

    return data;
  };

  const reCreateWorkflowFromMedia = async (
    payload: IReCreateWorkflowFromMedia,
  ) => {
    throw new Error('Not implemented');
  };

  const fetchWorkflow = async (workflowId: string) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.WORKFLOW, {
      ':workflowId': workflowId,
    });
    const { status, data } = await api
      .GET<WorkflowResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to fetch workflow');
    }

    return data;
  };

  const fetchFullWorkflow = async (workflowId: string) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.WORKFLOW_FULL, {
      ':workflowId': workflowId,
    });
    const { status, data } = await api
      .GET<WorkflowResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to fetch workflow');
    }

    return data;
  };

  const fetchWorkflows = async () => {
    throw new Error('Not implemented');
    try {
      const route = getRoute(WorkflowRoute.BASE);
      const response = await $axios.get<WorkflowsResponse>(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Response not ok');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowServiceError(
        error.status ?? 500,
        'Failed to fetch workflows',
      );
    }
  };

  const fetchWorkflowsPaginated = async () => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.BASE);
    const { status, data } = await api
      .GET<WorkflowsPaginatedResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to fetch workflows');
    }

    return data;
  };

  const fetchWorkflowSettings = async (workflowId: string) => {
    throw new Error('Not implemented');
  };

  const updateWorkflow = async (
    workflowId: string,
    payload: Partial<UpdateWorkflowDto>,
  ) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.WORKFLOW, {
      ':workflowId': workflowId,
    });
    const { status, data } = await api
      .PATCH<WorkflowResponse, never, Partial<UpdateWorkflowDto>>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to update workflow');
    }

    return data;
  };

  const deleteWorkflow = async (workflowId: string) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.WORKFLOW, {
      ':workflowId': workflowId,
    });
    const { status, data } = await api
      .DELETE<WorkflowResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to delete workflow');
    }

    return data;
  };

  const deleteWorkflowRows = async (
    workflowId: string,
    orderColumns: number[],
  ) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.WORKFLOW_ROW, {
      ':workflowId': workflowId,
    });
    console.log('orderColumns', orderColumns);
    const { status, data } = await api
      .PATCH<never, never, { orderColumns: number[] }>()
      .setRoute(route)
      .setData({ orderColumns })
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to delete workflow rows');
    }

    return data;
  };

  const exportWorkflow = async (workflowId: string, format: string) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.EXPORT, {
      ':workflowId': workflowId,
    });
    const { status, data } = await api
      .GET<Blob>()
      .setRoute(route)
      .setResponseType('blob')
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new Error('Failed to export workflow');
    }

    return data;
  };

  const clearAllRows = async (workflowId: string) => {
    throw new Error('Not implemented');
  };

  const executeWorkflow = async (workflowId: string) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowRoute.EXECUTE, {
      ':workflowId': workflowId,
    });
    const { status, data } = await api
      .POST<WorkflowResponse>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new Error('Failed to execute workflow');
    }

    return data;
  };

  return {
    createWorkflow,
    reCreateWorkflowFromMedia,
    fetchWorkflows,
    fetchWorkflowsPaginated,
    fetchWorkflow,
    fetchFullWorkflow,
    fetchWorkflowSettings,
    updateWorkflow,
    deleteWorkflow,
    deleteWorkflowRows,
    exportWorkflow,
    clearAllRows,
    executeWorkflow,
  };
}
