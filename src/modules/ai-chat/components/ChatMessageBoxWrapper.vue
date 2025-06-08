<script setup lang="ts">
import BrandIcon from '@/components/brand/BrandIcon.vue';
import { ChatMessageRole } from '@/modules/ai-chat/enums/chat-role.enum';
import { UserRoundIcon } from 'lucide-vue-next';

defineProps<{
  role: ChatMessageRole;
  displayName: string;
}>();
</script>

<template>
  <div
    id="chat-message-box-wrapper"
    class="chatbox__text-box flex bg-white px-10 text-sm py-4 group"
    :class="['items-start', role === ChatMessageRole.USER ? 'justify-end' : 'justify-start']"
  >
    <!-- message inner container -->
    <div class="relative">
      <div
        class="pt-3 pb-4 px-4 rounded-2xl flex space-x-3 border border-stone-100"
        :class="[
          role === ChatMessageRole.USER
            ? 'flex-row-reverse space-x-reverse pl-6 bg-stone-100'
            : 'pr-6 border-transparent',
        ]"
      >
        <!-- avatar -->
        <div
          class="size-8 flex items-center justify-center shrink-0 rounded-full"
          :class="[role === ChatMessageRole.USER ? ' border-stone-200' : 'border-stone-100']"
        >
          <span v-if="role === ChatMessageRole.USER">
            <UserRoundIcon class="size-4 stroke-2 opacity-50" />
          </span>
          <span v-if="role === ChatMessageRole.ASSISTANT">
            <BrandIcon class="size-5 drop-shadow-sm" />
          </span>
        </div>
        <!-- message content container -->
        <div
          class="flex flex-col space-y-2"
          :class="[role === ChatMessageRole.USER ? 'items-end' : 'items-start']"
        >
          <!-- display name -->
          <div
            class="select-none font-semibold pt-1"
            :class="[role === ChatMessageRole.USER ? 'hidden' : '']"
          >
            {{ displayName }}
          </div>
          <!-- message content -->
          <div
            class="overflow-hidden w-fit"
            :class="[role === ChatMessageRole.USER ? 'max-w-xl' : 'pr-10']"
          >
            <slot />
          </div>
        </div>
      </div>
      <!-- controls -->
      <slot name="controls" />
    </div>
  </div>
</template>
