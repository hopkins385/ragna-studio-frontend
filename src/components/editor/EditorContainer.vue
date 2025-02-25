<script setup lang="ts">
import { useEditorService } from '@/composables/services/useEditorService';
import { useErrorAlert } from '@/composables/useErrorAlert';
import { Highlight } from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import { ListKeymap } from '@tiptap/extension-list-keymap';
import { Placeholder } from '@tiptap/extension-placeholder';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { StarterKit } from '@tiptap/starter-kit';
import { Editor, EditorContent, type JSONContent } from '@tiptap/vue-3';
import ErrorAlert from '../error/ErrorAlert.vue';
import EditorAssistantDropdownMenu from './EditorAssistantDropdownMenu.vue';
import EditorAssistantPromptContainer from './EditorAssistantPromptContainer.vue';
import EditorMenu from './EditorMenu.vue';
import { HighlightSelection } from './extensions/highlight-selection.extension';
import {
  InlineCompletionExtension,
  type CompletionRequestContext,
  type InlineCompletionResponse,
} from './extensions/inline-completion/inline-completion.extension';
import { InvisibleCharacters } from './extensions/invisible-characters';
import { NodeTracker } from './extensions/node-tracker';

const isLoading = ref(false);
const spinnerPosition = ref({ x: 0, y: 0 });

const editorWrapperRef = ref<HTMLElement | null>(null);
const editorContentRef = ref<HTMLElement | null>(null);
const assistantPromptContainerRef = ref<HTMLElement | null>(null);

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
const { isOutside: isOutsideContent } = useMouseInElement(editorContentRef);
const { errorAlert, setErrorAlert, unsetErrorAlert } = useErrorAlert();
const { fetchInlineCompletion, abortCompletion } = useEditorService();

const creatCommentHandler = async (comment: any) => {
  console.log('create comment', comment);
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve(comment);
    }, 1000);
  });
};

const deleteCommentHandler = async (id: string) => {
  console.log('delete comment', id);
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve(id);
    }, 1000);
  });
};

const dummyCommentsData = [
  {
    id: '1',
    documentId: 'aaaabbbbccccdddeeefffgggghhhh',
    text: 'This is a comment on the first paragraph',
    anchor: {
      type: 'paragraph',
      posStart: 1,
      posEnd: 45,
      attrs: {
        posStart: 1,
        posEnd: 45,
      },
    },
    createdAt: new Date(),
  },
  {
    id: '2',
    documentId: 'aaaabbbbccccdddeeefffgggghhhh',
    text: 'This is a comment on the middle section',
    anchor: {
      type: 'paragraph',
      posStart: 46,
      posEnd: 120,
      attrs: {
        posStart: 46,
        posEnd: 120,
      },
    },
    createdAt: new Date(),
  },
];

const loadCommentsHandler = async (documentId: string) => {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve([]);
    }, 1000);
  });
};

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
  params.signal.addEventListener('abort', abortCompletion);

  try {
    const { inlineCompletion } = await fetchInlineCompletion({ context: params.context });
    return { inlineCompletion };
  } catch (error) {
    console.error('Error fetching inline completion:', error);
    return { inlineCompletion: '' };
  } finally {
    isLoading.value = false;
    // remove abort signal listener
    params.signal.removeEventListener('abort', abortCompletion);
  }
};

// watch the isLoading value and show/hide a loading spinner
watch(isLoading, newValue => {
  if (newValue) {
    // Show loading spinner at cursor position
    if (editor && editor.view) {
      const { from } = editor.state.selection;
      const coords = editor.view.coordsAtPos(from);
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

const documentId = ref('aaaabbbbccccdddeeefffgggghhhh');
const editorContent = ref<JSONContent | undefined>(undefined);

const editor = new Editor({
  content: editorContent.value,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Schreibe etwas …',
    }),
    Highlight,
    HighlightSelection,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph', 'listItem'],
    }),
    TaskList,
    TaskItem,
    ListKeymap,
    Image,
    InvisibleCharacters.configure({
      injectCSS: false,
    }),
    NodeTracker.configure({
      types: ['paragraph', 'heading', 'listItem', 'taskItem', 'taskList'],
      generateId: true,
    }),
    // CommentsExtension,
    InlineCompletionExtension.configure({
      completionHandler: fetchInlineCompletionHandler,
    }),
  ],
  onUpdate: ({ editor }) => {
    editorContent.value = editor.getJSON();
    if (assistantPromptContainer.show) {
      updateAssistantPromptContainerPosition();
    }
    if (assistantDropdownMenu.show) {
      updateAssistantDropdownMenuPosition();
    }
  },
  onCreate: ({ editor }) => {
    // Initial position update
    editor.commands.updatePositions();
  },
  onBlur: ({ event }) => {
    handleEditorBlurEvent(event);
  },
  autofocus: 'end',
});

