<script setup lang="ts">
import {
  FileTextIcon,
  KanbanSquareIcon,
  LayoutGridIcon,
  LayoutTemplateIcon,
  ListTodoIcon,
  MessagesSquareIcon,
  NetworkIcon,
  PieChartIcon,
  WorkflowIcon,
} from 'lucide-vue-next';

const quickAccessItems = [
  {
    icon: KanbanSquareIcon,
    class: 'bg-red-200/50',
    label: 'nav.kanban',
    route: '/kanban',
  },
  {
    icon: NetworkIcon,
    class: 'bg-green-200/50',
    label: 'nav.architecture',
    route: '/architecture',
  },
  {
    icon: FileTextIcon,
    class: 'bg-yellow-200/50',
    label: 'nav.documents',
    route: '/document',
  },
  {
    icon: ListTodoIcon,
    class: 'bg-orange-200/50',
    label: 'nav.tests',
    route: '/test',
  },
  {
    icon: MessagesSquareIcon,
    class: 'bg-purple-200/50',
    label: 'nav.chat',
    route: '/chat',
  },
  {
    icon: WorkflowIcon,
    class: 'bg-teal-200/50',
    label: 'nav.workflows',
    route: '/workflow',
  },
  {
    icon: PieChartIcon,
    class: 'bg-blue-200/50',
    label: 'nav.analytics',
    route: '/analytics',
  },
  {
    icon: LayoutTemplateIcon,
    class: 'bg-cyan-200/50',
    label: 'nav.agent_templates',
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
          class="size-6 stroke-1.5 group-hover:stroke-2 !bg-transparent"
          :class="item.class"
        />
        <p class="text-xs font-medium group-hover:font-semibold">
          {{ $t(item.label) }}
        </p>
      </div>
    </router-link>
  </div>
</template>
