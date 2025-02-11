import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet, EditorView } from '@tiptap/pm/view';

export interface CommentData {
  id: string;
  text: string;
  anchor: {
    type: 'paragraph' | 'heading' | 'text' | 'listItem' | 'taskItem' | string;
    posStart: number;
    posEnd: number;
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
    // Ensure NodeTracker extension is enabled
    if (
      !this.editor.extensionManager.extensions.find(
        ext => ext.name === 'nodeTracker',
      )
    ) {
      console.warn(
        'Comment extension requires NodeTracker extension to be enabled',
      );
    }

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

          const slice = state.doc.slice(from, to);
          const nodeAtStart = state.doc.nodeAt(from);
          const nodeType = nodeAtStart ? nodeAtStart.type.name : 'text';
          const nodeAttrs = nodeAtStart ? nodeAtStart.attrs : undefined;

          // Get accurate positions from node attributes if available
          const posStart = nodeAtStart?.attrs?.posStart ?? from;
          const posEnd = nodeAtStart?.attrs?.posEnd ?? to;

          const commentData: CommentData = {
            id: Math.random().toString(36).substr(2, 9),
            text: comment,
            anchor: {
              type: nodeType,
              posStart: posStart,
              posEnd: posEnd,
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
    return [
      new Plugin({
        key: new PluginKey('comment'),
        props: {
          decorations: state => {
            const decorations: Decoration[] = [];

            this.storage.comments.forEach((comment: CommentData) => {
              // Get the node at the comment's start position
              const node = state.doc.nodeAt(comment.anchor.posStart);
              if (!node) return;

              // Use node's actual positions if they differ from stored positions
              const startPos = node.attrs?.posStart ?? comment.anchor.posStart;
              const endPos = node.attrs?.posEnd ?? comment.anchor.posEnd;

              decorations.push(
                Decoration.inline(startPos, endPos, {
                  class: 'comment-highlighted',
                }),
              );

              decorations.push(
                Decoration.widget(endPos, (view: EditorView) => {
                  const commentBox = document.createElement('div');
                  commentBox.className = 'comment-box';

                  const commentContent = document.createElement('div');
                  commentContent.className = 'comment-content';
                  commentContent.textContent = comment.text;

                  const deleteButton = document.createElement('button');
                  deleteButton.className = 'comment-delete';
                  deleteButton.innerHTML = '×';
                  deleteButton.onclick = () => {
                    this.storage.comments = this.storage.comments.filter(
                      (c: CommentData) => c.id !== comment.id,
                    );
                    view.dispatch(view.state.tr);
                  };

                  commentBox.appendChild(commentContent);
                  commentBox.appendChild(deleteButton);
                  return commentBox;
                }),
              );
            });

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});
