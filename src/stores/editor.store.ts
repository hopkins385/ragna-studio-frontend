import CommentsExtension, { type Comment } from '@/components/editor/extensions/comments-extension';
import { HighlightSelection } from '@/components/editor/extensions/highlight-selection.extension';
import { InvisibleCharacters } from '@/components/editor/extensions/invisible-characters';
import { NodeTracker } from '@/components/editor/extensions/node-tracker';
import type { EditorEvents, JSONContent } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import ListKeymap from '@tiptap/extension-list-keymap';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
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

export const useEditorStore = defineStore('editor-store', () => {
  // internal refs
  const _editor = ref<Editor | undefined>();
  const _editorContent = ref<string>('');
  const _hasTextSelected = ref(false);
  const _comments = ref<Comment[] | undefined>(undefined);
  const _selectedCommentId = ref<string | null>(null);

  // external refs
  const showComments = ref(false);

  // computed
  const hasTextSelected = computed(() => _hasTextSelected.value);
  const editorContent = computed(() => _editorContent.value);
  const comments = computed<Comment[]>(() => _comments.value || []);
  const selectedCommentId = computed(() => _selectedCommentId.value);

  // actions
  const handleCommentClickEvent = (commentId: string, reference?: string) => {
    // Handle comment event
    if (showComments.value !== true) {
      showComments.value = true;
    }
    _selectedCommentId.value = commentId;
  };

  const handleCommentUpdateEvent = (comment: Comment) => {
    // update the comment
    // find the comment in the list and update it
    const index = _comments.value?.findIndex(c => c.id === comment.id);
    if (index !== undefined && index >= 0) {
      _comments.value![index] = comment;
    }
  };

  const handleCommentsUpdatesEvent = (comments: Comment[]) => {
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
  };

  const _createEditorInstance = (): Editor => {
    return new Editor({
      content: _editorContent.value,
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
  };

  const getEditor = (): Editor => {
    if (!_editor.value) {
      _editor.value = _createEditorInstance();
    }
    return _editor.value;
  };

  const destroyEditor = () => {
    if (_editor.value) {
      _editor.value.destroy();
    }
    _editor.value = undefined;
    _editorContent.value = '';
    _hasTextSelected.value = false;
  };

  const setEditorContent = (content: JSONContent) => {
    if (!_editor.value) {
      throw new Error('Editor instance is not created yet.');
    }

    _editor.value.commands.setContent(content);
  };

  const getJSONContent = (): JSONContent => {
    if (!_editor.value) {
      throw new Error('Editor instance is not created yet.');
    }
    return _editor.value.getJSON();
  };

  const getHtmlContent = (): string => {
    if (!_editor.value) {
      throw new Error('Editor instance is not created yet.');
    }
    return _editor.value.getHTML();
  };

  const addEventListener = <T extends keyof EditorEvents>(
    event: T,
    callback: CallbackFunction<EditorEvents, T>,
  ) => {
    if (!_editor.value) {
      throw new Error('Editor instance is not created yet.');
    }
    _editor.value.on(event, callback);
  };

  const removeEventListener = <T extends keyof EditorEvents>(
    event: T,
    callback: CallbackFunction<EditorEvents, T>,
  ) => {
    if (!_editor.value) {
      throw new Error('Editor instance is not created yet.');
    }
    _editor.value.off(event, callback);
  };

  const syncCommentsWithBackend = async () => {
    // Sync comments with backend
  };

  const addComment = async (commentText: string) => {
    if (!_editor.value) {
      throw new Error('Editor instance is not created yet.');
    }
    const { from, to } = _editor.value.state.selection;
    const newComment: Comment = {
      id: Date.now().toString(),
      text: commentText,
      from,
      to,
    };
    _editor.value.chain().focus(to).addOneComment(newComment).run();
    if (!_comments.value) {
      _comments.value = [newComment];
    } else {
      _comments.value.push(newComment);
    }
    await syncCommentsWithBackend();
  };

  const deleteComment = async (id: string) => {
    if (!_editor.value) {
      throw new Error('Editor instance is not created yet.');
    }
    _editor.value.chain().focus().removeOneComment(id).run();
    _comments.value = _comments.value?.filter(comment => comment.id !== id);
    await syncCommentsWithBackend();
  };

  const hydrateComments = async (comments: Comment[]) => {
    if (!_editor.value) {
      throw new Error('Editor instance is not created yet.');
    }
    console.log('Hydrating comments:', comments);
    _editor.value.commands.initAllComments(comments);
    _comments.value = comments;
  };

  const toggleShowComments = () => {
    showComments.value = !showComments.value;
    if (showComments.value) {
      _editor.value?.chain().focus().initAllComments(comments.value).run();
    } else {
      _editor.value?.chain().focus().initAllComments([]).run();
    }
  };

  return {
    editorContent,
    hasTextSelected,
    comments,
    showComments,
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
  };
});
