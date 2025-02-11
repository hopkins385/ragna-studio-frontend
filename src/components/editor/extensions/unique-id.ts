import { Extension, findChildren } from '@tiptap/core';
import { v4 as uuidv4 } from 'uuid';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    uniqueId: {
      updateIds: () => ReturnType;
    };
  }
}

export interface UniqueIdOptions {
  // The attribute name that will store the ID
  attributeName: string;
  // Node types that should receive unique IDs
  types: string[];
  // Custom ID generator function
  generateId: () => string;
}

export const UniqueId = Extension.create<UniqueIdOptions>({
  name: 'uniqueId',
  priority: 10000,

  addOptions() {
    return {
      attributeName: 'id',
      types: [],
      generateId: () => uuidv4(),
    };
  },

  /*addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          [this.options.attributeName]: {
            default: null,
            parseHTML: element =>
              element.getAttribute(`data-${this.options.attributeName}`),
            renderHTML: attributes => {
              if (!attributes[this.options.attributeName]) {
                return {};
              }

              return {
                [`data-${this.options.attributeName}`]:
                  attributes[this.options.attributeName],
              };
            },
          },
        },
      },
    ];
  },*/

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          [this.options.attributeName]: {
            default: null,
            parseHTML: element =>
              element.getAttribute(`data-${this.options.attributeName}`),
            renderHTML: attributes => {
              if (!attributes[this.options.attributeName]) {
                return {};
              }

              return {
                [`data-${this.options.attributeName}`]:
                  attributes[this.options.attributeName],
              };
            },
          },
        },
      },
    ];
  },

  onCreate() {
    // Skip if collaboration extension is enabled
    if (
      this.editor.extensionManager.extensions.find(
        extension => extension.name === 'collaboration',
      )
    ) {
      return;
    }

    // Initial update of IDs
    this.editor.view.dispatch(this.editor.state.tr.setMeta('uniqueId', true));
  },

  onTransaction({ transaction, editor }) {
    // Skip if collaboration extension is enabled
    if (
      this.editor.extensionManager.extensions.find(
        extension => extension.name === 'collaboration',
      )
    ) {
      return;
    }

    // Skip if this transaction was triggered by our extension
    if (transaction.getMeta('uniqueId')) {
      const { state } = editor;
      const { types, attributeName, generateId } = this.options;

      // Find nodes without IDs
      const tr = state.tr;
      findChildren(
        state.doc,
        node =>
          types.includes(node.type.name) && node.attrs[attributeName] === null,
      ).forEach(({ node, pos }) => {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          [attributeName]: generateId(),
        });
      });

      // Only dispatch if we have changes
      if (tr.steps.length > 0) {
        tr.setMeta('uniqueId', true);
        tr.setMeta('addToHistory', false);
        editor.view.dispatch(tr);
      }
      return;
    }

    // Only trigger on content changes
    if (transaction.docChanged) {
      // Create a new transaction for the next tick
      setTimeout(() => {
        editor.view.dispatch(editor.state.tr.setMeta('uniqueId', true));
      }, 0);
    }
  },

  addCommands() {
    return {
      updateIds:
        () =>
        ({ tr }) => {
          tr.setMeta('uniqueId', true);
          return true;
        },
    };
  },
});
