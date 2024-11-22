<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Loader2Icon } from 'lucide-vue-next';

interface Props {
  loading: boolean;
}

withDefaults(defineProps<Props>(), {
  loading: false,
});
</script>

<template>
  <Button :disabled="loading">
    <Loader2Icon v-if="loading" class="animate-spin" />
    <span>
      <slot />
    </span>
  </Button>
</template>
