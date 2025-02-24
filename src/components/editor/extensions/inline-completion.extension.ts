import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

// DTO for the external API response
export interface CompletionResponseDTO {
  completion: string;
}

// Options for the inline completion extension
export interface InlineCompletionOptionsDTO {
  delay: number; // Debounce delay in milliseconds
  activationTriggers: string[]; // Characters triggering the fetch
  timeout: number; // Timeout for fetch in milliseconds
  completionHandler: (params: {
    context: string;
    timeout: number;
    signal: AbortSignal;
  }) => Promise<CompletionResponseDTO>;
}

// Default options
const defaultOptions: InlineCompletionOptionsDTO = {
  delay: 500,
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
    let currentAbortController: AbortController | null = null;

    // Helper function to fetch completion
    const fetchCompletion = async (view: any) => {
      if (currentAbortController) {
        currentAbortController.abort();
      }
      currentAbortController = new AbortController();
      const { state } = view;
      const $from = state.selection.$from;
      const lineStart = $from.start();
      const context = state.doc.textBetween(lineStart, $from.pos, ' ');
      const requestId = ++currentRequest;

      try {
        if (!extOptions.completionHandler) {
          throw new Error('No completionHandler provided');
        }
        const data: CompletionResponseDTO = await extOptions.completionHandler({
          context,
          timeout: extOptions.timeout,
          signal: currentAbortController.signal,
        });

        if (requestId !== currentRequest) {
          return;
        }

        if (!data.completion || data.completion.length === 0) {
          return;
        }

        // Remove the context we already have from the completion
        const suggestion = data.completion.replace(context, '') || '';

        const pos = state.selection.from;
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
          basePos: pos,
        });
        //
        view.dispatch(tr);
        //
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error('Inline completion fetch error:', error);
      }
    };

    return [
      new Plugin({
        key: inlineCompletionPluginKey,
        state: {
          init() {
            return { suggestion: '', decorationSet: DecorationSet.empty, basePos: undefined };
          },
          apply(tr, value, oldState, newState) {
            const meta = tr.getMeta(inlineCompletionPluginKey);
            if (meta && meta.clear) {
              return { suggestion: '', decorationSet: DecorationSet.empty, basePos: undefined };
            }
            if (meta && meta.suggestion !== undefined && meta.decorationSet !== undefined) {
              return {
                suggestion: meta.suggestion,
                decorationSet: meta.decorationSet,
                basePos: meta.basePos,
              };
            }
            return value;
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)?.decorationSet;
          },
          // Updated handleTextInput with fetch abort and debounce delay
          handleTextInput(view, from, to, text) {
            const pluginState = inlineCompletionPluginKey.getState(view.state);
            // Clear any existing suggestion
            if (pluginState && pluginState.suggestion) {
              const trClear = view.state.tr.setMeta(inlineCompletionPluginKey, { clear: true });
              view.dispatch(trClear);
            }

            // Abort any ongoing fetch if user continues typing
            if (currentAbortController) {
              currentAbortController.abort();
              currentAbortController = null;
            }

            // Only trigger new completion fetch on activation triggers
            if (!extOptions.activationTriggers.some(trigger => text.includes(trigger))) {
              return false;
            }

            if (typeof window !== 'undefined' && window.clearTimeout && window.setTimeout) {
              if (debounceTimer) {
                window.clearTimeout(debounceTimer);
              }
              // Start a debounce timer that waits for the user to stop typing
              debounceTimer = window.setTimeout(() => {
                fetchCompletion(view);
              }, extOptions.delay);
            }

            return false;
          },
          handleKeyDown(view, event) {
            const pluginState = inlineCompletionPluginKey.getState(view.state);
            if (pluginState && pluginState.suggestion && pluginState.basePos !== undefined) {
              // Accept next word with cmd/ctrl+ArrowRight
              if (event.key === 'ArrowRight' && (event.metaKey || event.ctrlKey)) {
                const match = pluginState.suggestion.match(/^((\S+\s*)?)/);
                if (!match || match[0] === '') {
                  return false;
                }
                const acceptedWord = match[0];
                const newSuggestion = pluginState.suggestion.slice(acceptedWord.length);
                const basePos = pluginState.basePos;
                const newBasePos = basePos + acceptedWord.length;
                let tr = view.state.tr.insertText(
                  acceptedWord,
                  view.state.selection.from,
                  view.state.selection.to,
                );
                if (newSuggestion) {
                  const deco = Decoration.widget(
                    newBasePos,
                    () => {
                      const span = document.createElement('span');
                      span.className = 'inline-completion-suggestion';
                      span.textContent = newSuggestion;
                      return span;
                    },
                    { side: 1 },
                  );
                  const decorationSet = DecorationSet.create(tr.doc, [deco]);
                  tr = tr.setMeta(inlineCompletionPluginKey, {
                    suggestion: newSuggestion,
                    decorationSet,
                    basePos: newBasePos,
                  });
                } else {
                  tr = tr.setMeta(inlineCompletionPluginKey, {
                    suggestion: '',
                    decorationSet: DecorationSet.empty,
                    basePos: undefined,
                  });
                }
                view.dispatch(tr);
                event.preventDefault();
                return true;
              }

              // Accept full suggestion on Tab
              if (pluginState.suggestion && event.key === 'Tab') {
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
            }

            // NEW: If user presses Enter or Shift+Enter, reset the suggestion without fetching a new completion
            if (event.key === 'Enter' || (event.shiftKey && event.key === 'Enter')) {
              const trClear = view.state.tr.setMeta(inlineCompletionPluginKey, { clear: true });
              view.dispatch(trClear);
              // Do not prevent default to allow newline insertion
              return false;
            }

            return false;
          },
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
