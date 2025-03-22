export interface ToolInfoData {
  toolName: string;
  toolInfo: any;
}

export function useChatTools() {
  const activeTools = ref<ToolInfoData[]>([]);

  function setActiveTool(payload: ToolInfoData) {
    activeTools.value.push({
      toolName: payload.toolName,
      toolInfo: payload.toolInfo,
    });
  }

  function unsetActiveTool(toolName: string) {
    activeTools.value = activeTools.value.filter(data => data.toolName !== toolName);
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
