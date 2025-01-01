<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@ui/table';

interface AssistantFavoriteProps {
  assistants: any[];
}

interface AssistantFavoriteEmits {
  startChat: [string];
}

defineProps<AssistantFavoriteProps>();
defineEmits<AssistantFavoriteEmits>();
</script>

<template>
  <!--
  <div class="space-y-4 pt-3">
    <div
      class="flex items-center space-x-3"
      v-for="assistant in assistants"
      :key="assistant.id"
    >
      <div class="rounded-full size-8 bg-slate-200"></div>
      <div class="text-sm">{{ assistant?.detail.title }}</div>
    </div>
  </div>
  -->

  <Table class="text-sm">
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">Agent</TableHead>
        <TableHead class="w-[200px]">{{ $t('table.title') }}</TableHead>
        <TableHead class="">{{ $t('table.description') }}</TableHead>
        <TableHead class="text-right">{{ $t('table.actions') }}</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="assistant in assistants" :key="assistant.id">
        <TableCell>
          <div class="rounded-full size-8 bg-slate-200"></div>
        </TableCell>
        <TableCell>{{ assistant?.title }}</TableCell>
        <TableCell>{{ assistant?.description }}</TableCell>
        <TableCell class="text-right">
          <button
            @click="$emit('startChat', assistant.id)"
            class="text-xs border px-2 py-1 rounded-lg"
          >
            {{ $t('chat.button.start') }}
          </button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
