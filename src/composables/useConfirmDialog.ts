// composables/useConfirmDialog.ts

export interface ConfirmDialogOptions {
  title?: string;
  description?: string;
  confirmButtonText?: string;
  onConfirm: () => Promise<void>;
}

interface ConfirmDialogState {
  open: boolean;
  loading: boolean;
}

type ConfirmDialogRef = ConfirmDialogState & ConfirmDialogOptions;

export function useConfirmDialog() {
  const confirmDialog = reactive<ConfirmDialogRef>({
    open: false,
    loading: false,
    title: undefined,
    description: undefined,
    confirmButtonText: undefined,
    onConfirm: async () => {},
  });

  const setConfirmDialog = ({
    title,
    description,
    confirmButtonText,
    onConfirm,
  }: ConfirmDialogOptions) => {
    confirmDialog.title = title;
    confirmDialog.description = description;
    confirmDialog.confirmButtonText = confirmButtonText;
    confirmDialog.onConfirm = onConfirm;
    confirmDialog.open = true;
    confirmDialog.loading = false;
  };

  const handleConfirm = async () => {
    try {
      confirmDialog.loading = true;
      await confirmDialog.onConfirm();
    } finally {
      unsetConfirmDialog();
    }
  };

  const unsetConfirmDialog = () => {
    confirmDialog.title = undefined;
    confirmDialog.description = undefined;
    confirmDialog.confirmButtonText = undefined;
    confirmDialog.onConfirm = async () => {};
    confirmDialog.open = false;
    confirmDialog.loading = false;
  };

  return {
    confirmDialog,
    setConfirmDialog,
    unsetConfirmDialog,
  };
}
