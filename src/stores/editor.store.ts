import CommentsExtension, { type Comment } from '@/components/editor/extensions/comments-extension';
import { HighlightSelection } from '@/components/editor/extensions/highlight-selection.extension';
import { InvisibleCharacters } from '@/components/editor/extensions/invisible-characters';
import { NodeTracker } from '@/components/editor/extensions/node-tracker';
import type { Content, EditorEvents, JSONContent } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import ListKeymap from '@tiptap/extension-list-keymap';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import type { Fragment, ParseOptions } from '@tiptap/pm/model';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/vue-3';
import { defineStore } from 'pinia';

type StringKeyOf<T> = Extract<keyof T, string>;
type CallbackType<
  T extends Record<string, any>,
  EventName extends StringKeyOf<T>,
> = T[EventName] extends any[] ? T[EventName] : [T[EventName]];
type CallbackFunction<T extends Record<string, any>, EventName extends StringKeyOf<T>> = (
  ...props: CallbackType<T, EventName>
) => any;
type EditorContent = Content | Fragment | string | null;

export const useEditorStore = defineStore('editor-store', () => {
  const { t } = useI18n();
  // internal state refs
  const _editor = ref<Editor | undefined>();
  const _editorContent = ref<string>('');
  const _hasTextSelected = ref(false);
  const _comments = ref<Comment[] | undefined>(undefined);
  const _selectedCommentId = ref<string | null>(null);

  // external state refs
  const showComments = ref(false);
  const showAiChat = ref(false);

  // readonly states
  const hasTextSelected = computed(() => _hasTextSelected.value);
  const editorContent = computed(() => _editorContent.value);
  const comments = computed<Comment[]>(() => _comments.value || []);
  const selectedCommentId = computed(() => _selectedCommentId.value);

  // actions
  function resetState() {
    _editorContent.value = '';
    _hasTextSelected.value = false;
    _comments.value = undefined;
    _selectedCommentId.value = null;
    showComments.value = false;
  }

  function handleCommentClickEvent(commentId: string, reference?: string) {
    // Handle comment event
    if (showComments.value !== true) {
      showComments.value = true;
    }
    _selectedCommentId.value = commentId;
  }

  function handleCommentUpdateEvent(comment: Comment) {
    // update the comment
    // find the comment in the list and update it
    const index = _comments.value?.findIndex(c => c.id === comment.id);
    if (index !== undefined && index >= 0) {
      _comments.value![index] = comment;
    }
  }

  function handleCommentsUpdatesEvent(comments: Comment[]) {
    // Handle comments updates event
    // find all comments in the list and update them
    comments.forEach(comment => {
      const index = _comments.value?.findIndex(c => c.id === comment.id);
      if (index !== undefined && index >= 0) {
        _comments.value![index] = comment;
      } else {
        _comments.value?.push(comment);
      }
    });
  }

  function _createEditorInstance(): Editor {
    return new Editor({
      content: _editorContent.value,
      extensions: [
        StarterKit.configure({
          codeBlock: false,
        }),
        Placeholder.configure({
          placeholder: t('editor.content.placeholder'),
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
          types: ['paragraph', 'heading', 'listItem', 'taskItem', 'taskList', 'hardBreak'],
          generateId: true,
        }),
        CommentsExtension.configure({
          onCommentClick: handleCommentClickEvent,
          onCommentUpdate: handleCommentUpdateEvent,
          onCommentsUpdates: handleCommentsUpdatesEvent,
        }),
        // InlineCompletionExtension.configure({
        //   completionHandler: fetchInlineCompletionHandler,
        // }),
      ],
      onUpdate: ({ editor }) => {
        _editorContent.value = editor.getText();
      },
      onCreate: ({ editor }) => {
        // Initial position update
        editor.commands.updatePositions();
      },
      onSelectionUpdate: ({ editor }) => {
        const { from, to } = editor.state.selection;
        _hasTextSelected.value = from !== to;
      },
      onBlur: ({ event }) => {},
      autofocus: 'end',
    });
  }

  function getEditor(): Editor {
    if (!_editor.value) {
      _editor.value = _createEditorInstance();
    }
    return _editor.value;
  }

  function destroyEditor() {
    if (_editor.value) {
      _editor.value.destroy();
    }
    _editor.value = undefined;
    resetState();
  }

  function setEditorContent(content: EditorContent) {
    const emitUpdate = true;
    const parseOptions: ParseOptions = {};

    getEditor().commands.setContent(content, emitUpdate, parseOptions, {
      errorOnInvalidContent: true,
    });
  }

  function getJSONContent(): JSONContent {
    return getEditor().getJSON();
  }
  function getHtmlContent(): string {
    return getEditor().getHTML();
  }

  function addEventListener<T extends keyof EditorEvents>(
    event: T,
    callback: CallbackFunction<EditorEvents, T>,
  ) {
    getEditor().on(event, callback);
  }

  function removeEventListener<T extends keyof EditorEvents>(
    event: T,
    callback: CallbackFunction<EditorEvents, T>,
  ) {
    getEditor().off(event, callback);
  }

  async function syncCommentsWithBackend() {
    // Sync comments with backend
  }

  async function addComment(commentText: string) {
    const { from, to } = getEditor().state.selection;
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      from,
      to,
    };
    getEditor().chain().focus(to).addOneComment(newComment).run();
    if (!_comments.value) {
      _comments.value = [newComment];
    } else {
      _comments.value.push(newComment);
    }
    await syncCommentsWithBackend();
  }

  async function deleteComment(id: string) {
    getEditor().chain().focus().removeOneComment(id).run();
    _comments.value = _comments.value?.filter(comment => comment.id !== id);
    await syncCommentsWithBackend();
  }

  async function hydrateComments(comments: Comment[]) {
    getEditor().commands.initAllComments(comments);
    _comments.value = comments;
  }

  function toggleShowComments(value?: boolean) {
    if (value !== undefined) {
      showComments.value = value;
    } else {
      showComments.value = !showComments.value;
    }

    // toggles the comments-highlights by removing/adding the comments
    if (showComments.value) {
      getEditor().chain().focus().initAllComments(comments.value).run();
    } else {
      getEditor().chain().focus().initAllComments([]).run();
    }
  }

  function toggleShowAiChat() {
    showAiChat.value = !showAiChat.value;
  }

  return {
    editorContent,
    hasTextSelected,
    comments,
    showComments,
    showAiChat,
    selectedCommentId,
    getEditor,
    destroyEditor,
    setEditorContent,
    getHtmlContent,
    getJSONContent,
    addEventListener,
    removeEventListener,
    addComment,
    deleteComment,
    hydrateComments,
    toggleShowComments,
    toggleShowAiChat,
  };
});
