import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    invisibleCharacters: {
      showInvisibleCharacters: {
        (visible?: boolean): ReturnType;
      };
      hideInvisibleCharacters: {
        (): ReturnType;
      };
      toggleInvisibleCharacters: {
        (): ReturnType;
      };
    };
  }
}

class InvisibleNode {
  predicate: (node: any) => boolean;
  type: string;
  position: (node: any, pos: number) => number;
  content?: string;
  priority: number;

  constructor(options: {
    predicate: (node: any) => boolean;
    type: string;
    position?: (node: any, pos: number) => number;
    content?: string;
    priority?: number;
  }) {
    this.predicate = options.predicate;
    this.type = options.type;
    this.position =
      options.position || ((node, pos) => pos + node.nodeSize - 1);
    this.content = options.content;
    this.priority = options.priority || 100;
  }

  createDecoration(
    from: number,
    to: number,
    doc: any,
    decorations: DecorationSet,
  ) {
    let decos = decorations;
    doc.nodesBetween(from, to, (node: any, pos: number) => {
      if (this.test(node)) {
        const position = this.position(node, pos);
        const existing = decos.find(
          position,
          position,
          d => d.key === this.type,
        );
        decos = decos
          .remove(existing)
          .add(doc, [
            createInvisibleCharacter(position, this.type, this.content),
          ]);
      }
    });
    return decos;
  }

  test(node: any) {
    return this.predicate(node);
  }
}

class HardBreakNode extends InvisibleNode {
  constructor() {
    super({
      type: 'break',
      predicate: node => node.type === node.type.schema.nodes.hardBreak,
    });
  }
}

class ParagraphNode extends InvisibleNode {
  constructor() {
    super({
      type: 'paragraph',
      predicate: node => node.type === node.type.schema.nodes.paragraph,
    });
  }
}

class SpaceCharacter extends InvisibleNode {
  constructor() {
    super({
      type: 'space',
      predicate: node => node.text === ' ',
    });
  }
}

// Plugin key for managing state
const invisibleCharactersKey = new PluginKey('customInvisibleCharacters');

// Create widget decoration for invisible characters
const createInvisibleCharacter = (
  pos: number,
  type: string,
  content?: string,
) => {
  return Decoration.widget(
    pos,
    () => {
      const span = document.createElement('span');
      span.classList.add('tiptap-invisible-character');
      span.classList.add(`tiptap-invisible-character--${type}`);
      if (content) {
        span.textContent = content;
      }
      return span;
    },
    {
      key: type,
      side: 1000,
    },
  );
};

// Custom styles for invisible characters
const invisibleCharacterStyles = `
.tiptap-invisible-character {
  height: 0;
  padding: 0;
  pointer-events: none;
  user-select: none;
  width: 0;
}

.tiptap-invisible-character::before {
  caret-color: inherit;
  color: #aaa;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1em;
  width: 0;
}

.tiptap-invisible-character--space::before {
  content: '·'
}

.tiptap-invisible-character--break::before {
  content: '¬'
}

.tiptap-invisible-character--paragraph::before {
  content: '¶'
}

.tiptap-invisible-character + img.ProseMirror-separator {
  height: 0 !important;
  pointer-events: none;
  user-select: none;
  width: 0 !important;
}

.is-empty[data-placeholder].has-focus > .tiptap-invisible-character {
  display: none;
}
`;

export const InvisibleCharacters = Extension.create({
  name: 'invisibleCharacters',

  addOptions() {
    return {
      visible: false,
      builders: [
        new SpaceCharacter(),
        new ParagraphNode(),
        new HardBreakNode(),
      ],
      injectCSS: true,
      injectNonce: undefined,
    };
  },

  addStorage() {
    return {
      visibility: () => this.options.visible,
    };
  },

  onBeforeCreate() {
    this.storage.visibility = () => {
      const state = invisibleCharactersKey.getState(this.editor.state);
      return state?.visible;
    };
  },

  addCommands() {
    return {
      showInvisibleCharacters:
        (visible = true) =>
        ({ dispatch, tr }) => {
          if (dispatch) {
            tr.setMeta('setInvisibleCharactersVisible', visible);
            dispatch(tr);
          }
          return true;
        },
      hideInvisibleCharacters:
        () =>
        ({ dispatch, tr }) => {
          if (dispatch) {
            tr.setMeta('setInvisibleCharactersVisible', false);
            dispatch(tr);
          }
          return true;
        },
      toggleInvisibleCharacters:
        () =>
        ({ dispatch, tr, state }) => {
          const currentState = invisibleCharactersKey.getState(state);
          const newVisible = !currentState?.visible;

          if (dispatch) {
            tr.setMeta('setInvisibleCharactersVisible', newVisible);
            dispatch(tr);
          }
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const createDecorations = (
      from: number,
      to: number,
      doc: any,
      decorations: DecorationSet,
    ) => {
      return this.options.builders
        .sort((a, b) => (a.priority > b.priority ? 1 : -1))
        .reduce(
          (decos, builder) => builder.createDecoration(from, to, doc, decos),
          decorations,
        );
    };

    return [
      new Plugin({
        key: invisibleCharactersKey,
        state: {
          init: () => {
            // Inject CSS if needed
            if (this.options.injectCSS && typeof document !== 'undefined') {
              const styleEl = document.querySelector(
                'style[data-tiptap-extension-invisible-characters-style]',
              );
              if (!styleEl) {
                const style = document.createElement('style');
                if (this.options.injectNonce) {
                  style.setAttribute('nonce', this.options.injectNonce);
                }
                style.setAttribute(
                  'data-tiptap-extension-invisible-characters-style',
                  '',
                );
                style.textContent = invisibleCharacterStyles;
                document.head.appendChild(style);
              }
            }

            return {
              visible: this.options.visible,
              decorations: DecorationSet.empty,
            };
          },
          apply: (tr, value) => {
            const newVisible = tr.getMeta('setInvisibleCharactersVisible');
            if (newVisible !== undefined) {
              return {
                ...value,
                visible: newVisible,
              };
            }
            return value;
          },
        },
        props: {
          decorations(state) {
            const pluginState = this.getState(state);
            if (!pluginState?.visible) {
              return DecorationSet.empty;
            }

            // Changed: Use full document range instead of selection
            return createDecorations(
              0, // start of document
              state.doc.content.size, // end of document
              state.doc,
              DecorationSet.empty,
            );
          },
        },
      }),
    ];
  },
});
