import type { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { EditorView } from '@tiptap/pm/view';
import type { JSONContent } from '@tiptap/vue-3';

export interface JSONExtendedOptions {
  onUpdate: (json: JSONContent) => void;
}

type PositionNode = JSONContent & {
  from?: number;
  to?: number;
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    JSONExtended: {
      updatePositions: () => ReturnType;
    };
  }
}

export const JSONExtended = Extension.create<JSONExtendedOptions>({
  name: 'JSONExtended',

  addOptions() {
    return {
      onUpdate: () => {},
    };
  },

  addCommands() {
    return {
      updatePositions:
        () =>
        ({ editor }) => {
          const json = editor.getJSON();
          const jsonWithPositions = calculatePositions(json, editor.view);
          this.options.onUpdate(jsonWithPositions);
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('JSONExtended'),
        view: () => ({
          update: view => {
            const json = view.state.doc.toJSON();
            const jsonWithPositions = calculatePositions(json, view);
            this.options.onUpdate(jsonWithPositions);
          },
        }),
      }),
    ];
  },
});

// Helper function moved outside the extension
function calculatePositions(
  node: PositionNode,
  view: EditorView,
  pos = 0,
): PositionNode {
  node.from = pos;

  let currentPos = pos + 1;

  if (node.text) {
    node.to = currentPos + node.text.length;
    currentPos += node.text.length;
  }

  if (node.content) {
    node.content = node.content.map((child: PositionNode) => {
      const augmentedChild = calculatePositions(child, view, currentPos);
      currentPos += view.state.doc.nodeAt(augmentedChild.from!)?.nodeSize || 0;
      return augmentedChild;
    });
    node.to = currentPos;
  }

  return node;
}

/*function calculatePositions(
  node: PositionNode,
  view: EditorView,
  pos = 0,
): PositionNode {
  node.from = pos;

  // Get the ProseMirror node at the current position
  const pmNode = view.state.doc.nodeAt(pos);
  const nodeSize = pmNode?.nodeSize ?? 0;

  let currentPos = pos;

  if (node.text) {
    // For text nodes, we want the actual text length
    node.to = currentPos + node.text.length;
    currentPos += node.text.length;
  }

  if (node.content) {
    // For nodes with content, process each child
    currentPos += 1; // Account for the opening tag
    node.content = node.content.map((child: PositionNode) => {
      const augmentedChild = calculatePositions(child, view, currentPos);
      // Move position by the size of the processed node
      const childNode = view.state.doc.nodeAt(currentPos);
      currentPos += childNode?.nodeSize ?? 0;
      return augmentedChild;
    });
    node.to = currentPos;
  } else {
    // For leaf nodes without content
    node.to = currentPos + nodeSize;
  }

  return node;
}*/
