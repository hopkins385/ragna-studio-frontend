import { defineStore } from 'pinia';

interface SheetDimension {
  workflowId: string;
  column: [
    {
      id: number;
      width: number;
    },
  ];
  row: [
    {
      id: number;
      height: number;
    },
  ];
}

export const useSheetStore = defineStore('workflow-sheet-store', {
  state: () => ({
    dimensions: [] as SheetDimension[],
    minWidth: 160,
    minHeight: 32,
  }),
  actions: {
    updateOrCreateHeight(
      workflowId: string,
      rowIndex: number,
      newHeight: number,
    ) {
      const height = Math.max(newHeight, this.minHeight);
      const sheet = this.dimensions.find(
        sheet => sheet.workflowId === workflowId,
      );
      if (sheet) {
        const row = sheet.row.find(row => row.id === rowIndex);
        if (row) {
          row.height = height;
        } else {
          sheet.row.push({ id: rowIndex, height });
        }
      } else {
        this.dimensions.push({
          workflowId,
          // @ts-ignore
          column: [],
          row: [{ id: rowIndex, height }],
        });
      }
    },
    updateOrCreateWidth(
      workflowId: string,
      columnIndex: number,
      newWidth: number,
    ) {
      const width = Math.max(newWidth, this.minWidth);
      const sheet = this.dimensions.find(
        sheet => sheet.workflowId === workflowId,
      );
      if (sheet) {
        const column = sheet.column.find(column => column.id === columnIndex);
        if (column) {
          column.width = width;
        } else {
          sheet.column.push({ id: columnIndex, width });
        }
      } else {
        this.dimensions.push({
          workflowId,
          column: [{ id: columnIndex, width }],
          // @ts-ignore
          row: [],
        });
      }
    },
  },
  persist: {
    storage: localStorage,
  },
});
