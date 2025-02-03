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

  function onH1Click() {
    editor.chain().focus().toggleHeading({ level: 1 }).run();
  }

  function onH2Click() {
    editor.chain().focus().toggleHeading({ level: 2 }).run();
  }

  function onItalicClick() {
    editor.chain().focus().toggleMark('italic').run();
  }

  function onBoldClick() {
    editor.chain().focus().toggleMark('bold').run();
  }

  function onUnderlineClick() {
    editor.chain().focus().toggleMark('underline').run();
  }

  function onStrikeClick() {
    editor.chain().focus().toggleMark('strike').run();
  }

  function onHighlightClick() {
    editor.chain().focus().toggleMark('highlight').run();
  }

  function onUndoClick() {
    editor.chain().focus().undo().run();
  }

  function onRedoClick() {
    editor.chain().focus().redo().run();
  }

  function onToggleCodeClick() {
    editor.chain().focus().toggleCode().run();
  }

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
  };
}
