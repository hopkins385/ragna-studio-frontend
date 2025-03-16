<script setup lang="ts">
import { RouteName } from '@/router/enums/route-names.enum';
import useForHumans from '@composables/useForHumans';

interface ChatHistoryProps {
  id: string;
  title: string;
  createdAt: Date;
  assistant: {
    id: string;
    title: string;
  };
  active: boolean;
}

const props = defineProps<ChatHistoryProps>();

const router = useRouter();

const { getDateTimeForHumans } = useForHumans();

const onClick = () => {
  router.push({ name: RouteName.CHAT_SHOW, params: { id: props.id } });
};
</script>

<template>
  <div
    class="flex h-16 cursor-pointer border-0 text-xs text-muted-foreground"
    @click="onClick"
  >
    <div class="size-8 shrink-0 rounded-full bg-slate-100"></div>
    <div
      class="flex w-full justify-between pl-3 pt-1"
      :class="{ 'font-semibold': active }"
    >
      <div class="flex flex-col">
        <span class="">{{ title }}</span>
        <span class="truncate pt-1" style="max-width: 7rem">
          {{ assistant?.title }}
        </span>
        <span class="pt-1">{{ assistant?.llm?.displayName }}</span>
      </div>
      <div>
        <span class="whitespace-nowrap">
          {{ getDateTimeForHumans(createdAt, { year: undefined }) }}
        </span>
      </div>
    </div>
  </div>
</template>
