import { defineStore } from 'pinia';

export const useWorkspaceStore = defineStore('workspace.store', {
  state: () => ({
    activeProjectId: '',
  }),
  getters: {},
  actions: {
    setActiveProjectId(projectId: string) {
      this.activeProjectId = projectId;
    },
  },
  persist: true,
});
