import type { JSONContent } from '@tiptap/core';

interface OutputContent {
  text: string;
  posStart: number;
  posEnd: number;
  lineNumber: number;
}

/*export function transformEditorJsonContent(input: JSONContent[]): OutputContent[] {
  return input.reduce<OutputContent[]>((acc, item) => {
    if (item.attrs && item.content) {
      const { posStart, posEnd, lineNumber } = item.attrs;
      const text = item.content.reduce((textAcc, contentItem) => {
        return textAcc + (contentItem.text || '');
      }, '');

      acc.push({ text, posStart, posEnd, lineNumber });
    }
    return acc;
  }, []);
}*/

export function transformEditorJsonContent(input: JSONContent[]): OutputContent[] {
  const output: OutputContent[] = [];

  function processContent(content: JSONContent[], parentAttrs?: Record<string, any>) {
    content.forEach(item => {
      const attrs = item.attrs || parentAttrs || {};
      const { posStart, posEnd, lineNumber } = attrs;

      if (item.text) {
        output.push({
          text: item.text,
          posStart: posStart ?? -1,
          posEnd: posEnd ?? -1,
          lineNumber: lineNumber ?? -1,
        });
      }

      if (item.content) {
        // Recursive call for nested content
        processContent(item.content, attrs);
      }
    });
  }

  processContent(input);

  // Sort the output by posStart to ensure correct order
  return output.sort((a, b) => a.posStart - b.posStart);
}
