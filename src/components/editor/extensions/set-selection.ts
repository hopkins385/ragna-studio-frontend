import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { Extension } from '@tiptap/vue-3';

export const setSelectionPluginKey = new PluginKey('set-selection-extension');

interface SetSelectionPayload {
  from: number;
  to: number;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    setSelection: {
      setSelection: (payload: SetSelectionPayload) => ReturnType;
    };
  }
}

export const SetSelection = Extension.create({
  name: 'setSelection',
  addOptions() {
    return {};
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: setSelectionPluginKey,
      }),
    ];
  },
  addCommands() {
    return {
      setSelection:
        ({ from, to }: SetSelectionPayload) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            const selection = TextSelection.create(tr.doc, from, to);
            tr.setSelection(selection);
          }
          return true;
        },
    };
  },
});
