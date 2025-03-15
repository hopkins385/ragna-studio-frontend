import { Editor, Extension } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import type { JSONContent } from '@tiptap/vue-3';
import { v4 as uuidv4 } from 'uuid';

export interface NodeAttributes {
  posStart: number;
  posEnd: number;
  id: string; // Make id required
  lineNumber: number; // Add line number tracking
}

export interface ExtendedNode extends JSONContent {
  posStart: number;
  posEnd: number;
  id: string; // Make id required
  lineNumber: number; // Add line number tracking
}

export interface NodeTrackerOptions {
  types: string[];
  generateId: boolean; // Make generateId required
}

interface PositionState {
  positions: Map<string, { pos: number; end: number; lineNumber: number }>;
}

// Fixed line number calculation that doesn't use findIndex
const getLineNumber = (doc: Node, pos: number): number => {
  // Start at position 0 and count up until we reach our position
  let currentPos = 0;
  let lineCount = 1; // First block is line 1

  // Loop through all top-level blocks in order
  for (let i = 0; i < doc.content.childCount; i++) {
    const node = doc.content.child(i);

    // If our target position is within this node, we've found our line
    if (pos >= currentPos && pos < currentPos + node.nodeSize) {
      return lineCount;
    }

    // Move to next block and increment line counter
    currentPos += node.nodeSize;
    lineCount++;
  }

  // Fallback (should rarely happen)
  return Math.max(1, lineCount - 1);
};

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
      generateId: true,
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
          lineNumber: {
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
      positions: Map<string, { pos: number; end: number; lineNumber: number }>,
    ) => {
      positions.clear();
      doc.nodesBetween(0, doc.content.size, (node, pos) => {
        if (!node.isText && node.attrs.id) {
          positions.set(node.attrs.id, {
            pos,
            end: pos + node.nodeSize,
            lineNumber: getLineNumber(doc, pos),
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

          // Restore special character detection to prevent interfering with Enter key
          const lastTransactionText =
            transactions.length > 0
              ? transactions[transactions.length - 1].doc.textBetween(
                  0,
                  transactions[transactions.length - 1].doc.content.size,
                )
              : '';

          // If the last character was a backtick or other special character, avoid immediate tracking
          const hasSpecialCharacter = lastTransactionText.match(/[`]$/);

          // Check for conditions that suggest an Enter key press
          const hasSelectionJump = oldState.selection.from !== newState.selection.from;
          const hasNodeCountChanged = oldState.doc.childCount !== newState.doc.childCount;

          // If we detect a special character or potential Enter key, don't interfere
          // This preserves the original behavior for Enter key after backtick
          if (hasSpecialCharacter || (hasSelectionJump && hasNodeCountChanged)) {
            return null;
          }

          const pluginState = nodeTrackerKey.getState(newState);
          if (!pluginState) return null;

          const tr = newState.tr;
          let changed = false;

          // Process the document to update node positions
          newState.doc.nodesBetween(0, newState.doc.content.size, (node, pos) => {
            if (!this.options.types.includes(node.type.name)) {
              return true;
            }

            // ALWAYS generate new ID for each node to prevent duplicates
            const id = uuidv4(); // Ensure unique ID for each node
            const nodeEnd = pos + node.nodeSize;
            const lineNumber = getLineNumber(newState.doc, pos);

            // Always update line numbers and positions
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              posStart: pos,
              posEnd: nodeEnd,
              lineNumber,
              id,
            });
            changed = true;

            return true;
          });

          if (changed) {
            tr.setMeta(nodeTrackerKey, true);
            return tr;
          }

          return null;
        },
      }),

      // Add a second plugin that ONLY updates line numbers after document changes
      // This ensures line numbers get updated even when we avoid interfering with Enter key
      new Plugin({
        view(view) {
          return {
            update(view, prevState) {
              // If document structure changed (likely after Enter key)
              if (prevState.doc.childCount !== view.state.doc.childCount) {
                // Wait briefly to allow the Enter key handling to complete
                setTimeout(() => {
                  // Then run the update command
                  view.dispatch(view.state.tr.setMeta('updateLineNumbers', true));
                }, 0);
              }
            },
          };
        },

        appendTransaction(transactions, oldState, newState) {
          // Only run when triggered by our delayed update
          if (!transactions.some(tr => tr.getMeta('updateLineNumbers'))) {
            return null;
          }

          const tr = newState.tr;
          let changed = false;

          // Update line numbers for all nodes
          newState.doc.nodesBetween(0, newState.doc.content.size, (node, pos) => {
            if (!this.options?.types.includes(node.type.name)) {
              return true;
            }

            const lineNumber = getLineNumber(newState.doc, pos);

            // Ensure line number is updated
            if (node.attrs.lineNumber !== lineNumber) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                lineNumber,
              });
              changed = true;
            }

            return true;
          });

          if (changed) {
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

            // Generate unique ID for each node
            const id = uuidv4();
            const lineNumber = getLineNumber(state.doc, pos);
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              posStart: pos,
              posEnd: pos + node.nodeSize,
              lineNumber,
              id,
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
        positions: Map<string, { pos: number; end: number; lineNumber: number }>,
      ): ExtendedNode {
        const processNode = (node: JSONContent, docNode: Node | null): ExtendedNode => {
          const result = { ...node } as ExtendedNode;

          if (docNode && docNode.attrs.id) {
            const pos = positions.get(docNode.attrs.id);
            if (pos) {
              result.posStart = pos.pos;
              result.posEnd = pos.end;
              result.lineNumber = pos.lineNumber;
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

      forceUpdateLineNumbers(editor: Editor) {
        editor.commands.updatePositions();
      },
    };
  },
});
