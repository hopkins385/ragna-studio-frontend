<script setup lang="ts">
import { TableCaption } from '@ui/table';

interface TableMetaCaptionProps {
  itemsLength: number;
  meta: {
    totalCount: number;
    currentPage: number;
  };
}

defineProps<TableMetaCaptionProps>();
</script>

<template>
  <TableCaption>
    {{
      $t('table.meta.showing', {
        from: meta.totalCount > 10 ? meta.currentPage * 10 - 10 + 1 : 1,
        to:
          meta.totalCount > 10
            ? meta.currentPage * 10 - 10 + itemsLength
            : meta.totalCount,
        total: meta.totalCount,
      })
    }}
  </TableCaption>
</template>
