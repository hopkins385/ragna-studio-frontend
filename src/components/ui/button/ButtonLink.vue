<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { RouterLink } from 'vue-router';

const props = defineProps<{
  to: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | null
    | undefined;
}>();
</script>

<template>
  <Button :variant="variant ?? 'outline'" as-child>
    <RouterLink :to="to">
      <slot />
    </RouterLink>
  </Button>
</template>
