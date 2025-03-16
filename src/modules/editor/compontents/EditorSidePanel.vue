<script setup lang="ts">
import { useSidepanelStore } from '@/common/stores/sidepanel.store';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

// Props
const props = defineProps<{
  title: string;
  panelId: string;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  showResetButton?: boolean;
}>();

const modelValue = defineModel();

// Emits
const emit = defineEmits(['resize']);

// Refs
const sidepanelContainer = useTemplateRef('sidepanel-container');
const isResizing = ref(false);

// Store
const sidepanelStore = useSidepanelStore();

// Set custom constraints if provided
if (props.minWidth || props.maxWidth) {
  sidepanelStore.setConstraints(props.minWidth, props.maxWidth);
}

// Initialize panel width from store
const panelWidth = ref(sidepanelStore.getPanelSize(props.panelId));

// Computed
const resizeHandleClasses = computed(() => [
  'absolute',
  'left-0',
  'top-0',
  'w-1',
  'h-full',
  'transition-colors',
  'z-10',
  {
    'cursor-ew-resize': props.resizable,
    'hover:bg-blue-500/50': props.resizable,
    'bg-blue-500/50': isResizing.value,
    invisible: !props.resizable,
  },
]);

// Functions
const startResize = (e: MouseEvent) => {
  if (!props.resizable) return;

  isResizing.value = true;
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  document.body.style.cursor = 'ew-resize';
  e.preventDefault();
};

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value || !sidepanelContainer.value) return;

  const newWidth = window.innerWidth - e.clientX;
  // Apply min/max constraints
  panelWidth.value = Math.min(Math.max(newWidth, sidepanelStore.minWidth), sidepanelStore.maxWidth);

  // Emit resize event with new width
  emit('resize', panelWidth.value);
};

const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  document.body.style.cursor = '';

  // Save the panel width to store when done resizing
  sidepanelStore.setPanelSize(props.panelId, panelWidth.value);
};

const resetSize = () => {
  sidepanelStore.resetPanelSize(props.panelId);
  panelWidth.value = sidepanelStore.defaultWidth;
  emit('resize', panelWidth.value);
};

// Save panel size when unmounting or when panel width changes
watch(panelWidth, newWidth => {
  if (!isResizing.value) {
    sidepanelStore.setPanelSize(props.panelId, newWidth);
  }
});

// Hooks
onMounted(() => {
  if (sidepanelContainer.value) {
    sidepanelContainer.value.style.width = `${panelWidth.value}px`;
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  // Save final panel size when unmounting
  sidepanelStore.setPanelSize(props.panelId, panelWidth.value);
});
</script>

<template>
  <transition name="sidepanel-slide" appear>
    <div
      id="sidepanel-container"
      ref="sidepanel-container"
      v-if="modelValue"
      class="h-full overflow-x-hidden overflow-y-scroll shrink-0 relative"
      :style="{ width: `${panelWidth}px` }"
    >
      <!-- Resize handle -->
      <div
        class="absolute left-0 top-0 w-1 h-full"
        :class="resizeHandleClasses"
        @mousedown="startResize"
      ></div>

      <div class="border-l h-full p-4 space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-1">
            <div>
              <Button variant="ghost" size="icon" @click="() => $emit('update:modelValue', false)">
                <XIcon class="size-4" />
              </Button>
            </div>
            <div>
              <h3 class="font-semibold text-base">{{ props.title }}</h3>
            </div>
          </div>
          <!-- Header Slot -->
          <div class="flex items-center gap-2">
            <Button
              v-if="showResetButton"
              variant="ghost"
              size="sm"
              class="opacity-75"
              @click="resetSize"
            >
              Reset Size
            </Button>
            <slot name="header" />
          </div>
        </div>
        <!-- Content Slot -->
        <slot />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="css">
.sidepanel-slide-enter-active,
.sidepanel-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 0; /* Start with zero width */
}

.sidepanel-slide-enter-active {
  animation: slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.sidepanel-slide-leave-active {
  animation: slide-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.sidepanel-slide-enter-from,
.sidepanel-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
  width: 0;
}

.sidepanel-slide-enter-to,
.sidepanel-slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

@keyframes slide-in {
  0% {
    transform: translateX(100%);
    width: 0;
    opacity: 0;
  }
  100% {
    width: calc(v-bind(panelWidth) * 1px);
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-out {
  0% {
    width: calc(v-bind(panelWidth) * 1px);
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    width: 0;
    opacity: 0;
  }
}
</style>
