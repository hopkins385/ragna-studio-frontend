import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

export interface Comment {
  id: string;
  text: string;
  from: number;
  to: number;
}

interface CommentsStorage {
  comments: Comment[];
}
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comments: {
      setOneComment: (comment: Comment) => ReturnType;
      removeOneComment: (id: string) => ReturnType;
      initAllComments: (comments: Comment[]) => ReturnType;
    };
  }
}

const CommentsExtension = Extension.create({
  name: 'comments',

  addStorage() {
    return {
      comments: [] as Comment[],
    } as CommentsStorage;
  },

  addCommands() {
    return {
      setOneComment:
        (comment: Comment) =>
        ({ editor, tr }) => {
          this.storage.comments.push(comment);
          tr.setMeta('comments', true);
          return true;
        },
      removeOneComment:
        (id: string) =>
        ({ editor, tr }) => {
          this.storage.comments = this.storage.comments.filter(
            (comment: Comment) => comment.id !== id,
          );
          tr.setMeta('comments', true);
          return true;
        },
      initAllComments:
        (comments: Comment[]) =>
        ({ editor, tr }) => {
          this.storage.comments = comments;
          tr.setMeta('comments', true);
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('comments'),
        state: {
          init: (_, { doc }) => {
            return DecorationSet.create(doc, []);
          },
          apply: (tr, old) => {
            const action = tr.getMeta('comments');
            if (!action) return old;

            const { comments } = this.storage;
            console.log('comments', comments);
            const decorations = comments.map((comment: Comment) =>
              Decoration.inline(comment.from, comment.to, { class: 'comment-highlighted' }),
            );
            return DecorationSet.create(tr.doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

export default CommentsExtension;
export { CommentsExtension };
