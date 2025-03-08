import { Extension } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { JSONContent } from '@tiptap/vue-3';
import { v4 as uuidv4 } from 'uuid';

export interface NodeAttributes {
  posStart: number;
  posEnd: number;
  id: string; // Make id required
}

export interface ExtendedNode extends JSONContent {
  posStart: number;
  posEnd: number;
  id: string; // Make id required
}

export interface NodeTrackerOptions {
  types: string[];
  generateId: boolean; // Make generateId required
}

interface PositionState {
  positions: Map<string, { pos: number; end: number }>;
}

const nodeTrackerKey = new PluginKey<PositionState>('nodeTracker');

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
      generateId: true, // Default to true since we want ids by default
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          posStart: {
            default: null,
            rendered: false,
          },
          posEnd: {
            default: null,
            rendered: false,
          },
          id: {
            default: null,
            rendered: false,
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    const updateNodePositions = (
      doc: Node,
      positions: Map<string, { pos: number; end: number }>,
    ) => {
      positions.clear();
      doc.nodesBetween(0, doc.content.size, (node, pos) => {
        if (!node.isText && node.attrs.id) {
          positions.set(node.attrs.id, {
            pos,
            end: pos + node.nodeSize,
          });
        }
        return true;
      });
    };

    return [
      new Plugin<PositionState>({
        key: nodeTrackerKey,
        state: {
          init(_, state) {
            const positions = new Map();
            updateNodePositions(state.doc, positions);
            return { positions };
          },
          apply(tr, value) {
            if (!tr.docChanged) return value;

            const newPositions = new Map(value.positions);
            updateNodePositions(tr.doc, newPositions);
            return { positions: newPositions };
          },
        },
        appendTransaction: (transactions, oldState, newState) => {
          // Skip if this is our own transaction
          if (transactions.some(tr => tr.getMeta(nodeTrackerKey))) {
            return null;
          }
          
          // Check the transactions for special character inputs followed by Enter
          // We'll use this to detect potentially problematic sequences like backtick + Enter
          const lastTransactionText = transactions.length > 0 
            ? transactions[transactions.length - 1].doc.textBetween(0, transactions[transactions.length - 1].doc.content.size)
            : '';
          
          // If the last character was a backtick or other special character that might cause issues
          const hasSpecialCharacter = lastTransactionText.match(/[`]$/);
          
          // If we detected a special character at the end of the text, delay node tracking
          // This allows Enter key presses to work correctly after these characters
          if (hasSpecialCharacter) {
            return null;
          }
          
          // Don't interfere with any transactions that might be related to Enter keypresses
          // by checking for selection changes and node count differences
          const hasSelectionJump = oldState.selection.from !== newState.selection.from;
          const hasNodeCountChanged = oldState.doc.childCount !== newState.doc.childCount;
          
          // If either of these conditions is true, it might be an Enter key or similar action
          if (hasSelectionJump || hasNodeCountChanged) {
            // Delay node tracking to prevent interference with the Enter key
            return null;
          }

          const pluginState = nodeTrackerKey.getState(newState);
          if (!pluginState) return null;

          // Add a small delay for tracking when we detect potential Enter operation
          // This helps ensure we don't interfere with the default key handling
          const tr = newState.tr;
          let changed = false;

          // Process the document to update node positions
          newState.doc.nodesBetween(
            0,
            newState.doc.content.size,
            (node, pos) => {
              if (!this.options.types.includes(node.type.name)) {
                return true;
              }

              const id = node.attrs.id || uuidv4();
              const nodeEnd = pos + node.nodeSize;
              const storedPosition = pluginState.positions.get(id);

              const needsUpdate =
                !storedPosition ||
                storedPosition.pos !== pos ||
                storedPosition.end !== nodeEnd ||
                node.attrs.posStart !== pos ||
                node.attrs.posEnd !== nodeEnd ||
                node.attrs.id !== id;

              if (needsUpdate) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  posStart: pos,
                  posEnd: nodeEnd,
                  id,
                });
                changed = true;
              }

              return true;
            },
          );

          if (changed) {
            tr.setMeta(nodeTrackerKey, true);
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
          if (!dispatch) return true;

          const tr = state.tr;
          let changed = false;

          state.doc.nodesBetween(0, state.doc.content.size, (node, pos) => {
            if (!this.options.types.includes(node.type.name)) {
              return true;
            }

            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              posStart: pos,
              posEnd: pos + node.nodeSize,
              id: node.attrs.id || uuidv4(),
            });
            changed = true;
            return true;
          });

          if (changed) {
            dispatch(tr);
          }
          return true;
        },
    };
  },

  addMethods() {
    return {
      addMetadataToJson(
        doc: Node,
        json: JSONContent,
        positions: Map<string, { pos: number; end: number }>,
      ): ExtendedNode {
        const processNode = (
          node: JSONContent,
          docNode: Node | null,
        ): ExtendedNode => {
          const result = { ...node } as ExtendedNode;

          if (docNode && docNode.attrs.id) {
            const pos = positions.get(docNode.attrs.id);
            if (pos) {
              result.posStart = pos.pos;
              result.posEnd = pos.end;
              result.id = docNode.attrs.id;
            }
          }

          if (node.content && docNode) {
            result.content = node.content.map((child, index) => {
              return processNode(child, docNode.maybeChild(index));
            });
          }

          return result;
        };

        return processNode(json, doc);
      },
    };
  },
});
