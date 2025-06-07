<script setup lang="ts">
defineProps<{
  to: string;
  icon: any;
  label: string;
  labelVisible: boolean;
}>();
</script>

<template>
  <RouterLink
    :to="to"
    class="flex flex-col items-center rounded-lg border border-transparent px-4 py-0 transition-colors group"
    :activeClass="undefined"
    exactActiveClass="nav-link-active"
  >
    <div class="nav-icon-wrapper">
      <component :is="icon" class="nav-icon default-icon" />
    </div>
    <span class="truncate px-4 pt-0 text-foreground nav-icon-text">
      {{ $t(label) }}
    </span>
  </RouterLink>
</template>
