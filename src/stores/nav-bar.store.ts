import { defineStore } from 'pinia';
import { ref } from 'vue';

function minMax(value: number) {
  return Math.min(Math.max(value, 12), 30);
}

export const useNavBarStore = defineStore('nav-bar.store', () => {
  // Individual refs for state
  const isFullClosed = ref(false);
  const isOpen = ref(false);
  const width = ref(4.5);
  const openWidth = ref(15.4);
  const closedWidth = ref(4.5);

  // Actions as functions
  function setOpen(value: boolean) {
    isOpen.value = value;
    resetWidth();
  }

  function toggleFullClosed() {
    if (isOpen.value) setOpen(false);
    isFullClosed.value = !isFullClosed.value;
  }

  function toggleOpen() {
    isOpen.value = !isOpen.value;
    resetWidth();
  }

  function setWidth(e: MouseEvent) {
    e.stopImmediatePropagation();
    e.preventDefault();
    width.value = minMax(e.clientX / 16);
    openWidth.value = width.value;
  }

  function resetWidth() {
    width.value = isOpen.value ? openWidth.value : closedWidth.value;
  }

  return {
    isFullClosed,
    isOpen,
    width,
    openWidth,
    closedWidth,
    setOpen,
    toggleFullClosed,
    toggleOpen,
    setWidth,
    resetWidth,
  };
}, {
  persist: true,
});
