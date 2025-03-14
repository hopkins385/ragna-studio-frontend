import type { Ref } from 'vue';

export function useAutoScroll(
  containerRef: Ref<HTMLElement | null>,
  options?: { instant?: boolean },
) {
  const isAutoScrolling = ref(false);
  const autoScrollLocked = ref(false);

  const scrollToBottom = () => {
    nextTick(() => {
      containerRef.value?.scrollTo({
        top: containerRef.value.scrollHeight,
        behavior: options?.instant ? 'instant' : 'smooth',
      });
    });
  };

  const { arrivedState } = useScroll(containerRef);

  useMutationObserver(
    containerRef,
    mutations => {
      if (!autoScrollLocked.value && mutations.length > 0) scrollToBottom();
    },
    {
      childList: true,
      subtree: true,
      characterData: true,
    },
  );

  useEventListener(
    containerRef,
    'wheel',
    () => {
      // Disable auto-scroll when the user scrolls up and re-enable it when back at the bottom
      if (arrivedState.bottom) {
        autoScrollLocked.value = false;
        return;
      }
      autoScrollLocked.value = true;
    },
    {
      passive: true,
    },
  );

  return {
    scrollToBottom,
    isAutoScrolling,
    autoScrollLocked,
    arrivedState,
  };
}
