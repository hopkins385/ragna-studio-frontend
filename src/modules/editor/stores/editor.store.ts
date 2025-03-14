import CommentsExtension, { type Comment } from '@/components/editor/extensions/comments-extension';
import { HighlightSelection } from '@/components/editor/extensions/highlight-selection.extension';
import { InvisibleCharacters } from '@/components/editor/extensions/invisible-characters';
import { NodeTracker } from '@/components/editor/extensions/node-tracker';
import type { CallbackFunction, EditorContent } from '@/modules/editor/types/editor.types';
import type { EditorEvents, JSONContent } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import ListKeymap from '@tiptap/extension-list-keymap';
import Placeholder from '@tiptap/extension-placeholder';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import type { ParseOptions } from '@tiptap/pm/model';
import StarterKit from '@tiptap/starter-kit';
import { Editor } from '@tiptap/vue-3';
import { defineStore } from 'pinia';

export const useEditorStore = defineStore('editor-store', () => {
  const { t } = useI18n();

  // internal state refs
  const _editor = ref<Editor>();
  const _editorContent = ref<string>('');
  const _hasTextSelected = ref(false);
  const _comments = ref<Comment[] | undefined>(undefined);
  const _selectedCommentId = ref<string | null>(null);

  // external state refs
  const showComments = ref(false);
  const showAiChat = ref(false);

  // readonly states
  const hasTextSelected = computed(() => _hasTextSelected.value);
  const hasComments = computed(() => !!_comments.value && _comments.value.length > 0);
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

  function getEditor(): globalThis.Ref<Editor, Editor> {
    if (!_editor || !_editor.value) {
      _editor.value = _createEditorInstance();
    }
    return _editor as globalThis.Ref<Editor, Editor>;
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

    getEditor().value.commands.setContent(content, emitUpdate, parseOptions, {
      errorOnInvalidContent: true,
    });
  }

  function getJSONContent(): JSONContent {
    return getEditor().value.getJSON();
  }
  function getHtmlContent(): string {
    return getEditor().value.getHTML();
  }

  function addEventListener<T extends keyof EditorEvents>(
    event: T,
    callback: CallbackFunction<EditorEvents, T>,
  ) {
    getEditor().value.on(event, callback);
  }

  function removeEventListener<T extends keyof EditorEvents>(
    event: T,
    callback: CallbackFunction<EditorEvents, T>,
  ) {
    getEditor().value.off(event, callback);
  }

  async function syncCommentsWithBackend() {
    // Sync comments with backend
  }

  async function addCommentToSelection(payload: { commentText: string }) {
    const { from, to } = getEditor().value.state.selection;
    const newComment: Comment = {
      id: Date.now().toString(),
      text: payload.commentText,
      from,
      to,
    };
    getEditor().value.chain().focus(to).addOneComment(newComment).run();
    if (!_comments.value) {
      _comments.value = [newComment];
    } else {
      _comments.value.push(newComment);
    }
    await syncCommentsWithBackend();
  }

  async function deleteComment(id: string) {
    getEditor().value.chain().focus().removeOneComment(id).run();
    _comments.value = _comments.value?.filter(comment => comment.id !== id);
    await syncCommentsWithBackend();
  }

  async function hydrateComments(comments: Comment[]) {
    getEditor().value.commands.initAllComments(comments);
    _comments.value = comments;
  }

  // Commands

  function toggleShowComments(value?: boolean) {
    if (value !== undefined) {
      showComments.value = value;
    } else {
      showComments.value = !showComments.value;
    }

    // toggles the comments-highlights by removing/adding the comments
    if (showComments.value) {
      return getEditor().value.chain().focus().initAllComments(comments.value).run();
    } else {
      return getEditor().value.chain().focus().initAllComments([]).run();
    }
  }

  function replaceText(payload: { from: number; to: number; text: string }) {
    const { from, to, text } = payload;
    return getEditor()
      .value.chain()
      .focus(from)
      .deleteRange({ from, to })
      .insertContent(text)
      .run();
  }

  function formatText(payload: { format: string; from?: number; to?: number }) {
    const { format } = payload;

    const chain = getEditor().value.chain().focus();
    if (payload.from !== undefined && payload.to !== undefined) {
      chain.setTextSelection({ from: payload.from, to: payload.to });
    }

    switch (format) {
      case 'h1':
        return chain?.toggleHeading({ level: 1 }).run();
        break;
      case 'h2':
        return chain?.toggleHeading({ level: 2 }).run();
        break;
      case 'h3':
        return chain?.toggleHeading({ level: 3 }).run();
        break;
      case 'bold':
        return chain?.toggleBold().run();
        break;
      case 'italic':
        return chain?.toggleItalic().run();
        break;
      case 'underline':
        return chain?.toggleUnderline().run();
        break;
      case 'strike':
        return chain?.toggleStrike().run();
        break;
      case 'code':
        return chain?.toggleCode().run();
        break;
      case 'highlight':
        return chain?.toggleHighlight().run();
        break;
      case 'toggleCode':
        return chain?.toggleCode().run();
        break;
      case 'toggleTaskList':
        return chain?.toggleTaskList().run();
        break;
      default:
        throw new Error(`Unknown format: ${format}`);
    }
  }

  function cycleList(payload?: { from: number; to: number }) {
    const editor = getEditor().value;
    const chain = editor.chain().focus();
    if (payload?.from !== undefined && payload?.to !== undefined) {
      chain.setTextSelection({ from: payload.from, to: payload.to });
    }

    if (editor.isActive('bulletList')) {
      // Convert bullet list to ordered list
      return chain.toggleOrderedList().run();
    } else if (editor.isActive('orderedList')) {
      // Remove the ordered list formatting entirely
      return chain.toggleOrderedList().run();
    } else {
      // No list active: start a bullet list
      return chain.toggleBulletList().run();
    }
  }

  function cycleTextOrientation(payload?: { from: number; to: number }) {
    const editor = getEditor().value;
    const chain = editor.chain().focus();
    if (payload?.from !== undefined && payload?.to !== undefined) {
      chain.setTextSelection({ from: payload.from, to: payload.to });
    }
    // Cycle through text alignments
    if (editor.isActive({ textAlign: 'left' })) {
      return chain.setTextAlign('center').run();
    } else if (editor.isActive({ textAlign: 'center' })) {
      return chain.setTextAlign('right').run();
    } else if (editor.isActive({ textAlign: 'right' })) {
      return chain.setTextAlign('justify').run();
    } else if (editor.isActive({ textAlign: 'justify' })) {
      return chain.setTextAlign('left').run();
    } else {
      return chain.setTextAlign('center').run();
    }
  }

  function insertContent(payload: { position: number; content: string }) {
    const { position, content } = payload;
    return getEditor().value.chain().focus(position).insertContentAt(position, content).run();
  }

  function deleteRange(payload: { from: number; to: number }) {
    const { from, to } = payload;
    return getEditor().value.chain().focus(from).deleteRange({ from, to }).run();
  }

  function addComment(payload: { from: number; to: number; comment: string }) {
    const { from, to, comment } = payload;
    const newComment: Comment = {
      id: Date.now().toString(),
      text: comment,
      from,
      to,
    };
    return getEditor().value.chain().focus(to).addOneComment(newComment).run();
  }

  function toggleInvisibleCharacters() {
    return getEditor().value.chain().focus().toggleInvisibleCharacters().run();
  }

  function toggleTaskList() {
    return getEditor().value.chain().focus().toggleTaskList().run();
  }

  function undo() {
    return getEditor().value.chain().focus().undo().run();
  }

  function redo() {
    return getEditor().value.chain().focus().redo().run();
  }

  function toggleShowAiChat() {
    showAiChat.value = !showAiChat.value;
  }

  return {
    editorContent,
    hasTextSelected,
    hasComments,
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
    addCommentToSelection,
    deleteComment,
    hydrateComments,
    toggleShowComments,
    toggleShowAiChat,
    // Commands
    replaceText,
    formatText,
    insertContent,
    deleteRange,
    addComment,
    cycleList,
    cycleTextOrientation,
    toggleTaskList,
    toggleInvisibleCharacters,
    undo,
    redo,
  };
});
