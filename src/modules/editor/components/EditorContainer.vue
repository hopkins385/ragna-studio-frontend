<script setup lang="ts">
import { useWebSocketStore } from '@/common/stores/websocket.store';
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useEditorStore } from '@/modules/editor/stores';
import { EditorContent } from '@tiptap/vue-3';
import {
  type CompletionRequestContext,
  type InlineCompletionResponse,
} from '../extensions/inline-completion/inline-completion.extension';
import EditorAssistantDropdownMenu from './EditorAssistantDropdownMenu.vue';
import EditorAssistantPromptContainer from './EditorAssistantPromptContainer.vue';
import EditorMenu from './EditorMenu.vue';

// Stores
const editorStore = useEditorStore();
const socket = useWebSocketStore();

// Injections
const client = useRagnaClient();
const editor = editorStore.getEditor();

const isLoading = ref(false);
const spinnerPosition = ref({ x: 0, y: 0 });

const editorWrapperRef = useTemplateRef('editorWrapperRef');
const editorContentRef = useTemplateRef('editorContentRef');
const assistantPromptContainerRef = useTemplateRef('assistantPromptContainerRef');

const assistantPromptContainer = reactive({
  show: false,
  xPosition: 0,
  yPosition: 0,
});

const assistantDropdownMenu = reactive({
  show: false,
  xPosition: 0,
  yPosition: 0,
});

const { isOutside: isOutsideWrapper } = useMouseInElement(editorWrapperRef);
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();

const fetchInlineCompletionHandler = async (params: {
  context: CompletionRequestContext;
  timeout: number;
  signal: AbortSignal;
}): Promise<InlineCompletionResponse> => {
  // console.log('fetching completion', params.context);
  if (!params.context) {
    return { inlineCompletion: '' };
  }

  isLoading.value = true;

  // listen for abort signal and abort the request via abortCompletion
  params.signal.addEventListener('abort', client.editor.abortRequest);

  try {
    const { inlineCompletion } = await client.editor.fetchInlineCompletion({
      context: params.context,
    });
    return { inlineCompletion };
  } catch (error) {
    console.error('Error fetching inline completion:', error);
    return { inlineCompletion: '' };
  } finally {
    isLoading.value = false;
    // remove abort signal listener
    params.signal.removeEventListener('abort', client.editor.abortRequest);
  }
};

// watch the isLoading value and show/hide a loading spinner
watch(isLoading, newValue => {
  if (newValue) {
    // Show loading spinner at cursor position
    if (editor.value && editor.value.view) {
      const { from } = editor.value.state.selection;
      const coords = editor.value.view.coordsAtPos(from);
      const editorRect = editorContentRef.value?.getBoundingClientRect();

      if (editorRect) {
        spinnerPosition.value = {
          x: coords.left - editorRect.left,
          y: coords.top - editorRect.top,
        };
      }
    }
  }
});

const handleCloseAssistantDropdownMenu = () => {
  assistantDropdownMenu.show = false;
};

const handleCloseAssistantPromptContainer = () => {
  assistantPromptContainer.show = false;
};

const handleEditorBlurEvent = (event: any) => {
  // If the focused element is inside the prompt container or dropdown menu, do nothing
  if (
    (assistantPromptContainerRef.value &&
      event.relatedTarget &&
      assistantPromptContainerRef.value.contains(event.relatedTarget as Node)) ||
    (assistantDropdownMenu.show &&
      event.relatedTarget &&
      (event.relatedTarget as HTMLElement).closest('.editor-assistant-dropdown-menu'))
  ) {
    return;
  }

  // Only hide the prompt container if we're not clicking inside the editor content
  if (!editorContentRef.value?.contains(event.relatedTarget as Node)) {
    assistantPromptContainer.show = false;
  }
};

const updateAssistantPromptContainerPosition = () => {
  if (!editor.value) throw new Error('Editor instance is not available');
  const { from, to } = editor.value.state.selection;
  if (from === to || !editorWrapperRef.value) {
    return;
  }

  const coords = editor.value.view.coordsAtPos(to);
  const containerRect = editorWrapperRef.value.getBoundingClientRect();

  const xPosition = 140;
  const yPosition = coords.bottom - containerRect.y + 10;

  assistantPromptContainer.xPosition = xPosition;
  assistantPromptContainer.yPosition = yPosition;
};

const handleShowPromptContainer = () => {
  if (editorStore.hasTextSelected && !isOutsideWrapper.value) {
    updateAssistantPromptContainerPosition();
    assistantPromptContainer.show = true;
  } else {
    assistantPromptContainer.show = false;
  }
};

const updateAssistantDropdownMenuPosition = () => {
  if (!editor.value) throw new Error('Editor instance is not available');
  const { from } = editor.value.state.selection;
  if (!editorWrapperRef.value) {
    return;
  }

  const coords = editor.value.view.coordsAtPos(from);
  const containerRect = editorWrapperRef.value.getBoundingClientRect();

  assistantDropdownMenu.yPosition = coords.top - containerRect.top - 2;
};

// Handle mouseup event to show the assistant dropdown menu
const handleMouseUp = () => {
  if (!editor.value) throw new Error('Editor instance is not available');
  const { from, to } = editor.value.state.selection;
  if (from !== to && editorWrapperRef.value && !isOutsideWrapper.value) {
    updateAssistantDropdownMenuPosition();
    assistantDropdownMenu.show = true;
  } else {
    assistantDropdownMenu.show = false;
  }
};

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  handleShowPromptContainer();
};

const handleError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'An error occurred';
  setErrorAlert(message);
};

