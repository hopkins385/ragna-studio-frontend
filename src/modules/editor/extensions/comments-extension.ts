import { sanitizeAttributeValue } from '@/common/sanitize/sanitize-attribute.helper';
import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

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
  onCommentAdd?: (comment: Comment) => void;
  onCommentRemove?: (commentId: string) => void;
  onCommentUpdate?: (comment: Comment) => void;
  onCommentsUpdates?: (comments: Comment[]) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comments: {
      addOneComment: (comment: Comment) => ReturnType;
      removeOneComment: (id: string) => ReturnType;
      initAllComments: (comments: Comment[]) => ReturnType;
    };
  }
}

const commentsExtensionName = 'comments';

const CommentsExtension = Extension.create<CommentsOptions>({
  name: commentsExtensionName,

  addOptions() {
    return {
      onCommentClick: undefined,
      onCommentAdd: undefined,
      onCommentRemove: undefined,
      onCommentUpdate: undefined,
      onCommentsUpdates: undefined,
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
      addOneComment:
        (comment: Comment) =>
        ({ editor, tr }) => {
          this.storage.comments.push(comment);
          tr.setMeta(commentsExtensionName, true);

          // Call the onCommentAdd handler if defined
          if (this.options.onCommentAdd) {
            this.options.onCommentAdd(comment);
          }

          return true;
        },
      removeOneComment:
        (id: string) =>
        ({ editor, tr }) => {
          this.storage.comments = this.storage.comments.filter(
            (comment: Comment) => comment.id !== id,
          );
          tr.setMeta(commentsExtensionName, true);

          // Call the onCommentRemove handler if defined
          if (this.options.onCommentRemove) {
            this.options.onCommentRemove(id);
          }

          return true;
        },
      initAllComments:
        (comments: Comment[]) =>
        ({ editor, tr }) => {
          this.storage.comments = comments;
          tr.setMeta(commentsExtensionName, true);
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey(commentsExtensionName);
    const { onCommentClick } = this.options;

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init: (_, { doc }) => {
            return DecorationSet.create(doc, []);
          },
          apply: (tr, old) => {
            const action = tr.getMeta(commentsExtensionName);

            // Update positions of comments when text changes
            if (tr.docChanged) {
              const { comments } = this.storage;
              const { onCommentUpdate, onCommentsUpdates } = this.options;
              const updatedComments: Comment[] = [];

              // Update comment positions based on document changes
              this.storage.comments = comments.map((comment: Comment) => {
                // Handle text being added or removed before or within the comment
                const newFrom = tr.mapping.map(comment.from);
                const mappedTo = tr.mapping.map(comment.to);

                // Two cases to handle:
                // 1. If text is added before the comment, we want to shift both from and to
                // 2. If text is changed within the comment range, we want to maintain the original length

                // Determine if text was added/removed before the comment
                // or if the comment itself was modified
                let newTo: number;
                const originalLength = comment.to - comment.from;

                // If the mapping preserved the comment length exactly, use mapped positions
                if (mappedTo - newFrom === originalLength) {
                  newTo = mappedTo;
                } else {
                  // Otherwise enforce the original length
                  newTo = newFrom + originalLength;
                }

                // Only consider it updated if position actually changed
                const updatedComment = {
                  ...comment,
                  from: newFrom,
                  to: newTo,
                };

                // Check if the comment position has changed
                if (newFrom !== comment.from || newTo !== comment.to) {
                  // Call onCommentUpdate handler for each updated comment
                  if (onCommentUpdate) {
                    onCommentUpdate(updatedComment);
                  }

                  // Add to list of updated comments for batch handler
                  updatedComments.push(updatedComment);
                }

                return updatedComment;
              });

              // Call onCommentsUpdates handler if any comments were updated
              if (onCommentsUpdates && updatedComments.length > 0) {
                onCommentsUpdates(updatedComments);
              }
            }

            // If no explicit comments update action and no doc changes, return old decorations
            if (!action && !tr.docChanged) return old;

            // Get updated comments
            const { comments } = this.storage;

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
