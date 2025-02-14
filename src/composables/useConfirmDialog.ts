// composables/useConfirmDialog.ts

interface ConfirmDialogOptions {
  title?: string;
  description?: string;
  confirmButtonText?: string;
  onConfirm: () => void;
}

interface ConfirmDialogState {
  open: boolean;
}

type ConfirmDialogRef = ConfirmDialogState & ConfirmDialogOptions;

export function useConfirmDialog() {
  const confirmDialog = reactive<ConfirmDialogRef>({
    open: false,
    title: undefined,
    description: undefined,
    confirmButtonText: undefined,
    onConfirm: () => {},
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
  };

  const unsetConfirmDialog = () => {
    confirmDialog.title = undefined;
    confirmDialog.description = undefined;
    confirmDialog.confirmButtonText = undefined;
    confirmDialog.onConfirm = () => {};
    confirmDialog.open = false;
  };

  return {
    confirmDialog,
    setConfirmDialog,
    unsetConfirmDialog,
  };
}
