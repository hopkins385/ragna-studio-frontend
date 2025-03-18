<script setup lang="ts">
// Imports
import NodeAssistant from '@/modules/workflow/components/canvas/NodeAssistant.vue';
import { Background } from '@vue-flow/background';
import { Panel, useVueFlow, VueFlow } from '@vue-flow/core';
import { NodeToolbar } from '@vue-flow/node-toolbar';

// Props
// Emits

// Refs
const nodes = ref([
  { id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'Input Data' } },
  { id: '2', type: 'assistant', position: { x: 100, y: 100 }, data: { label: 'Parse Website' } },
  { id: '3', type: 'assistant', position: { x: 400, y: 100 }, data: { label: 'Review Agent' } },
  // { id: '4', type: 'output', position: { x: 750, y: 350 }, data: { label: 'Node 1' } },
]);

const edges = ref([
  { id: 'e1-2', source: '1', target: '2', animated: false },
  { id: 'e1-3', source: '2', target: '3' },
  { id: 'e1-4', source: '3', target: '4' },
]);

// Composables
const { onInit, onNodeDragStop, onConnect, addEdges, setViewport, toObject } = useVueFlow();

// Computed
// Functions
onConnect(connection => {
  addEdges(connection);
});

function updatePos() {
  nodes.value = nodes.value.map(node => {
    return {
      ...node,
      position: {
        x: Math.random() * 400,
        y: Math.random() * 400,
      },
    };
  });
}

function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 });
}

function addNode() {
  const id = Date.now().toString();

  nodes.value.push({
    id,
    type: 'assistant',
    position: { x: 150, y: 50 },
    data: { label: `Node ${id}` },
  });
}
// Hooks
</script>

<template>
  <VueFlow
    v-model:nodes="nodes"
    v-model:edges="edges"
    class="basic-flow"
    :default-viewport="{ zoom: 1 }"
    :min-zoom="0.2"
    :max-zoom="4"
  >
    <Background pattern-color="#aaa" :gap="16" />

    <NodeToolbar />

    <Panel :position="'top-right'">
      <button type="button" @click="addNode">Add a node</button>
    </Panel>

    <template #node-assistant="assistantNodeProps">
      <NodeAssistant v-bind="assistantNodeProps" />
    </template>
  </VueFlow>
</template>

<style></style>
