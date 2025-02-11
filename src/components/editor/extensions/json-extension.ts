import type { Editor } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import type { Node } from '@tiptap/pm/model';
import { Plugin, PluginKey } from '@tiptap/pm/state';
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
          const jsonWithPositions = addPositionsToJSON(
            editor.view.state.doc,
            json,
          );
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
            const jsonWithPositions = addPositionsToJSON(
              view.state.tr.doc,
              json,
            );
            this.options.onUpdate(jsonWithPositions);
          },
        }),
      }),
    ];
  },
});

function addPositionsToJSON(doc: Node, json: JSONContent): PositionNode {
  let pos = 0;

  function processNode(node: JSONContent): PositionNode {
    const start = pos + 1;
    const result: PositionNode = { ...node };

    if (node.content) {
      result.content = node.content.map((child: JSONContent) => {
        pos++;
        return processNode(child);
      });
    }

    const size = doc.nodeAt(start - 1)?.nodeSize || 0;
    pos += size - 1;

    result.from = start - 1;
    result.to = pos;

    return result;
  }

  return processNode(json);
}
