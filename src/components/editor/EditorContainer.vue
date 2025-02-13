<script setup lang="ts">
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
import EditorAssistantDropdownMenu from './EditorAssistantDropdownMenu.vue';
import EditorAssistantPromptContainer from './EditorAssistantPromptContainer.vue';
import EditorMenu from './EditorMenu.vue';
import { type CommentData } from './extensions/comment-extension';
import { InvisibleCharacters } from './extensions/invisible-characters';
import { NodeTracker } from './extensions/node-tracker';
import { SetSelection } from './extensions/set-selection';

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

const dummyCommentsData: CommentData[] = [
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

const documentId = ref('aaaabbbbccccdddeeefffgggghhhh');
const editorContent = ref<JSONContent | undefined>(undefined);

const editor = new Editor({
  content: editorContent.value,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Write something …',
    }),
    Highlight,
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
    SetSelection,
  ],
  onUpdate: ({ editor }) => {
    editorContent.value = editor.getJSON();
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

const handleEditorBlurEvent = (event: FocusEvent) => {
  // event.preventDefault();
  // If the focused element is inside the bubble container, do nothing.
  if (
    assistantPromptContainerRef.value &&
    event.relatedTarget &&
    assistantPromptContainerRef.value.contains(event.relatedTarget as Node)
  ) {
    return;
  }
  // console.log('editor blur');
  assistantPromptContainer.show = false;
};

const updatePromptContainerPosition = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount < 1 || !editorWrapperRef.value) {
    return;
  }
  const rangeRect = selection.getRangeAt(0).getBoundingClientRect();
  const containerRect = editorWrapperRef.value.getBoundingClientRect();
  // show the container below the selected text on the left side
  const xPosition = 140; //rangeRect.x - containerRect.x;
  const yPosition = rangeRect.y - containerRect.y + rangeRect.height + 10;
  assistantPromptContainer.xPosition = xPosition;
  assistantPromptContainer.yPosition = yPosition;
};

const handleOpenPromptContainer = () => {
  if (hasTextSelected.value && !isOutsideWrapper.value) {
    updatePromptContainerPosition();
    assistantPromptContainer.show = true;
  } else {
    assistantPromptContainer.show = false;
  }
};

const updateAssistantDropdownMenuPosition = () => {
  const selection = window.getSelection();
  if (!editorWrapperRef.value || !selection || selection.rangeCount < 1) {
    return;
  }
  const rangeRect = selection.getRangeAt(0).getBoundingClientRect();
  const containerRect = editorWrapperRef.value.getBoundingClientRect();
  const yPosition = rangeRect.y - containerRect.top;
  assistantDropdownMenu.yPosition = yPosition - 2;
};

// Handle mouseup event to show the assistant dropdown menu
const handleMouseUp = async (event: MouseEvent) => {
  await nextTick();
  if (
    hasTextSelected.value &&
    editorWrapperRef.value &&
    !isOutsideWrapper.value
  ) {
    updateAssistantDropdownMenuPosition();
    assistantDropdownMenu.show = true;
  } else {
    assistantDropdownMenu.show = false;
  }
};

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  handleOpenPromptContainer();
};

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
      assistantPromptContainer.show = false;
      assistantDropdownMenu.show = false;
    }
  },
);

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('contextmenu', handleContextMenu);
});

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', handleMouseUp);
  window.removeEventListener('contextmenu', handleContextMenu);
  editor.destroy();
});
</script>

<template>
  <div
    id="text-editor"
    class="rounded-lg bg-white overflow-hidden h-full relative"
  >
    <!-- Menu -->
    <div
      class="border-b flex justify-between items-center rounded-t-lg overflow-hidden h-13"
    >
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
    <!-- Editor Content -->
    <div class="overflow-y-auto bg-stone-50 h-[calc(100vh-7.5rem)] pb-5">
      <div
        id="editorWrapper"
        ref="editorWrapperRef"
        class="max-w-5xl mt-8 mx-auto shadow-md border px-32 py-28 rounded-sm bg-white min-h-full relative"
      >
        <div
          v-if="assistantDropdownMenu.show"
          class="absolute left-14 z-10"
          :style="{
            top: `${assistantDropdownMenu.yPosition}px`,
          }"
        >
          <EditorAssistantDropdownMenu
            @close="assistantDropdownMenu.show = false"
            @prompt="() => handleOpenPromptContainer()"
            @refresh-position="() => updatePromptContainerPosition()"
          />
        </div>

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
            @close="assistantPromptContainer.show = false"
          />
        </div>
        <!--
        <BubbleMenu
          v-if="editor"
          :editor="editor"
          :tippy-options="{ duration: 100, placement: 'bottom-start' }"
        >
          <EditorassistantPromptContainer :is-loading="isLoading" :editor="editor" />
        </BubbleMenu>
        -->

        <EditorContent ref="editorContentRef" :editor="editor" />
      </div>
    </div>
  </div>
</template>
