import type { Editor } from '@tiptap/vue-3'

export function getSelectedText(editor: Editor) {
  if (!editor) return ''
  const { from, to } = editor.state.selection
  // get the text for the current selection
  return editor.state.doc.textBetween(from, to) || ''
}

export function getCursorPosition(editor: Editor) {
  if (!editor) return 0
  return editor.state.selection.$anchor.pos
}

interface SelectionText {
  cursorPosition: number
  selectedText: string
  textContent: string
  pos: { from: number; to: number }
}

export function getSelectionText(editor: Editor) {
  if (!editor) return {} as SelectionText
  const { from, to } = editor.state.selection
  const cursorPosition = editor.state.selection.$anchor.pos
  const selectedText = editor.state.doc.textBetween(from, to) || ''
  const textContent = editor.state.doc.textContent || ''
  return {
    cursorPosition,
    selectedText,
    textContent,
    pos: { from, to }
  } as SelectionText
}

/*
  const insertFullText = () => {
    // insert auotcomplete text at cursor position inside of proseMirror
    console.log('insertFullText: ', props.suggestionText);
    if (!props.suggestionText) return;
    // 0. get length of autocomplete text
    const suggestionTextLength = props.suggestionText.length;
    if (suggestionTextLength === 0) return;

    // 1. get cursor position
    const cursorPosition = editor?.state.selection.$anchor.pos;

    // 2. insert text at cursor position
    editor?.chain().insertContentAt(cursorPosition, props.suggestionText).run();
    // 3. set cursor position to end of inserted text
    editor?.commands.setTextSelection(cursorPosition + suggestionTextLength);
  };
  */