const onAssistantPromptError = (error: unknown) => {
  handleError(error);
  assistantPromptContainer.show = false;
};

const onAssistantPromptSubmit = () => {
  unsetErrorAlert();
};

const handleEditorUpdateEvent = () => {
  if (assistantPromptContainer.show) {
    updateAssistantPromptContainerPosition();
  }
  if (assistantDropdownMenu.show) {
    updateAssistantDropdownMenuPosition();
  }
};

watch(
  () => editorStore.hasTextSelected,
  newValue => {
    if (newValue !== true) {
      assistantPromptContainer.show = false;
      assistantDropdownMenu.show = false;
    }
  },
);

const setActiveTool = (tool: string) => {
  // tbd
};
const unsetActiveTool = (tool: string) => {
  // tbd
};
const runEditorCommand = (payload: any) => {
  if (!editor.value) throw new Error('Editor instance is not available');
  editorStore.runCommand({ command: payload.command, args: payload.args });
};

const setupSocketListeners = (chatId: string, documentId: string) => {
  socket.on(`chat:${chatId}-tool-start-event`, setActiveTool);
  socket.on(`chat:${chatId}-tool-end-event`, unsetActiveTool);
  socket.on(`document:${documentId}-editor-command`, runEditorCommand);
};

const removeSocketListeners = (chatId: string, documentId: string) => {
  socket.off(`chat:${chatId}-tool-start-event`, setActiveTool);
  socket.off(`chat:${chatId}-tool-end-event`, unsetActiveTool);
  socket.off(`document:${documentId}-editor-command`, runEditorCommand);
};

onMounted(() => {
  editorStore.addEventListener('update', handleEditorUpdateEvent);
  editorStore.addEventListener('blur', handleEditorBlurEvent);
  window.addEventListener('mouseup', handleMouseUp);
  // window.addEventListener('contextmenu', handleContextMenu);

  // setup socket listeners
  setupSocketListeners('chatId', '1234567890');
});

onBeforeUnmount(() => {
  editorStore.removeEventListener('update', handleEditorUpdateEvent);
  editorStore.removeEventListener('blur', handleEditorBlurEvent);
  editorStore.destroyEditor();

  window.removeEventListener('mouseup', handleMouseUp);
  // window.removeEventListener('contextmenu', handleContextMenu);

  // remove socket listeners
  removeSocketListeners('chatId', '1234567890');
});
</script>

<template>
  <div v-if="!editor">No Editor Instance</div>
  <div v-else id="text-editor" class="rounded-lg bg-white overflow-hidden h-full relative">
    <!-- Menu -->
    <div class="border-b flex justify-between items-center rounded-t-lg overflow-hidden h-13">
      <!-- Left Menu -->
      <div class="px-4">
        <!--
        <Button
          variant="ghost"
          size="icon"
          class="opacity-75 hover:opacity-100 cursor-pointer"
          @click="drawer.toggle('abc')"
        >
          <PanelLeftIcon class="size-5" />
        </Button>
        -->
        <!--
        <EditorFileMenu />
        -->
      </div>
      <!-- Center Menu -->
      <div>
        <EditorMenu />
      </div>
      <!-- Right Menu -->
      <div class="w-20"></div>
    </div>
    <!-- (Sheet) Editor Content Wrapper -->
    <div class="overflow-y-auto bg-stone-50 h-[calc(100vh-7.5rem)] pb-5">
      <!-- Error Alert -->
      <div class="pt-5 -mb-10 max-w-4xl mx-auto" v-if="errorAlert.open">
        <ErrorAlert v-model="errorAlert.open" v-bind="errorAlert" />
      </div>
      <!-- Editor Wrapper -->
      <div
        id="editorWrapper"
        ref="editorWrapperRef"
        class="max-w-5xl mt-8 mx-auto shadow-md border px-32 py-28 rounded-sm bg-white min-h-full relative"
      >
        <!-- Assistant Status Indicator -->
        <div
          v-if="false"
          class="absolute z-20 pointer-events-none border top-4 right-4 min-w-32 px-3 py-2 shadow-md rounded-lg flex items-center space-x-3"
        >
          <div
            class="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin opacity-75"
          ></div>
          <p class="text-sm">Editiere Dokument ...</p>
        </div>
        <!-- Assistant Dropdown Menu -->
        <div
          v-if="assistantDropdownMenu.show"
          class="absolute left-14 z-10"
          :style="{
            top: `${assistantDropdownMenu.yPosition}px`,
          }"
        >
          <EditorAssistantDropdownMenu
            @close="() => handleCloseAssistantDropdownMenu()"
            @prompt="() => handleShowPromptContainer()"
          />
        </div>
        <!-- Assistant Prompt Container -->
        <div
          v-if="assistantPromptContainer.show"
          ref="assistantPromptContainerRef"
          class="absolute z-10"
          :style="{
            top: `${assistantPromptContainer.yPosition}px`,
            left: `${assistantPromptContainer.xPosition}px`,
          }"
        >
          <EditorAssistantPromptContainer
            @close="() => handleCloseAssistantPromptContainer()"
            @refresh-position="updateAssistantPromptContainerPosition"
            @submit="onAssistantPromptSubmit"
            @error="onAssistantPromptError"
          />
        </div>
        <!-- Editor Content -->
        <div id="editorContent" ref="editorContentRef" class="relative">
          <EditorContent :editor="editor" />

          <!-- Loading spinner -->
          <div
            v-if="isLoading"
            class="absolute z-20 pointer-events-none"
            :style="{
              left: `${spinnerPosition.x}px`,
              top: `${spinnerPosition.y}px`,
            }"
          >
            <div
              class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin opacity-75"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
