<script setup lang="ts"></script>

<template>
  <BoxContainer class="mb-4 p-2">
    <div
      class="flex min-h-20 overflow-hidden rounded-lg bg-cover bg-top bg-no-repeat"
    >
      <slot name="top" />
    </div>
    <div class="mt-1 flex overflow-hidden rounded-lg bg-gray-50">
      <slot name="bottom" />
    </div>
  </BoxContainer>
</template>
