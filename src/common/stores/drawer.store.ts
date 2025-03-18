// src/stores/drawer.store.ts
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useDrawerStore = defineStore('drawer-store', () => {
  // State
  const _leftIsVisible = ref(false);
  const _leftComponent = ref<string>();
  const _rightIsVisible = ref(false);
  const _rightComponent = ref<string>();

  // Getters
  const leftIsVisible = computed(() => _leftIsVisible.value);
  const leftComponent = computed(() => _leftComponent.value);
  const rightIsVisible = computed(() => _rightIsVisible.value);
  const rightComponent = computed(() => _rightComponent.value);

  // Actions
  function showLeftDrawer(component: string) {
    _leftIsVisible.value = true;
    _leftComponent.value = component;
  }
  function hideLeftDrawer() {
    _leftIsVisible.value = false;
    _leftComponent.value = undefined;
  }
  function showRightDrawer(component: string) {
    _rightIsVisible.value = true;
    _rightComponent.value = component;
  }
  function hideRightDrawer() {
    _rightIsVisible.value = false;
    _rightComponent.value = undefined;
  }
  function toggleLeftDrawer(component: string) {
    if (_leftIsVisible.value) {
      hideLeftDrawer();
    } else {
      showLeftDrawer(component);
    }
  }
  function toggleRightDrawer(component: string) {
    if (_rightIsVisible.value) {
      hideRightDrawer();
    } else {
      showRightDrawer(component);
    }
  }
  function closeAllDrawers() {
    hideLeftDrawer();
    hideRightDrawer();
  }

  return {
    leftIsVisible,
    leftComponent,
    rightIsVisible,
    rightComponent,
    showLeftDrawer,
    hideLeftDrawer,
    showRightDrawer,
    hideRightDrawer,
    toggleLeftDrawer,
    toggleRightDrawer,
    closeAllDrawers,
  };
});
