<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="text-sm opacity-75">Datei</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Speichern</DropdownMenuItem>
      <DropdownMenuItem>Speichern als ...</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Auto speichern</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Datei importieren</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
