<script setup lang="ts">
import { ChatMessageRole } from '@/enums/chat-role.enum';
import IconRagna from '@assets/icons/ragna.svg?component';
import { UserRoundIcon } from 'lucide-vue-next';

interface ChatMessageBoxProps {
  role: ChatMessageRole;
  displayName: string;
}

defineProps<ChatMessageBoxProps>();
</script>

<template>
  <div class="chatbox__text-box rounded-lg bg-white px-10 py-3 text-sm">
    <div class="flex space-x-3">
      <div
        class="size-8 flex items-center justify-center shrink-0 rounded-full bg-slate-100"
      >
        <span v-if="role === ChatMessageRole.USER">
          <UserRoundIcon class="size-4 stroke-2 opacity-50" />
        </span>
        <span v-if="role === ChatMessageRole.ASSISTANT">
          <IconRagna class="size-5 drop-shadow-sm" />
        </span>
      </div>
      <div class="flex flex-col space-y-2">
        <div class="select-none font-semibold" style="padding-top: 1.5px">
          {{ displayName }}
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
