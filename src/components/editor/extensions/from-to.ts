import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fromTo: {
      updatePositions: () => ReturnType;
    };
  }
}

export interface FromToAttributes {
  posStart: number;
  posEnd: number;
}

export interface FromToOptions {
  types: string[];
}

export const FromTo = Extension.create<FromToOptions>({
  name: 'fromTo',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'listItem', 'taskItem'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          posStart: {
            isRequired: false,
            rendered: false,
          },
          posEnd: {
            isRequired: false,
            rendered: false,
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('fromTo');

    return [
      new Plugin({
        key: pluginKey,
        appendTransaction: (transactions, oldState, newState) => {
          // Skip if this transaction was already processed
          if (transactions.some(tr => tr.getMeta(pluginKey))) {
            return null;
          }

          const tr = newState.tr;
          let hasChanges = false;

          newState.doc.descendants((node, pos) => {
            // Skip text nodes
            if (node.type.name === 'text') return;

            if (
              node.attrs.posStart !== pos ||
              node.attrs.posEnd !== pos + node.nodeSize
            ) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                posStart: pos,
                posEnd: pos + node.nodeSize,
              });
              hasChanges = true;
            }
          });

          if (hasChanges) {
            tr.setMeta(pluginKey, true);
            return tr;
          }

          return null;
        },
      }),
    ];
  },

  addCommands() {
    return {
      updatePositions:
        () =>
        ({ state, dispatch }) => {
          if (dispatch) {
            const tr = state.tr;
            state.doc.descendants((node, pos) => {
              // Skip text nodes
              if (node.type.name === 'text') return;

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                posStart: pos,
                posEnd: pos + node.nodeSize,
              });
            });
            dispatch(tr);
          }
          return true;
        },
    };
  },
});