const handleCloseAssistantDropdownMenu = () => {
  assistantDropdownMenu.show = false;
};

const handleCloseAssistantPromptContainer = () => {
  assistantPromptContainer.show = false;
};

const handleEditorBlurEvent = (event: FocusEvent) => {
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
  const { from, to } = editor.state.selection;
  if (from === to || !editorWrapperRef.value) {
    return;
  }

  const coords = editor.view.coordsAtPos(to);
  const containerRect = editorWrapperRef.value.getBoundingClientRect();

  const xPosition = 140;
  const yPosition = coords.bottom - containerRect.y + 10;

  assistantPromptContainer.xPosition = xPosition;
  assistantPromptContainer.yPosition = yPosition;
};

const handleShowPromptContainer = () => {
  if (hasTextSelected.value && !isOutsideWrapper.value) {
    updateAssistantPromptContainerPosition();
    assistantPromptContainer.show = true;
  } else {
    assistantPromptContainer.show = false;
  }
};

const updateAssistantDropdownMenuPosition = () => {
  const { from } = editor.state.selection;
  if (!editorWrapperRef.value) {
    return;
  }

  const coords = editor.view.coordsAtPos(from);
  const containerRect = editorWrapperRef.value.getBoundingClientRect();

  assistantDropdownMenu.yPosition = coords.top - containerRect.top - 2;
};

// Handle mouseup event to show the assistant dropdown menu
const handleMouseUp = () => {
  const { from, to } = editor.state.selection;
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

//

const hasTextSelected = computed(() => {
  if (editorContent.value && editorContent.value.length < 1) {
    return false;
  }
  const { from, to } = editor.state.selection;
  return from !== to;
});

watch(
  () => hasTextSelected.value,
  newValue => {
    if (newValue === false) {
      // Only hide if there's really no selection
      const { from, to } = editor.state.selection;
      if (from === to) {
        assistantPromptContainer.show = false;
      }
      assistantDropdownMenu.show = false;
    }
  },
);

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp);
  // window.addEventListener('contextmenu', handleContextMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', handleMouseUp);
  // window.removeEventListener('contextmenu', handleContextMenu);
  editor.destroy();
});
</script>

<template>
  <div id="text-editor" class="rounded-lg bg-white overflow-hidden h-full relative">
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
      </div>
      <!-- Center Menu -->
      <div class="">
        <EditorMenu :editor="editor" :is-loading="false" />
      </div>
      <!-- Right Menu -->
      <div class="w-20"></div>
    </div>
    <!-- (Sheet) Editor Content Wrapper -->
    <div class="overflow-y-auto bg-stone-50 h-[calc(100vh-7.5rem)] pb-5">
      <!-- Error Alert -->
      <div class="pt-5 -mb-10 max-w-4xl mx-auto" v-if="errorAlert.open">
        <ErrorAlert v-model="errorAlert.open" :message="errorAlert.message" />
      </div>
      <!-- Editor Wrapper -->
      <div
        id="editorWrapper"
        ref="editorWrapperRef"
        class="max-w-5xl mt-8 mx-auto shadow-md border px-32 py-28 rounded-sm bg-white min-h-full relative"
      >
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
            :editor="editor"
            @close="() => handleCloseAssistantPromptContainer()"
            @refresh-position="updateAssistantPromptContainerPosition"
            @submit="onAssistantPromptSubmit"
            @error="onAssistantPromptError"
          />
        </div>
        <!-- Editor Content -->
        <div id="editorContent" ref="editorContentRef" class="relative">
          <EditorContent :editor="editor" />
          <!--
          <div class="absolute top-0 right-0">
            <EditorComments :editor="editor" />
          </div>
          -->

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
