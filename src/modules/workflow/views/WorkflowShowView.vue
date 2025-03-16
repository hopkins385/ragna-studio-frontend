<script setup lang="ts">
import WorkflowSheet from '@/components/workflow/WorkflowSheet.vue';
</script>

<template>
  <div id="workflowContainer" class="">
    <div class="">
      <Suspense>
        <WorkflowSheet :workflow-id="$route.params.id.toString()" />
        <!--
        <WorkflowFlowView v-else :workflow-id="workflowId" />
        -->
      </Suspense>
    </div>
  </div>
</template>
