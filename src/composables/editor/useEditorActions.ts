import type { Editor } from '@tiptap/vue-3';
import { EditorAiActionEnum } from './../../enums/editor-ai.enum';

export default function useEditorActions(editor: Editor) {
  if (!editor) {
    throw new Error('useEditorActions is missing an editor instance');
  }

  function parsePrompt(prompt: string) {
    return prompt.trim();
  }

  function aiAction(action: string, prompt: string | undefined = undefined) {
    return editor.chain().focus().aiAction({ action, prompt }).run();
  }

  function onImproveClick() {
    return aiAction(EditorAiActionEnum.IMPROVE);
  }

  function onExtendClick() {
    return aiAction(EditorAiActionEnum.EXTEND);
  }

  function onShortenClick() {
    return aiAction(EditorAiActionEnum.SHORTEN);
  }

  function onRephraseClick() {
    return aiAction(EditorAiActionEnum.REPHRASE);
  }

  function onSummarizeClick() {
    return aiAction(EditorAiActionEnum.SUMMARIZE);
  }

  function onSimplifyClick() {
    return aiAction(EditorAiActionEnum.SIMPLIFY);
  }

  function onSpellingGrammarClick() {
    return aiAction(EditorAiActionEnum.SPELLING);
  }

  function onCustomActionClick(prompt: string) {
    const safePrompt = prompt ? parsePrompt(prompt) : '';
    return aiAction(EditorAiActionEnum.CUSTOM, safePrompt);
  }

  const defaultChain = editor.chain().focus();

  const onH1Click = () => {
    return editor.chain().focus().toggleHeading({ level: 1 }).run();
  };

  const onH2Click = () => {
    return editor.chain().focus().toggleHeading({ level: 2 }).run();
  };

  const onItalicClick = () => {
    return editor.chain().focus().toggleMark('italic').run();
  };

  const onBoldClick = () => {
    return editor.chain().focus().toggleMark('bold').run();
  };

  const onUnderlineClick = () => {
    return editor.chain().focus().toggleMark('underline').run();
  };

  const onStrikeClick = () => {
    return editor.chain().focus().toggleMark('strike').run();
  };

  const onHighlightClick = () => {
    return editor.chain().focus().toggleMark('highlight').run();
  };

  const onUndoClick = () => {
    return editor.chain().focus().undo().run();
  };

  const onRedoClick = () => {
    return editor.chain().focus().redo().run();
  };

  const onToggleCodeClick = () => {
    return editor.chain().focus().toggleCode().run();
  };

  const onToggleTaskListClick = () => {
    return editor.chain().focus().toggleTaskList().run();
  };

  const onToggleListClick = () => {
    if (editor.isActive('bulletList')) {
      // Convert bullet list to ordered list
      return editor.chain().focus().toggleOrderedList().run();
    } else if (editor.isActive('orderedList')) {
      // Remove the ordered list formatting entirely
      return editor.chain().focus().toggleOrderedList().run();
    } else {
      // No list active: start a bullet list
      return editor.chain().focus().toggleBulletList().run();
    }
  };

  const onToggleBulletListClick = () => {
    return editor.chain().focus().toggleBulletList().run();
  };

  const onToggleOrderedListClick = () => {
    return editor.chain().focus().toggleOrderedList().run();
  };

  const onToggleTextOrientationClick = () => {
    if (editor.isActive({ textAlign: 'left' })) {
      return editor.chain().focus().setTextAlign('center').run();
    } else if (editor.isActive({ textAlign: 'center' })) {
      return editor.chain().focus().setTextAlign('right').run();
    } else if (editor.isActive({ textAlign: 'right' })) {
      return editor.chain().focus().setTextAlign('justify').run();
    } else if (editor.isActive({ textAlign: 'justify' })) {
      return editor.chain().focus().setTextAlign('left').run();
    } else {
      return editor.chain().focus().setTextAlign('center').run();
    }
  };

  return {
    onImproveClick,
    onExtendClick,
    onShortenClick,
    onRephraseClick,
    onSummarizeClick,
    onSimplifyClick,
    onSpellingGrammarClick,
    onCustomActionClick,
    onH1Click,
    onH2Click,
    onItalicClick,
    onBoldClick,
    onUnderlineClick,
    onStrikeClick,
    onHighlightClick,
    onUndoClick,
    onRedoClick,
    onToggleCodeClick,
    onToggleListClick,
    onToggleTaskListClick,
    onToggleBulletListClick,
    onToggleOrderedListClick,
    onToggleTextOrientationClick,
  };
}
