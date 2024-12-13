<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

defineProps<{
  assistants: any[];
}>();
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
        <TableHead class="w-[200px]">Title</TableHead>
        <TableHead class="">Description</TableHead>
        <TableHead class="text-right"> Actions </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="assistant in assistants" :key="assistant.id">
        <TableCell>
          <div class="rounded-full size-8 bg-slate-200"></div>
        </TableCell>
        <TableCell>{{ assistant?.detail.title }}</TableCell>
        <TableCell>{{ assistant?.detail.description }}</TableCell>
        <TableCell class="text-right">
          <button
            @click="$emit('startChat', assistant.id)"
            class="text-xs border px-2 py-1 rounded-lg"
          >
            Start Chat
          </button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
