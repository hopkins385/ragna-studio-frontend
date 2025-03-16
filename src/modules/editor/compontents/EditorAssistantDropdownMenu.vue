<script setup lang="ts">
import IconRagna from '@assets/icons/ragna.svg?component';
import { Button } from '@ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { PencilIcon } from 'lucide-vue-next';

const emit = defineEmits<{
  close: [void];
  prompt: [void];
}>();

const onUpdateOpen = (open: boolean) => {
  if (!open) {
    emit('close');
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <DropdownMenu @update:open="onUpdateOpen">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <IconRagna class="!size-7 drop-shadow-md" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="min-w-[16rem] p-3">
      <DropdownMenuItem
        class="flex w-full items-center justify-start cursor-pointer"
        @click="emit('prompt')"
      >
        <PencilIcon class="size-4" /> Prompt schreiben ...
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
