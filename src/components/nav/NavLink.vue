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
    class="flex flex-col items-center rounded-lg border border-transparent px-4 py-0 transition-colors group"
    :class="active ? 'nav-link-active' : ''"
  >
    <div class="nav-icon-wrapper">
      <component :is="icon" class="nav-icon default-icon" />
    </div>
    <span class="truncate px-4 pt-0 text-foreground nav-icon-text">
      {{ $t(label) }}
    </span>
  </RouterLink>
</template>

<style scoped>
.nav-icon-text {
  font-size: 0.6rem;
  line-height: 1rem;
  opacity: 75%;
}

.nav-icon-wrapper {
  @apply px-3 py-2 rounded-lg group-hover:bg-stone-200/60 group-hover:scale-105 transition-transform;
}

.nav-icon {
  /*@apply size-5;*/
  width: 1.4rem;
  height: 1.4rem;
}

.nav-link-active {
  @apply font-semibold;
  .nav-icon-wrapper {
    @apply bg-stone-200/60;
  }
}
</style>
