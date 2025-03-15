import { z } from 'zod';

export const EditorCommand = {
  REPLACE_TEXT: 'replaceText',
  INSERT_CONTENT: 'insertContent',
  ADD_COMMENT: 'addComment',
  HIGHLIGHT_TEXT: 'highlightText',
} as const;

export const editorCommandSchema = z.object({
  command: z.nativeEnum(EditorCommand),
  args: z.object({
    from: z.number(),
    to: z.number(),
    text: z.string().optional(),
  }),
});
