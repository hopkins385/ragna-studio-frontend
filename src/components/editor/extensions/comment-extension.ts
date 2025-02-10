import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';

export interface CommentData {
  id: string;
  text: string;
  anchor: {
    type: 'paragraph' | 'heading' | 'text' | 'listItem' | 'taskItem' | string;
    from: number;
    to: number;
    // Optional: Add level for headings
    attrs?: Record<string, any>;
  };
  documentId?: string; // Add document reference
  createdAt?: Date;
  updatedAt?: Date;
}

interface CommentStorage {
  comments: CommentData[];
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    comment: {
      setComment: (comment: string) => ReturnType;
      removeComment: (id: string) => ReturnType;
    };
  }
  interface EditorOptions {
    documentId: string;
    onCreateComment: (comment: CommentData) => Promise<CommentData>;
    onDeleteComment: (id: string) => Promise<void>;
    onLoadComments: (documentId: string) => Promise<CommentData[]>;
  }
}

export const Comment = Extension.create({
  name: 'comment',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'comment-line',
      },
      documentId: '',
      // Add database handlers in options
      onCreateComment: undefined as
        | ((comment: CommentData) => Promise<CommentData>)
        | undefined,
      onDeleteComment: undefined as ((id: string) => Promise<void>) | undefined,
      onLoadComments: undefined as
        | ((documentId: string) => Promise<CommentData[]>)
        | undefined,
    };
  },

  addStorage() {
    return {
      comments: [] as CommentData[],
    } as CommentStorage;
  },

  onCreate() {
    // Load initial comments if handler is provided
    if (this.options.onLoadComments) {
      this.options
        .onLoadComments(this.options.documentId)
        .then((comments: any) => {
          this.storage.comments = comments;
          this.editor.view.dispatch(this.editor.state.tr);
        });
    }
  },

  addCommands() {
    return {
      setComment:
        (comment: string) =>
        ({ state, tr }) => {
          const { from, to } = state.selection;
          if (from === to) return false;

          // Get the node type at the selection
          const nodeAtStart = state.doc.nodeAt(from);
          const nodeType = nodeAtStart ? nodeAtStart.type.name : 'text';
          const nodeAttrs = nodeAtStart ? nodeAtStart.attrs : undefined;

          const commentData: CommentData = {
            id: Math.random().toString(36).substr(2, 9),
            text: comment,
            anchor: {
              type: nodeType,
              from,
              to,
              attrs: nodeAttrs,
            },
            documentId: this.options.documentId,
            createdAt: new Date(),
          };

          // Store comment immediately and handle database operation separately
          this.storage.comments.push(commentData);

          // Force refresh
          this.editor.view.dispatch(tr);

          // Handle database operation asynchronously
          if (this.options.onCreateComment) {
            this.options
              .onCreateComment(commentData)
              .then((savedComment: CommentData) => {
                // Update the stored comment with saved data
                this.storage.comments = this.storage.comments.map(
                  (c: CommentData) =>
                    c.id === commentData.id ? savedComment : c,
                );
                this.editor.view.dispatch(this.editor.state.tr);
              })
              .catch((error: any) => {
                console.error('Failed to create comment:', error);
                // Remove comment if save failed
                this.storage.comments = this.storage.comments.filter(
                  (c: CommentData) => c.id !== commentData.id,
                );
                this.editor.view.dispatch(this.editor.state.tr);
              });
          }

          return true;
        },

      removeComment:
        (id: string) =>
        ({ tr }) => {
          // Remove from local storage immediately
          this.storage.comments = this.storage.comments.filter(
            (comment: CommentData) => comment.id !== id,
          );

          // Force refresh
          this.editor.view.dispatch(tr);

          // Handle database operation asynchronously
          if (this.options.onDeleteComment) {
            this.options.onDeleteComment(id).catch((error: any) => {
              console.error('Failed to delete comment:', error);
              // Restore the comment if delete failed
              const deletedComment = this.storage.comments.find(
                (c: CommentData) => c.id === id,
              );
              if (deletedComment) {
                this.storage.comments.push(deletedComment);
                this.editor.view.dispatch(this.editor.state.tr);
              }
            });
          }

          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const extension = this;

    return [
      new Plugin({
        key: new PluginKey('comment'),
        props: {
          decorations(state) {
            const decorations: Decoration[] = [];

            extension.storage.comments.forEach((comment: CommentData) => {
              // Add the highlight decoration
              decorations.push(
                Decoration.inline(comment.anchor.from, comment.anchor.to, {
                  class: 'comment-highlighted',
                }),
              );

              // Add the widget decoration for the comment box
              decorations.push(
                Decoration.widget(
                  comment.anchor.to,
                  (view: EditorView, getPos) => {
                    const commentBox = document.createElement('div');
                    commentBox.className = 'comment-box';

                    const commentContent = document.createElement('div');
                    commentContent.className = 'comment-content';
                    commentContent.textContent = comment.text;

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'comment-delete';
                    deleteButton.innerHTML = '×';
                    deleteButton.onclick = () => {
                      // Direct storage manipulation and view update
                      extension.storage.comments =
                        extension.storage.comments.filter(
                          (c: CommentData) => c.id !== comment.id,
                        );
                      // Force a state update to refresh decorations
                      view.dispatch(view.state.tr);
                    };

                    commentBox.appendChild(commentContent);
                    commentBox.appendChild(deleteButton);
                    return commentBox;
                  },
                ),
              );
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
