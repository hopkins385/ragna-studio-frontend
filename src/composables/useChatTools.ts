export interface ToolInfoData {
  toolName: string;
  toolInfo: any;
}

export function useChatTools() {
  const activeTools = ref<ToolInfoData[]>([]);

  function setActiveTool(toolInfoData: ToolInfoData) {
    activeTools.value.push(toolInfoData);
  }

  function unsetActiveTool(toolName: string) {
    activeTools.value = activeTools.value.filter(
      data => data.toolName !== toolName,
    );
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
