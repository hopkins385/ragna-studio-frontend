import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Extension } from '@tiptap/vue-3';

export const aiPluginKey = new PluginKey('ai-extension');

interface AiActionOptions {
  action: string;
  prompt?: string;
}

interface CompletionHandlerPayload {
  context: string;
  selectedText: string;
  prompt: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ai: {
      aiAction: (aiActionOptions: AiActionOptions) => ReturnType;
    };
  }
  interface EditorOptions {
    completionHandler: (payload: CompletionHandlerPayload) => Promise<string>;
  }
}

export const AI = Extension.create({
  name: 'ai',
  addOptions() {
    return {
      lang: null,
      completionHandler: async () => {
        return '';
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: aiPluginKey,
      }),
    ];
  },
  addCommands() {
    return {
      aiAction:
        (aiActionOptions: AiActionOptions) =>
        ({ editor }) => {
          const { from, to } = editor.state.selection;
          const { lang, completionHandler } = this.options;

          // Get the selected text and preserve the new line characters such as \n
          const textBetween = editor.state.doc.textBetween(from, to);

          const handlerPayload = {
            // lang,
            // action: aiActionOptions.action,
            context: editor.getHTML(),
            selectedText: textBetween,
            prompt: aiActionOptions.prompt,
          };

          completionHandler(handlerPayload)
            .then((completion: string) => {
              // Insert the completion into the
              editor
                .chain()
                .deleteRange({ from, to }) // First delete the existing content
                .insertContent(completion, {
                  parseOptions: {
                    preserveWhitespace: 'full',
                  },
                })
                .focus()
                .run();
            })
            .catch((error: any) => {
              console.error('Error while fetching completion', error);
            });

          return true;
        },
    };
  },
});

/* backup code
const transaction = editor.state.tr.insertText(
  completion,
  from,
  to,
);
editor.view.dispatch(transaction);
*/
