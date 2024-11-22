<script setup lang="ts">
import WorkflowSheet from '@/components/workflow/WorkflowSheet.vue';

const showTable = ref(true);

const workflowId = useRoute().params.id as string;

console.log('workflowId', workflowId);
</script>

<template>
  <div id="workflowContainer" class="size-full">
    <div class="min-h-full bg-white">
      <Suspense>
        <WorkflowSheet v-if="showTable" :workflow-id="workflowId" />
        <!--
        <WorkflowFlowView v-else :workflow-id="workflowId" />
        -->
      </Suspense>
    </div>
  </div>
</template>
