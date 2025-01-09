<script setup lang="ts">
defineProps<{
  title: string | undefined | null;
  subtitle?: string;
}>();
</script>

<template>
  <div class="flex w-full items-center justify-between">
    <div class="">
      <h1 class="max-w-lg text-2xl font-bold opacity-95 truncate">
        {{ title ?? '' }}
      </h1>
      <p class="max-w-2xl text-sm opacity-85 truncate">
        {{ subtitle ?? '' }}
      </p>
    </div>
    <div>
      <slot name="button" />
    </div>
  </div>
</template>
