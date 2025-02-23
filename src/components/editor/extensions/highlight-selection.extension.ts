import { Extension } from '@tiptap/core';
import { EditorState, Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

export interface HighlightSelectionOptions {
  highlightClass?: string;
}

export const HighlightSelection = Extension.create<HighlightSelectionOptions>({
  name: 'highlightSelection',

  addOptions() {
    return {
      highlightClass: 'highlight-selection',
    };
  },

  addProseMirrorPlugins() {
    const { highlightClass } = this.options;

    return [
      new Plugin({
        key: new PluginKey('highlight-selection'),
        props: {
          decorations(state: EditorState) {
            const { selection } = state;
            const decorations: Decoration[] = [];

            if (!selection.empty) {
              decorations.push(
                Decoration.inline(selection.from, selection.to, {
                  class: highlightClass,
                }),
              );
            }

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
