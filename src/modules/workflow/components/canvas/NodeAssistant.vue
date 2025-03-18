<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core';
import { Handle, Position } from '@vue-flow/core';

// Imports

// Props
const props = defineProps<NodeProps>();
// Emits

// Refs

// Composables

// Computed
// Functions

// Hooks
</script>

<template>
  <div class="border h-72 w-60 bg-white shadow-md rounded-lg relative">
    <div class="">
      <div class="p-3 rounded-md space-y-1">
        <h2 class="text-sm font-semibold">{{ props.data.label }}</h2>
      </div>
      <div class="relative opacity-75">
        <Handle type="target" :position="Position.Left" />
        <p class="text-xs pl-2">Input</p>
      </div>
      <div class="border h-40 rounded-sm my-3"></div>
      <div class="relative w-full flex opacity-75">
        <Handle type="source" :position="Position.Right" />
        <p class="text-xs pr-2 ml-auto">Output</p>
      </div>
    </div>

    <!-- Source handle (right) -->
    <!--
    <Handle
      type="source"
      :position="Position.Right"
      :id="'right-source'"
      class="w-3 h-3 bg-green-500"
    />
    -->

    <!-- Target handle (left) -->
    <!--
    <Handle
      type="target"
      :position="Position.Left"
      :id="'left-target'"
      class="w-3 h-3 bg-blue-500"
    />
    -->
  </div>
</template>
