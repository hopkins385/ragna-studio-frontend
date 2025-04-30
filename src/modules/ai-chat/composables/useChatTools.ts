export interface ToolInfoData {
  toolName: string;
  toolInfo: string;
}

const dummyTool = {
  toolName: 'dummyTool',
  toolInfo: 'This is a dummy tool for testing purposes.',
};

export function useChatTools() {
  const activeTools = ref<ToolInfoData[]>([]);

  function setActiveTool(payload: ToolInfoData) {
    activeTools.value.push({
      toolName: payload.toolName,
      toolInfo: payload.toolInfo,
    });
  }

  function unsetActiveTool(payload: { toolName: string }, options?: { delay: number }) {
    if (options?.delay) {
      setTimeout(() => {
        activeTools.value = activeTools.value.filter(tool => tool.toolName !== payload.toolName);
      }, options.delay);
    } else {
      activeTools.value = activeTools.value.filter(tool => tool.toolName !== payload.toolName);
    }
  }

  function clearActiveTools() {
    activeTools.value = [];
  }

  return {
    activeTools,
    setActiveTool,
    unsetActiveTool,
    clearActiveTools,
  };
}
