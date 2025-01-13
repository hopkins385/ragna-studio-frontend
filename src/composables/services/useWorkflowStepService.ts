import { BadResponseError } from '@/common/errors/bad-response.error';
import { newApiRequest } from '@/common/http/http-request.builder';
import { getRoute } from '@/utils/route.util';

enum WorkflowStepRoute {
  BASE = '/workflow-step',
  ROW = '/workflow-step/row',
  STEP = '/workflow-step/:workflowStepId',
  INPUT_STEPS = '/workflow-step/:workflowStepId/input-steps',
  STEP_ASSISTANT = '/workflow-step/:workflowStepId/assistant',
  ITEM = '/workflow-step/:stepId/item/:itemId',
}

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

export function useWorkflowStepService() {
  const ac = new AbortController();

  onScopeDispose(() => {
    ac.abort();
  });

  const createWorkflowStep = async (
    workflowId: string,
    payload: CreateWorkflowStepDto,
  ) => {
    const bodyData = {
      workflowId,
      ...payload,
    };

    const api = newApiRequest();
    const route = getRoute(WorkflowStepRoute.BASE);
    const { status, data } = await api
      .POST<any, never, CreateWorkflowStepDto>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const createWorkflowRow = async (
    workflowId: string,
    payload: CreateWorkflowRowDto,
  ) => {
    const bodyData = {
      workflowId,
      items: payload.items,
    };

    const api = newApiRequest();
    const route = getRoute(WorkflowStepRoute.ROW);
    const { status, data } = await api
      .POST<any, never, CreateWorkflowRowDto>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== 201) {
      throw new BadResponseError();
    }

    return data;
  };

  const updateInputSteps = async (
    workflowStepId: string,
    payload: { inputStepIds: string[] },
  ) => {
    // const bodyData = {
    //   ...payload,
    // };

    const api = newApiRequest();
    const route = getRoute(WorkflowStepRoute.INPUT_STEPS, {
      ':workflowStepId': workflowStepId,
    });
    const { status, data } = await api
      .PATCH<any, never, { inputStepIds: string[] }>()
      .setRoute(route)
      .setData(payload)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const updateWorkflowStep = async (
    workflowId: string,
    payload: { name?: string },
  ) => {
    const bodyData = {
      name: payload.name,
    };

    const api = newApiRequest();
    const route = getRoute(WorkflowStepRoute.STEP, {
      ':workflowStepId': workflowId,
    });
    const { status, data } = await api
      .PATCH<any, never, { name?: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const updateWorkflowStepAssistant = async (
    workflowStepId: string,
    payload: { assistantId: string },
  ) => {
    const bodyData = {
      assistantId: payload.assistantId,
    };

    const api = newApiRequest();
    const route = getRoute(WorkflowStepRoute.STEP_ASSISTANT, {
      ':workflowStepId': workflowStepId,
    });
    const { status, data } = await api
      .PATCH<any, never, { assistantId: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const deleteWorkflowStep = async (workflowStepId: string) => {
    const api = newApiRequest();
    const route = getRoute(WorkflowStepRoute.STEP, {
      ':workflowStepId': workflowStepId,
    });
    const { status, data } = await api
      .DELETE<any, never, never>()
      .setRoute(route)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  const updateItemContent = async ({
    stepId,
    itemId,
    content,
  }: {
    stepId: string;
    itemId: string;
    content: string;
  }) => {
    if (!stepId || !itemId) {
      throw new Error('Invalid stepId or itemId');
    }
    const route = getRoute(WorkflowStepRoute.ITEM, {
      ':stepId': stepId,
      ':itemId': itemId,
    });
    const bodyData = {
      itemContent: content,
    };

    const api = newApiRequest();
    const { status, data } = await api
      .PATCH<any, never, { itemContent: string }>()
      .setRoute(route)
      .setData(bodyData)
      .setSignal(ac.signal)
      .send();

    if (status !== 200) {
      throw new BadResponseError();
    }

    return data;
  };

  return {
    createWorkflowStep,
    createWorkflowRow,
    updateInputSteps,
    deleteWorkflowStep,
    updateWorkflowStep,
    updateItemContent,
    updateWorkflowStepAssistant,
  };
}
