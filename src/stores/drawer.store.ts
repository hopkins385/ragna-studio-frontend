// src/stores/drawer.store.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useDrawerStore = defineStore('drawer-store', () => {
  // State
  const _isVisible = ref(false);
  const _currentComponent = ref<string | null>(null);

  // Getters
  const isVisible = computed(() => _isVisible.value);
  const currentComponent = computed(() => _currentComponent.value);

  // Actions
  function show(component: string) {
    _currentComponent.value = component;
    _isVisible.value = true;
  }

  function hide() {
    _isVisible.value = false;
    _currentComponent.value = null;
  }

  function toggle(component: string) {
    if (currentComponent.value === component && isVisible.value) {
      hide();
    } else {
      show(component);
    }
  }

  return {
    isVisible,
    currentComponent,
    show,
    hide,
    toggle,
  };
});
