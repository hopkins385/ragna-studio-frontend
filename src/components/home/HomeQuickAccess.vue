<script setup lang="ts">
import {
  BotIcon,
  CloudUploadIcon,
  DatabaseIcon,
  FileTextIcon,
  ImageIcon,
  LayoutGridIcon,
  LayoutTemplateIcon,
  MessagesSquareIcon,
  WorkflowIcon,
} from 'lucide-vue-next';

const { t } = useI18n();

const quickAccessItems = [
  {
    icon: FileTextIcon,
    class: 'bg-blue-100/60',
    label: t('nav.documents'),
    route: '/document',
  },
  {
    icon: MessagesSquareIcon,
    class: 'bg-amber-100/60',
    label: t('nav.chat'),
    route: '/chat',
  },
  {
    icon: BotIcon,
    class: 'bg-blue-100/60',
    label: t('nav.agents'),
    route: '/assistant',
  },
  {
    icon: ImageIcon,
    class: 'bg-violet-100/60',
    label: t('nav.text_to_image'),
    route: '/text-to-image',
  },
  {
    icon: WorkflowIcon,
    class: 'bg-green-100/60',
    label: t('nav.workflows'),
    route: '/workflow',
  },
  {
    icon: DatabaseIcon,
    class: 'bg-slate-100/60',
    label: t('nav.collections'),
    route: '/collection',
  },
  {
    icon: CloudUploadIcon,
    class: 'bg-indigo-100/60',
    label: t('nav.uploads'),
    route: '/media/upload',
  },
  {
    icon: LayoutTemplateIcon,
    class: 'bg-cyan-100/60',
    label: t('nav.agent_templates'),
    route: '/assistant/template',
  },
];
</script>

<template>
  <div class="px-20 pt-5">
    <div class="flex items-center space-x-2">
      <LayoutGridIcon class="size-5 stroke-1.5" />
      <h2 class="text-2xl font-semibold">{{ $t('quickaccess.title') }}</h2>
    </div>
  </div>
  <div class="px-20 py-5 flex flex-wrap gap-4">
    <router-link
      v-for="item in quickAccessItems"
      :key="item.route"
      :to="item.route"
      class="flex flex-col"
    >
      <div
        class="w-60 h-40 border-0 rounded-2xl p-5 group hover:shadow-md space-y-2"
        :class="item.class"
      >
        <component
          :is="item.icon"
          class="size-6 stroke-1.5 group-hover:stroke-2 bg-transparent"
          :class="item.class"
        />
        <p class="text-xs font-medium group-hover:font-semibold">
          {{ item.label }}
        </p>
      </div>
    </router-link>
  </div>
</template>
