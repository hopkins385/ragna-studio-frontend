import type { JSONContent } from '@tiptap/core';

interface OutputContent {
  text: string;
  posStart: number;
  posEnd: number;
  lineNumber: number;
}

export function transformEditorJsonContent(input: JSONContent[]): OutputContent[] {
  // Check if the input is an object and has a content property
  return input.reduce<OutputContent[]>((acc, item) => {
    // item.type === 'paragraph' &&
    if (item.attrs && item.content) {
      const { posStart, posEnd, lineNumber } = item.attrs;
      const text = item.content.reduce((textAcc, contentItem) => {
        return textAcc + (contentItem.text || '');
      }, '');

      if (typeof posStart === 'number' && typeof posEnd === 'number') {
        acc.push({ text, posStart, posEnd, lineNumber });
      }
    }
    return acc;
  }, []);
}
