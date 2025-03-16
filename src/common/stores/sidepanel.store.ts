import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useSidepanelStore = defineStore(
  'sidepanel',
  () => {
    // State
    const panelSizes = ref<Record<string, number>>({});
    const defaultWidth = ref(384); // 24rem
    const minWidth = ref(256); // 16rem
    const maxWidth = ref(640); // 40rem

    // Computed
    const panelIds = computed(() => Object.keys(panelSizes.value));

    // Actions
    function setPanelSize(panelId: string, size: number) {
      // Ensure size is within constraints
      const constrainedSize = Math.min(Math.max(size, minWidth.value), maxWidth.value);
      panelSizes.value[panelId] = constrainedSize;
    }

    function getPanelSize(panelId: string): number {
      return panelSizes.value[panelId] || defaultWidth.value;
    }

    function setConstraints(min?: number, max?: number, width?: number) {
      if (min !== undefined) minWidth.value = min;
      if (max !== undefined) maxWidth.value = max;
      if (width !== undefined) defaultWidth.value = width;
    }

    function resetPanelSize(panelId: string) {
      if (panelId in panelSizes.value) {
        delete panelSizes.value[panelId];
      }
    }

    function resetAllPanelSizes() {
      panelSizes.value = {};
    }

    return {
      // State
      panelSizes,
      defaultWidth,
      minWidth,
      maxWidth,

      // Computed
      panelIds,

      // Actions
      setPanelSize,
      getPanelSize,
      setConstraints,
      resetPanelSize,
      resetAllPanelSizes,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  },
);
