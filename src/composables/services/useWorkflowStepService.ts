import { $axios } from '@/axios/axiosInstance';
import { getRoute } from '@/utils/route.util';

interface CreateWorkflowStepDto {
  assistantId: string;
  name: string;
  description: string;
  orderColumn: number;
  rowCount: number;
}

interface WorkflowRowItem {
  documentId: string;
  orderColumn: number;
  content: string;
  status: string;
  type: string;
}

interface CreateWorkflowRowDto {
  items: WorkflowRowItem[];
}

type UpdateWorkflowStepDto = Partial<CreateWorkflowStepDto>;

class WorkflowStepServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'WorkflowServiceError';
  }
}

enum WorkflowStepRoute {
  BASE = '/workflow-step',
  ROW = '/workflow-step/row',
  STEP = '/workflow-step/:id',
}

export function useWorkflowStepService() {
  const ac = new AbortController();

  onScopeDispose(() => {
    ac.abort();
  });

  const createWorkflowStep = async (
    workflowId: string,
    data: CreateWorkflowStepDto,
  ) => {
    try {
      const route = getRoute(WorkflowStepRoute.BASE);
      const body = {
        workflowId,
        ...data,
      };
      const response = await $axios.post(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 201) {
        throw new Error('Failed to create workflow step');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowStepServiceError(
        error?.status || 500,
        error?.data?.message || 'Failed to create workflow step',
      );
    }
  };

  const createWorkflowRow = async (
    workflowId: string,
    data: CreateWorkflowRowDto,
  ) => {
    try {
      const route = getRoute(WorkflowStepRoute.ROW);
      const body = {
        workflowId,
        items: data.items,
      };
      const response = await $axios.post(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 201) {
        throw new Error('Failed to create workflow row');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowStepServiceError(
        error?.status || 500,
        error?.data?.message || 'Failed to create workflow row',
      );
    }
  };

  const updateInputSteps = async (
    workflowId: string,
    data: UpdateWorkflowStepDto,
  ) => {
    throw new Error('Not implemented');
  };

  const updateWorkflowStep = async (
    workflowId: string,
    data: { name?: string },
  ) => {
    try {
      const route = getRoute(WorkflowStepRoute.STEP, workflowId);
      const body = {
        name: data.name,
      };
      const response = await $axios.patch(route, body, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to update workflow step name');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowStepServiceError(
        error?.status || 500,
        error?.data?.message || 'Failed to update workflow step name',
      );
    }
  };

  const deleteWorkflowStep = async (workflowId: string) => {
    try {
      const route = getRoute(WorkflowStepRoute.STEP, workflowId);
      const response = await $axios.delete(route, {
        signal: ac.signal,
      });

      if (response.status !== 200) {
        throw new Error('Failed to delete workflow step');
      }

      return response.data;
    } catch (error: any) {
      throw new WorkflowStepServiceError(
        error?.status || 500,
        error?.data?.message || 'Failed to delete workflow step',
      );
    }
  };

  return {
    createWorkflowStep,
    createWorkflowRow,
    updateInputSteps,
    deleteWorkflowStep,
    updateWorkflowStep,
  };
}
