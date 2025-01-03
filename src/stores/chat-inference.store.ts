import { defineStore } from 'pinia';

interface ISetModelPayload {
  model: string;
  provider: string;
  hasVision: boolean;
}

export const useChatStore = defineStore('chat-inference-store', {
  state: () => ({
    modelWithVision: false,
    model: '',
    provider: '',
  }),
  getters: {
    selectedModel: state => state.model,
  },
  actions: {
    setOnlyModel(model: string, hasVision: boolean) {
      this.modelWithVision = hasVision || false;
      this.model = model;
    },
    setOnlyProvider(provider: string) {
      this.provider = provider;
    },
    setModel(payload: ISetModelPayload) {
      this.model = payload.model;
      this.provider = payload.provider;
      this.modelWithVision = payload.hasVision || false;
    },
  },
});
