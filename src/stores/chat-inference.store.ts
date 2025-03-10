import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

interface ISetModelPayload {
  model: string;
  provider: string;
  hasVision: boolean;
}

export const useChatInferenceStore = defineStore('chat-inference-store', () => {
  const modelWithVision = ref(false);
  const model = ref('');
  const provider = ref('');

  const selectedModel = computed(() => model.value);

  function setOnlyModel(modelName: string, hasVision: boolean) {
    modelWithVision.value = hasVision || false;
    model.value = modelName;
  }

  function setOnlyProvider(providerName: string) {
    provider.value = providerName;
  }

  function setModel(payload: ISetModelPayload) {
    model.value = payload.model;
    provider.value = payload.provider;
    modelWithVision.value = payload.hasVision || false;
  }

  return {
    modelWithVision,
    model,
    provider,
    selectedModel,
    setOnlyModel,
    setOnlyProvider,
    setModel,
  };
});
