import { Extension } from '@tiptap/core';
import { useDebounceFn } from '@vueuse/core';
import { Slice } from 'prosemirror-model';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { ReplaceStep } from 'prosemirror-transform';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import {
  getCurrentLineText,
  getCurrentWord,
  getParagraphIndex,
  getPrecedingText,
  getPrecedingWords,
  getSentenceIndex,
  getWordIndex,
} from './utils/helpers';

// Interface for the external API response
export interface InlineCompletionResponse {
  completion: string;
}

interface TextContext {
  precedingText: string; // More than just current line (previous 3-5 paragraphs)
  followingText?: string; // Text after cursor position (next paragraph)
  currentLineText: string; // The immediate line text for local context
  currentWord: string; // The word being typed
  precedingWords: string[]; // Previous 5-10 words for immediate context
}

interface DocumentContext {
  documentType: string; // Article, code, email, etc.
  language?: string; // Programming language or natural language
  headings?: string[]; // Document section headings
  currentSectionTitle?: string; // Current section user is editing
  documentSummary?: string; // Brief semantic summary of the document
}

interface EditorContext {
  cursorPosition: number; // Absolute position in document
  relativePosition: {
    // Position relative to structures
    paragraphIndex: number;
    sentenceIndex: number;
    wordIndex: number;
  };
  recentEdits: Array<{
    // Recent edit history
    timestamp: number;
    text: string;
    position: number;
    operation: 'insert' | 'delete' | 'replace';
  }>;
  acceptedCompletions?: string[]; // Previously accepted suggestions
}

export interface CompletionRequestContext {
  textContext: TextContext;
  documentContext?: DocumentContext;
  editorContext: EditorContext;
  timeout: number;
  maxTokens?: number; // Control response length
  temperature?: number; // Control randomness
}

// Options for the inline completion extension
export interface InlineCompletionOptions {
  delay: number; // Debounce delay in milliseconds
  activationTriggers: string[]; // Characters triggering the fetch
  timeout: number; // Timeout for fetch in milliseconds
  completionHandler: (params: {
    context: CompletionRequestContext;
    timeout: number;
    signal: AbortSignal;
  }) => Promise<InlineCompletionResponse>;
  suggestionClass?: string;
  renderSuggestion?: (suggestion: string) => HTMLElement;
}

// Default options
const defaultOptions: InlineCompletionOptions = {
  delay: 500,
  activationTriggers: [' '],
  timeout: 5000,
  completionHandler: async () => {
    throw new Error('No completionHandler provided');
  },
  suggestionClass: 'inline-completion-suggestion',
};

// Interface for tracking edit history
export interface EditHistoryEntry {
  timestamp: number;
  text: string;
  position: number;
  operation: 'insert' | 'delete' | 'replace';
}

export const inlineCompletionPluginKey = new PluginKey('inlineCompletion');
// Key for storing edit history
export const editHistoryPluginKey = new PluginKey('editHistory');

export const InlineCompletionExtension = Extension.create<InlineCompletionOptions>({
  name: 'inlineCompletion',

  addOptions() {
    return { ...defaultOptions };
  },

  addStorage() {
    return {
      recentEdits: [] as EditHistoryEntry[],
    };
  },

  addProseMirrorPlugins() {
    const { options } = this; // Use destructuring instead of aliasing this
    let currentRequest = 0;
    let currentAbortController: AbortController | null = null;

    // Maximum number of edit history entries to keep
    const MAX_HISTORY_ENTRIES = 50;

    // Track edit history - use arrow function to preserve this context
    const trackEditHistory = (tr: Transaction) => {
      if (!tr.docChanged) return;

      // Skip tracking meta transactions (like clearing suggestions)
      if (tr.getMeta(inlineCompletionPluginKey)) return;

      const now = Date.now();
      const editEntry: EditHistoryEntry = {
        timestamp: now,
        text: '',
        position: 0,
        operation: 'insert',
      };

      // Determine operation type and extract details
      if (tr.steps.length > 0) {
        tr.steps.forEach(step => {
          // Type guard for ReplaceStep which has slice property
          if (step instanceof ReplaceStep) {
            const { from, to, slice } = step as ReplaceStep & { slice: Slice };
            // Replace operation
            if (from !== to && slice.content.size > 0) {
              editEntry.operation = 'replace';
              editEntry.position = from;
              editEntry.text = slice.content.textBetween(0, slice.content.size, ' ');
            }
            // Insert operation
            else if (from === to && slice.content.size > 0) {
              editEntry.operation = 'insert';
              editEntry.position = from;
              editEntry.text = slice.content.textBetween(0, slice.content.size, ' ');
            }
            // Delete operation
            else if (from !== to && slice.content.size === 0) {
              editEntry.operation = 'delete';
              editEntry.position = from;
              editEntry.text = '';
            }
          }
        });

        // Only track meaningful edits
        if (
          editEntry.operation === 'insert' ||
          editEntry.operation === 'replace' ||
          editEntry.operation === 'delete'
        ) {
          const recentEdits = [...this.storage.recentEdits];
          recentEdits.push(editEntry);

          // Keep only the latest MAX_HISTORY_ENTRIES
          if (recentEdits.length > MAX_HISTORY_ENTRIES) {
            recentEdits.shift();
          }

          this.storage.recentEdits = recentEdits;
        }
      }
    };

    // Helper function to fetch completion - use arrow function to preserve this context
    const fetchCompletion = async (view: EditorView) => {
      if (currentAbortController) {
        currentAbortController.abort();
      }
      currentAbortController = new AbortController();

      const { state } = view;
      const $from = state.selection.$from;

      // Build comprehensive context
      const requestContext: CompletionRequestContext = {
        textContext: {
          // Get more preceding text (not just current line)
          precedingText: getPrecedingText(state, $from, 500), // Get 500 chars before cursor
          currentLineText: getCurrentLineText(state, $from),
          currentWord: getCurrentWord(state, $from),
          precedingWords: getPrecedingWords(state, $from, 10),
        },
        editorContext: {
          cursorPosition: $from.pos,
          relativePosition: {
            paragraphIndex: getParagraphIndex(state, $from),
            sentenceIndex: getSentenceIndex(state, $from),
            wordIndex: getWordIndex(state, $from),
          },
          recentEdits: this.storage.recentEdits || [],
        },
        timeout: options.timeout,
      };

      const requestId = ++currentRequest;

      try {
        if (!options.completionHandler) {
          throw new Error('No completionHandler provided');
        }
        const data: InlineCompletionResponse = await options.completionHandler({
          context: requestContext,
          timeout: options.timeout,
          signal: currentAbortController.signal,
        });

        if (requestId !== currentRequest) {
          return;
        }

        if (!data.completion || data.completion.length === 0) {
          return;
        }

        // Trim whitespace
        const suggestion = data.completion.trim();

        const pos = state.selection.from;
        const deco = Decoration.widget(
          pos,
          () => {
            const span = document.createElement('span');
            span.className = 'inline-completion-suggestion';
            span.textContent = suggestion;
            span.setAttribute('role', 'status');
            span.setAttribute('aria-live', 'polite');
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

    const debouncedFetchCompletion = useDebounceFn(async (view: EditorView) => {
      await fetchCompletion(view);
    }, options.delay);

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
            if (!options.activationTriggers.some(trigger => text.includes(trigger))) {
              return false;
            }

            debouncedFetchCompletion(view);

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
        appendTransaction: (transactions, oldState, newState) => {
          // Use a function that doesn't capture this to avoid the need for binding
          // Track edit history for each transaction
          transactions.forEach(tr => trackEditHistory.call(this, tr));

          // Original logic for suggestion clearing
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
