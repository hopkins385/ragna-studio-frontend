<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CameraIcon } from 'lucide-vue-next';

// Imports

// Props
// Emits

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <button
        class="bg-white/75 shadow-md p-2 rounded-lg hidden group-hover:block hover:bg-white/95 transition-all duration-200 ease-in-out"
      >
        <!-- hidden group-hover:block -->
        <CameraIcon class="size-4 stroke-2" />
      </button>
    </DialogTrigger>
    <DialogContent class="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Edit Image</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter> Save changes </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
