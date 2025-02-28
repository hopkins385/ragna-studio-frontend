<script setup lang="ts">
// Imports
import { Background } from '@vue-flow/background';
import { ControlButton, Controls } from '@vue-flow/controls';
import { Panel, useVueFlow, VueFlow } from '@vue-flow/core';
import { MiniMap } from '@vue-flow/minimap';
import { NodeToolbar } from '@vue-flow/node-toolbar';
import { RotateCcwIcon } from 'lucide-vue-next';

// Props
// Emits

// Refs
const nodes = ref([
  { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 5 } },
  { id: '2', type: 'output', label: 'Node 2', position: { x: 100, y: 100 } },
  { id: '3', type: '', label: 'Node 3', position: { x: 400, y: 100 } },
  { id: '4', type: '', label: 'Node 4', position: { x: 400, y: 200 } },
]);

const edges = ref([
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
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

    <MiniMap />
    <NodeToolbar />

    <template #edge-button="buttonEdgeProps">
      <EdgeWithButton
        :id="buttonEdgeProps.id"
        :source-x="buttonEdgeProps.sourceX"
        :source-y="buttonEdgeProps.sourceY"
        :target-x="buttonEdgeProps.targetX"
        :target-y="buttonEdgeProps.targetY"
        :source-position="buttonEdgeProps.sourcePosition"
        :target-position="buttonEdgeProps.targetPosition"
        :marker-end="buttonEdgeProps.markerEnd"
        :style="buttonEdgeProps.style"
      />
    </template>

    <Panel class="process-panel" position="top-right">
      <div class="layout-panel">
        <button title="set horizontal layout">
          <Icon name="horizontal" />
        </button>

        <button title="set vertical layout">
          <Icon name="vertical" />
        </button>
      </div>
    </Panel>

    <Controls position="top-left">
      <ControlButton title="Reset Transform" @click="resetTransform">
        <RotateCcwIcon />
      </ControlButton>

      <ControlButton title="Shuffle Node Positions" @click="updatePos">
        <UpdateIcon />
      </ControlButton>
    </Controls>
  </VueFlow>
</template>

<style></style>
