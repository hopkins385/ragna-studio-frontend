import { $axios } from '@/axios/axiosInstance';
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
  WORKFLOW = '/workflow/:workflowId',
  WORKFLOW_FULL = '/workflow/:workflowId/full',
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
    try {
      const route = getRoute(WorkflowRoute.BASE);
      const response = await $axios.post<WorkflowResponse>(route, payload, {
        signal: ac.signal,
      });

      if (response.status !== 201) {
        throw new Error('Response not ok');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowServiceError(
        error.status ?? 500,
        'Failed to create workflow',
      );
    }
  };

  const reCreateWorkflowFromMedia = async (
    payload: IReCreateWorkflowFromMedia,
  ) => {
    throw new Error('Not implemented');
  };

  const fetchWorkflow = async (workflowId: string) => {
    try {
      const route = getRoute(WorkflowRoute.WORKFLOW, {
        ':workflowId': workflowId,
      });
      const response = await $axios.get<WorkflowResponse>(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Response not ok');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowServiceError(
        error.status ?? 500,
        'Failed to fetch workflow',
      );
    }
  };

  const fetchFullWorkflow = async (workflowId: string) => {
    try {
      const route = getRoute(WorkflowRoute.WORKFLOW_FULL, {
        ':workflowId': workflowId,
      });
      const response = await $axios.get<WorkflowResponse>(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Response not ok');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowServiceError(
        error.status ?? 500,
        'Failed to fetch workflow',
      );
    }
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
    try {
      const route = getRoute(WorkflowRoute.BASE);
      const response = await $axios.get<WorkflowsPaginatedResponse>(route, {
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

  const fetchWorkflowSettings = async (workflowId: string) => {
    throw new Error('Not implemented');
  };

  const updateWorkflow = async (
    workflowId: string,
    payload: Partial<UpdateWorkflowDto>,
  ) => {
    try {
      const route = getRoute(WorkflowRoute.WORKFLOW, {
        ':workflowId': workflowId,
      });
      const response = await $axios.patch(route, payload, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Response not ok');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowServiceError(
        error.status ?? 500,
        'Failed to update workflow',
      );
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    throw new Error('Not implemented');
  };

  const deleteWorkflowRows = async (
    workflowId: string,
    orderColumns: number[],
  ) => {
    throw new Error('Not implemented');
  };

  const exportWorkflow = async (workflowId: string, format: string) => {
    try {
      const route = getRoute(WorkflowRoute.EXPORT, {
        ':workflowId': workflowId,
      });
      const response = await $axios.get(route, {
        signal: ac.signal,
        responseType: 'blob',
      });

      if (response.status !== 200) {
        throw new Error('Response not ok');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowServiceError(
        error.status ?? 500,
        'Failed to export workflow',
      );
    }
  };

  const clearAllRows = async (workflowId: string) => {
    throw new Error('Not implemented');
  };

  const executeWorkflow = async (workflowId: string) => {
    try {
      const route = getRoute(WorkflowRoute.EXECUTE, {
        ':workflowId': workflowId,
      });
      const response = await $axios.post(
        route,
        {},
        {
          signal: ac.signal,
        },
      );

      if (response.status !== 201) {
        throw new Error('Response not ok');
      }

      return response.data;
    } catch (error: any) {
      console.log(error);
      throw new WorkflowServiceError(
        error.status ?? 500,
        'Failed to execute workflow',
      );
    }
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
