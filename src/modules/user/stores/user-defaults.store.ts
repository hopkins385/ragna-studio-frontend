import { defineStore } from 'pinia';

type DefaultAssistantId = string | undefined;

export const useUserDefaultsStore = defineStore(
  'user-defaults',
  () => {
    const _defaultAssistantId = ref<DefaultAssistantId>(undefined);

    const defaultAssistantId = computed(() => _defaultAssistantId.value);

    function setDefaultAssistantId(id: DefaultAssistantId) {
      _defaultAssistantId.value = id;
    }
    function clearDefaultAssistantId() {
      _defaultAssistantId.value = undefined;
    }
    return {
      defaultAssistantId,
      setDefaultAssistantId,
      clearDefaultAssistantId,
    };
  },
  { persist: true },
);
