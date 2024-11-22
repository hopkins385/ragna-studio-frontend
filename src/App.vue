<script setup lang="ts">
import { RouterView } from 'vue-router';

// Layout handling is managed by the layout middleware
</script>

<template>
  <component :is="$route.meta.layoutComponent">
    <RouterView />
  </component>
</template>
