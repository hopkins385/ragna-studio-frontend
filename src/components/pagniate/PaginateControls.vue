<script setup lang="ts">
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@ui/pagination';
import { Button } from '@ui/button';

const props = defineProps<{
  page: number;
  meta: {
    totalCount: number;
  };
  limit?: number;
  search?: string;
}>();

const emit = defineEmits<{
  'update:page': [number];
}>();

function onUpdatePage(page: number) {
  emit('update:page', page);
}
</script>

<template>
  <Pagination
    v-if="meta.totalCount > 10"
    v-slot="{ page }"
    :total="meta.totalCount"
    :sibling-count="1"
    show-edges
    :default-page="page"
    :items-per-page="limit || 10"
    @update:page="onUpdatePage"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">
      <PaginationFirst />
      <PaginationPrev />

      <template v-for="(item, index) in items">
        <PaginationListItem
          v-if="item.type === 'page'"
          :key="index"
          :value="item.value"
          as-child
        >
          <Button
            class="size-10 p-0"
            :variant="item.value === page ? 'default' : 'outline'"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :key="item.type" :index="index" />
      </template>

      <PaginationNext />
      <PaginationLast />
    </PaginationList>
  </Pagination>
</template>
