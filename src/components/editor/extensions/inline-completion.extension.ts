import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

// DTO for the external API response
export interface CompletionResponseDTO {
  completion: string;
}

// Options for the inline completion extension
export interface InlineCompletionOptionsDTO {
  fetchUrl: string; // API endpoint for completions (unused when using external handler exclusively)
  delay: number; // Debounce delay in milliseconds
  activationTriggers: string[]; // Characters triggering the fetch
  timeout: number; // Timeout for fetch in milliseconds
  completionHandler: (params: {
    context: string;
    timeout: number;
  }) => Promise<CompletionResponseDTO>;
}

// Default options
const defaultOptions: InlineCompletionOptionsDTO = {
  fetchUrl: '',
  delay: 300,
  activationTriggers: [' '],
  timeout: 5000,
  completionHandler: async () => {
    throw new Error('No completionHandler provided');
  },
};

export const inlineCompletionPluginKey = new PluginKey('inlineCompletion');

export const InlineCompletionExtension = Extension.create<InlineCompletionOptionsDTO>({
  name: 'inlineCompletion',

  addOptions() {
    return { ...defaultOptions };
  },

  addProseMirrorPlugins() {
    const extOptions = this.options; // capture extension options to avoid undefined 'this' in callbacks
    let debounceTimer: number | undefined;
    let currentRequest = 0;

    return [
      new Plugin({
        key: inlineCompletionPluginKey,
        state: {
          init() {
            return { suggestion: '', decorationSet: DecorationSet.empty };
          },
          apply(tr, value, oldState, newState) {
            const meta = tr.getMeta(inlineCompletionPluginKey);
            if (meta && meta.clear) {
              return { suggestion: '', decorationSet: DecorationSet.empty };
            }
            if (meta && meta.suggestion !== undefined && meta.decorationSet !== undefined) {
              return { suggestion: meta.suggestion, decorationSet: meta.decorationSet };
            }
            return value;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)?.decorationSet;
          },
          handleTextInput(view, from, to, text) {
            // Clear any existing suggestion to avoid blocking further typing
            const pluginState = inlineCompletionPluginKey.getState(view.state);
            if (pluginState && pluginState.suggestion) {
              const trClear = view.state.tr.setMeta(inlineCompletionPluginKey, { clear: true });
              view.dispatch(trClear);
            }

            // Only trigger on activation characters using captured extOptions
            if (!extOptions.activationTriggers.some(trigger => text.includes(trigger))) {
              return false;
            }
            if (debounceTimer) {
              window.clearTimeout(debounceTimer);
            }
            debounceTimer = window.setTimeout(() => {
              (async () => {
                // Extract context from the current line
                const { state } = view;
                const $from = state.selection.$from;
                const lineStart = $from.start();
                const context = state.doc.textBetween(lineStart, $from.pos, ' ');

                // Increment request counter and capture the current request id
                const requestId = ++currentRequest;

                try {
                  // Use solely the external completionHandler
                  if (!extOptions.completionHandler) {
                    throw new Error('No completionHandler provided');
                  }
                  const data: CompletionResponseDTO = await extOptions.completionHandler({
                    context,
                    timeout: extOptions.timeout,
                  });

                  console.log('Inline completion response:', data);

                  // Ensure response belongs to the latest request
                  if (requestId !== currentRequest) {
                    return;
                  }

                  // Derive suggestion by stripping context if needed
                  const suggestion = data.completion.replace(context, '') || '';

                  // Re-read the current state to get up-to-date cursor position
                  const { state } = view;
                  const pos = state.selection.from;

                  // Replace the inline decoration with a widget decoration for suggestion display
                  const deco = Decoration.widget(
                    pos,
                    () => {
                      const span = document.createElement('span');
                      span.className = 'inline-completion-suggestion';
                      span.textContent = suggestion;
                      return span;
                    },
                    { side: 1 },
                  );

                  const decorationSet = DecorationSet.create(state.doc, [deco]);

                  const tr = state.tr.setMeta(inlineCompletionPluginKey, {
                    suggestion,
                    decorationSet,
                  });
                  console.log('Inline completion transaction:', tr);

                  view.dispatch(tr);
                } catch (error) {
                  console.error('Inline completion fetch error:', error);
                }
              })();
            }, extOptions.delay);

            return false; // Allow the text input to proceed
          },
          handleKeyDown(view, event) {
            const pluginState = inlineCompletionPluginKey.getState(view.state);
            // Accept suggestion on Tab if available
            if (
              pluginState &&
              pluginState.suggestion &&
              event.key === 'Tab'
            ) {
              const { state } = view;
              const { from, to } = state.selection;
              const tr = state.tr
                .insertText(pluginState.suggestion, from, to)
                .setMeta(inlineCompletionPluginKey, { clear: true });
              view.dispatch(tr);
              event.preventDefault();
              return true;
            }
            // Cancel suggestion on Escape
            if (event.key === 'Escape') {
              const tr = view.state.tr.setMeta(inlineCompletionPluginKey, { clear: true });
              view.dispatch(tr);
              return true;
            }
            return false;
          },
          // New view update handler that clears the suggestion if the cursor moves away from its position
          handleDOMEvents: {
            keyup: (view, event) => {
              const pluginState = inlineCompletionPluginKey.getState(view.state);
              if (pluginState && pluginState.suggestion && pluginState.decorationSet) {
                const decos = pluginState.decorationSet.find();
                if (decos.length > 0) {
                  const suggestionPos = decos[0].from;
                  const cursorPos = view.state.selection.from;
                  if (cursorPos !== suggestionPos) {
                    const tr = view.state.tr.setMeta(inlineCompletionPluginKey, { clear: true });
                    view.dispatch(tr);
                  }
                }
              }
              return false;
            }
          }
        },
        appendTransaction(transactions, oldState, newState) {
          let tr = newState.tr;
          transactions.forEach(tx => {
            const meta = tx.getMeta(inlineCompletionPluginKey);
            if (meta && meta.clear) {
              tr = tr.setMeta(inlineCompletionPluginKey, {
                suggestion: '',
                decorationSet: DecorationSet.empty,
              });
            }
          });
          if (tr.steps.length) {
            return tr;
          }
          return;
        },
      }),
    ];
  },
});
