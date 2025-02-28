<script setup lang="ts">
import { ChatMessageRole } from '@/enums/chat-role.enum';
import IconRagna from '@assets/icons/ragna.svg?component';
import { UserRoundIcon } from 'lucide-vue-next';

defineProps<{
  role: ChatMessageRole;
  displayName: string;
}>();
</script>

<template>
  <div
    class="chatbox__text-box flex bg-white px-10 text-sm py-4"
    :class="['items-start', role === ChatMessageRole.USER ? 'justify-end' : 'justify-start']"
  >
    <div
      class="pt-3 pb-4 px-4 rounded-2xl flex space-x-3 border border-stone-100"
      :class="[
        role === ChatMessageRole.USER
          ? 'flex-row-reverse space-x-reverse pl-6 max-w-2xl bg-stone-100'
          : 'pr-6 border-transparent',
      ]"
    >
      <div
        class="size-8 flex items-center justify-center shrink-0 rounded-full"
        :class="[role === ChatMessageRole.USER ? ' border-stone-200' : 'border-stone-100']"
      >
        <span v-if="role === ChatMessageRole.USER">
          <UserRoundIcon class="size-4 stroke-2 opacity-50" />
        </span>
        <span v-if="role === ChatMessageRole.ASSISTANT">
          <IconRagna class="size-5 drop-shadow-sm" />
        </span>
      </div>
      <div
        class="flex flex-col space-y-2"
        :class="[role === ChatMessageRole.USER ? 'items-end' : 'items-start']"
      >
        <div
          class="select-none font-semibold pt-1"
          :class="[role === ChatMessageRole.USER ? 'hidden' : '']"
        >
          {{ displayName }}
        </div>
        <div>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
