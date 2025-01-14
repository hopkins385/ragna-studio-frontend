<script setup lang="ts">
interface ChatToolCallMessageProps {
  displayName: string;
  activeTools: any;
}
defineProps<ChatToolCallMessageProps>();
</script>

<template>
  <div class="chatbox__text-box rounded-lg px-10 py-3 text-sm">
    <div
      class="flex items-center justify-start space-x-3 border-0 py-2 px-4 rounded-lg bg-slate-100 w-fit shadow-md"
    >
      <div
        class="size-6 shrink-0 rounded-full bg-slate-300 animate-pulse"
      ></div>
      <!-- tool -->
      <div class="space-y-4">
        <div
          v-for="(tool, index) in activeTools"
          :key="index"
          class="flex items-center space-x-2"
        >
          <!-- icon -->
          <p>
            {{ $t('assistant.alert.executing_tool') }}:&nbsp;<span
              class="text-sm font-semibold capitalize"
            >
              {{ tool.toolName }}
            </span>
          </p>
          <p>{{ tool.toolInfo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
