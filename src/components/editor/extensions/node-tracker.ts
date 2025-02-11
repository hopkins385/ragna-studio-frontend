import { Extension } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { JSONContent } from '@tiptap/vue-3';
import { v4 as uuidv4 } from 'uuid';

export interface NodeAttributes {
  posStart: number;
  posEnd: number;
  id?: string;
}

export interface ExtendedNode extends JSONContent {
  posStart: number;
  posEnd: number;
  id?: string;
}

export interface NodeTrackerOptions {
  types: string[];
  onUpdate?: (json: ExtendedNode) => void;
  generateId?: boolean;
}

const nodeTrackerKey = new PluginKey('nodeTracker');

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nodeTracker: {
      updatePositions: () => ReturnType;
    };
  }
}

export const NodeTracker = Extension.create<NodeTrackerOptions>({
  name: 'nodeTracker',

  addOptions() {
    return {
      types: ['paragraph', 'heading', 'listItem', 'taskItem'],
      onUpdate: undefined,
      generateId: false,
    };
  },

  addGlobalAttributes() {
    const attributes: Record<string, any> = {
      posStart: {
        isRequired: false,
        rendered: false,
      },
      posEnd: {
        isRequired: false,
        rendered: false,
      },
    };

    if (this.options.generateId) {
      attributes.id = {
        isRequired: false,
        rendered: false,
      };
    }

    return [
      {
        types: this.options.types,
        attributes,
      },
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: nodeTrackerKey,
        appendTransaction: (transactions, oldState, newState) => {
          if (transactions.some(tr => tr.getMeta(nodeTrackerKey))) {
            return null;
          }

          const tr = newState.tr;
          let hasChanges = false;

          newState.doc.descendants((node, pos) => {
            if (node.type.name === 'text') return;
            if (!this.options.types.includes(node.type.name)) return;

            const attrs: NodeAttributes = {
              posStart: pos,
              posEnd: pos + node.nodeSize,
            };

            if (
              this.options.generateId &&
              (!node.attrs.id || node.attrs.id === null)
            ) {
              attrs.id = uuidv4();
            }

            if (
              node.attrs.posStart !== attrs.posStart ||
              node.attrs.posEnd !== attrs.posEnd ||
              (this.options.generateId && !node.attrs.id)
            ) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                ...attrs,
              });
              hasChanges = true;
            }
          });

          if (hasChanges) {
            tr.setMeta(nodeTrackerKey, true);

            if (this.options.onUpdate) {
              const json = newState.doc.toJSON();
              const jsonWithMeta = addMetaToJSON(newState.doc, json);
              this.options.onUpdate(jsonWithMeta);
            }

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
              if (node.type.name === 'text') return;
              if (!this.options.types.includes(node.type.name)) return;

              const attrs: NodeAttributes = {
                posStart: pos,
                posEnd: pos + node.nodeSize,
              };

              if (this.options.generateId && !node.attrs.id) {
                attrs.id = uuidv4();
              }

              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                ...attrs,
              });
            });

            if (this.options.onUpdate) {
              const json = state.doc.toJSON();
              const jsonWithMeta = addMetaToJSON(state.doc, json);
              this.options.onUpdate(jsonWithMeta);
            }

            dispatch(tr);
          }
          return true;
        },
    };
  },
});

function addMetaToJSON(doc: Node, json: JSONContent): ExtendedNode {
  let pos = 0;

  function processNode(node: JSONContent): ExtendedNode {
    const start = pos + 1;
    const result = { ...node } as ExtendedNode;
    const docNode = doc.nodeAt(start - 1);

    if (docNode) {
      result.posStart = start - 1;
      result.posEnd = pos + docNode.nodeSize;
      result.id = docNode.attrs.id;
    }

    if (node.content) {
      result.content = node.content.map((child: JSONContent) => {
        pos++;
        return processNode(child);
      });
    }

    pos += (docNode?.nodeSize || 0) - 1;
    return result;
  }

  return processNode(json);
}
