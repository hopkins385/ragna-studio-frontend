<script setup lang="ts">
import useRunCompletion from '@/composables/editor/useRunCompletion';
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
import EditorBubbleContainer from './EditorBubbleContainer.vue';
import EditorMenu from './EditorMenu.vue';
import { AI } from './extensions/ai-extension';
import { Comment, type CommentData } from './extensions/comment-extension';
import { InvisibleCharacters } from './extensions/invisible-characters';
import { UniqueId } from './extensions/unique-id';

const documentId = ref('aaaabbbbccccdddeeefffgggghhhh');
const editorContent = ref<JSONContent | undefined>(undefined);

const editorWrapperRef = ref<HTMLElement | null>(null);
const bubbleContainerRef = ref<HTMLElement | null>(null);

const bubbleContainer = reactive({
  show: false,
  xPosition: 0,
  yPosition: 0,
});

const { isOutside } = useMouseInElement(editorWrapperRef);

const { runCompletion, isLoading } = useRunCompletion();

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
    text: 'This is a comment',
    anchor: {
      type: 'paragraph',
      from: 0,
      to: 10,
    },
  },
  {
    id: '1',
    documentId: 'aaaabbbbccccdddeeefffgggghhhh',
    text: 'This is a comment',
    anchor: {
      type: 'paragraph',
      from: 88,
      to: 281,
    },
  },
  {
    id: '1',
    documentId: 'aaaabbbbccccdddeeefffgggghhhh',
    text: 'This is a comment',
    anchor: {
      type: 'paragraph',
      from: 88,
      to: 111,
    },
  },
];

const loadCommentsHandler = async (documentId: string) => {
  return await new Promise(resolve => {
    setTimeout(() => {
      resolve(dummyCommentsData);
    }, 1000);
  });
};

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
    AI.configure({
      completionHandler: runCompletion,
    }),
    TaskList,
    TaskItem,
    ListKeymap,
    Image,
    Comment.configure({
      documentId: documentId.value,
      onCreateComment: creatCommentHandler,
      onDeleteComment: deleteCommentHandler,
      onLoadComments: loadCommentsHandler,
    }),
    /*JSONExtended.configure({
      onUpdate: json => {
        editorContent.value = json;
      },
    }),*/
    UniqueId.configure({
      types: ['paragraph', 'heading'], // Add node types that should receive IDs
      attributeName: 'id', // Optional: customize the attribute name
    }),
    InvisibleCharacters.configure({
      injectCSS: false,
    }),
  ],
  onUpdate: ({ editor }) => {
    editorContent.value = editor.getJSON();
  },
  onBlur: ({ event }) => {
    // If the focused element is inside the bubble container, do nothing.
    if (
      bubbleContainerRef.value &&
      event.relatedTarget &&
      bubbleContainerRef.value.contains(event.relatedTarget as Node)
    ) {
      return;
    }
    // console.log('editor blur');
    bubbleContainer.show = false;
  },
  autofocus: 'end',
});

const hasTextSelected = computed(() => {
  if (editorContent.value && editorContent.value.length < 1) {
    return false;
  }
  const { from, to } = editor.state.selection;
  return from !== to;
});

// Handle mouseup event to show the bubble container
const handleContextMenu = (event: MouseEvent) => {
  // If the click originated inside the bubble container, do nothing.
  if (
    bubbleContainerRef.value &&
    bubbleContainerRef.value.contains(event.target as Node)
  ) {
    return;
  }
  if (hasTextSelected.value && editorWrapperRef.value && !isOutside.value) {
    event.preventDefault();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      // const rangeRect = selection.getRangeAt(0).getBoundingClientRect();
      const containerRect = editorWrapperRef.value.getBoundingClientRect();
      bubbleContainer.xPosition = event.clientX - containerRect.left;
      bubbleContainer.yPosition = event.clientY - containerRect.top + 10; // 10px offset
      bubbleContainer.show = true;
    } else {
      bubbleContainer.show = false;
    }
  } else {
    bubbleContainer.show = false;
  }
};

watch(
  () => hasTextSelected.value,
  newValue => {
    if (newValue === false) {
      bubbleContainer.show = false;
    }
  },
);

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    bubbleContainer.show = false;
  }
};

onMounted(() => {
  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('contextmenu', handleContextMenu);
  window.removeEventListener('keydown', handleKeyDown);
  editor.destroy();
});
</script>

<template>
  {{ editorContent }}
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
          v-if="bubbleContainer.show"
          ref="bubbleContainerRef"
          class="absolute z-10"
          :style="{
            top: `${bubbleContainer.yPosition}px`,
            left: `${bubbleContainer.xPosition}px`,
          }"
        >
          <EditorBubbleContainer :is-loading="isLoading" :editor="editor" />
        </div>
        <!--
        <BubbleMenu
          v-if="editor"
          :editor="editor"
          :tippy-options="{ duration: 100, placement: 'bottom-start' }"
        >
          <EditorBubbleContainer :is-loading="isLoading" :editor="editor" />
        </BubbleMenu>
        -->

        <EditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>
