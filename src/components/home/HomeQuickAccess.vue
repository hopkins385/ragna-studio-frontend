<script setup lang="ts">
import {
  BotIcon,
  CloudUploadIcon,
  DatabaseIcon,
  ImageIcon,
  LayoutTemplateIcon,
  MessagesSquareIcon,
  WorkflowIcon,
} from 'lucide-vue-next';

const { t } = useI18n();

const quickAccessItems = [
  {
    icon: BotIcon,
    label: t('nav.agents'),
    route: '/assistant',
  },
  {
    icon: WorkflowIcon,
    label: t('nav.workflows'),
    route: '/workflow',
  },
  {
    icon: MessagesSquareIcon,
    label: t('nav.chat'),
    route: '/chat',
  },
  {
    icon: ImageIcon,
    label: t('nav.text_to_image'),
    route: '/text-to-image',
  },
  {
    icon: DatabaseIcon,
    label: t('nav.collections'),
    route: '/collection',
  },
  {
    icon: CloudUploadIcon,
    label: t('nav.uploads'),
    route: '/media/upload',
  },
  {
    icon: LayoutTemplateIcon,
    label: t('nav.agent_templates'),
    route: '/templates',
  },
];
</script>

<template>
  <div class="flex justify-center space-x-8 p-4">
    <router-link
      v-for="item in quickAccessItems"
      :key="item.route"
      :to="item.route"
      class="flex flex-col items-center space-y-2 w-24 hover:drop-shadow-md cursor-pointer transition-all group"
    >
      <div
        class="rounded-full size-12 flex justify-center items-center bg-stone-100"
      >
        <component
          :is="item.icon"
          class="size-5 stroke-1.5 group-hover:stroke-2"
        />
      </div>
      <p class="text-xs font-medium">{{ item.label }}</p>
    </router-link>
  </div>
</template>
