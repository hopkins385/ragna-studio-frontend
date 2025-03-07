import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

// Helper function to sanitize attribute values
function sanitizeAttributeValue(value: string | undefined): string {
  if (!value) return '';
  // Remove any characters that could be problematic in HTML attributes
  return String(value).replace(/[&<>"']/g, char => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

export interface Comment {
  id: string;
  text: string;
  from: number;
  to: number;
  reference?: string; // Optional reference to identify the comment for external components
}

interface CommentsStorage {
  comments: Comment[];
}

interface CommentsOptions {
  onCommentClick?: (commentId: string, reference?: string) => void;
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

const CommentsExtension = Extension.create<CommentsOptions>({
  name: 'comments',

  addOptions() {
    return {
      onCommentClick: undefined,
    };
  },

  addStorage() {
    return {
      comments: [] as Comment[],
    } as CommentsStorage;
  },

  onDestroy() {
    // Clear comments when editor is destroyed
    this.storage.comments = [];
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
    const { onCommentClick } = this.options;

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
              Decoration.inline(comment.from, comment.to, {
                class: 'comment-highlighted',
                'data-comment-id': sanitizeAttributeValue(comment.id),
                'data-comment-reference': sanitizeAttributeValue(comment.reference),
              }),
            );
            return DecorationSet.create(tr.doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
          handleClick(view, pos, event) {
            if (!onCommentClick) {
              return false;
            }

            const target = event.target as HTMLElement;
            const commentHighlight = target.closest('.comment-highlighted');

            if (commentHighlight) {
              // No need to sanitize here - getAttribute returns the raw string value
              // The browser doesn't parse this as HTML, so there's no XSS risk
              const commentId = commentHighlight.getAttribute('data-comment-id');
              const reference =
                commentHighlight.getAttribute('data-comment-reference') || undefined;

              if (commentId) {
                onCommentClick(commentId, reference);
                return true;
              }
            }

            return false;
          },
        },
      }),
    ];
  },
});

export default CommentsExtension;
export { CommentsExtension };
