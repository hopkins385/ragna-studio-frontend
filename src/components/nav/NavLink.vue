<script setup lang="ts">
defineProps<{
  active: boolean;
  to: string;
  icon: any;
  label: string;
  labelVisible: boolean;
}>();

// hover:border-muted-foreground/25
</script>

<template>
  <RouterLink
    :to="to"
    class="flex flex-col items-center rounded-lg border border-transparent px-4 py-2 transition-colors"
    :class="active ? 'nav-link-active' : ''"
  >
    <component
      :is="icon"
      class="nav-icon default-icon"
      :class="{ '!stroke': active }"
    />
    <span class="truncate px-4 pt-1 text-foreground nav-icon-text">
      {{ label }}
    </span>
  </RouterLink>
</template>

<style scoped>
.nav-icon-text {
  font-size: 0.6rem;
  line-height: 1rem;
  opacity: 75%;
}

.nav-icon {
  /*@apply size-5;*/
  width: 1.4rem;
  height: 1.4rem;
}

.nav-link-active {
  @apply font-semibold; /* border-slate-300*/
}
</style>
