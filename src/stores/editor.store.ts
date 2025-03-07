import CommentsExtension from '@/components/editor/extensions/comments-extension';
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
  // ref
  const _editor = ref<Editor | undefined>();
  const _editorContent = ref<string>('');
  const _isTextSelected = ref(false);

  // computed
  const isTextSelected = computed(() => _isTextSelected.value);
  const editorContent = computed(() => _editorContent.value);

  // actions
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
        CommentsExtension,
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
        _isTextSelected.value = from !== to;
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

  return {
    editorContent,
    isTextSelected,
    getEditor,
    destroyEditor,
    setEditorContent,
    getHtmlContent,
    getJSONContent,
    addEventListener,
    removeEventListener,
  };
});
