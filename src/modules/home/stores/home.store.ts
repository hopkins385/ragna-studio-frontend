import {
  BotIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderIcon,
  ImageIcon,
  MessagesSquareIcon,
  PieChartIcon,
  WorkflowIcon,
} from 'lucide-vue-next';
import { defineStore } from 'pinia';
import type { QuickAccessItem } from './../interfaces/quick-access.interface';

const _quickAccessItems: QuickAccessItem[] = [
  // {
  //   id: 1,
  //   icon: KanbanSquareIcon,
  //   class: 'bg-red-200/50',
  //   label: 'nav.kanban',
  //   route: '/kanban',
  // },
  // {
  //   id: 2,
  //   icon: NetworkIcon,
  //   class: 'bg-green-200/50',
  //   label: 'nav.architecture',
  //   route: '/architecture',
  // },
  // {
  //   id: 3,
  //   icon: FileTextIcon,
  //   class: 'bg-yellow-200/50',
  //   label: 'nav.documents',
  //   route: '/document',
  // },
  // {
  //   id: 4,
  //   icon: ListTodoIcon,
  //   class: 'bg-orange-200/50',
  //   label: 'nav.tests',
  //   route: '/validation',
  // },
  {
    id: 1,
    icon: MessagesSquareIcon,
    class: 'bg-indigo-200/50',
    label: 'nav.chat',
    route: '/chat',
  },
  {
    id: 2,
    icon: WorkflowIcon,
    class: 'bg-green-200/50',
    label: 'nav.workflows',
    route: '/workflow',
  },
  {
    id: 3,
    icon: BotIcon,
    class: 'bg-sky-200/50',
    label: 'nav.agents',
    route: '/assistant',
  },
  {
    id: 4,
    icon: ImageIcon,
    class: 'bg-fuchsia-200/50',
    label: 'nav.textToImage',
    route: '/text-to-image',
  },
  {
    id: 5,
    icon: FileTextIcon,
    class: 'bg-yellow-200/50',
    label: 'nav.documents',
    route: '/document',
  },
  {
    id: 6,
    icon: DatabaseIcon,
    class: 'bg-lime-200/50',
    label: 'nav.collections',
    route: '/collection',
  },
  {
    id: 7,
    icon: PieChartIcon,
    class: 'bg-blue-200/50',
    label: 'nav.analytics',
    route: '/account/statistics',
  },
  {
    id: 8,
    icon: FolderIcon,
    class: 'bg-slate-200/50',
    label: 'nav.media',
    route: '/media',
  },
];

const _quickAccessItemsMap = new Map<number, QuickAccessItem>();
_quickAccessItems.forEach(item => {
  _quickAccessItemsMap.set(item.id, item);
});

export const useHomeStore = defineStore(
  'home',
  () => {
    // internal state
    const _quickAccessIsSortable = ref(false);

    // exposed state (and persisted)
    const quickAccessItemsOrder = ref<number[]>(_quickAccessItems.map(item => item.id));
    const quickAccessItems = computed<QuickAccessItem[]>(() => {
      return quickAccessItemsOrder.value.map(itemId => {
        const item = _quickAccessItemsMap.get(itemId);
        if (!item) {
          throw new Error(`Quick access item with id ${itemId} not found`);
        }
        return item;
      });
    });
    const quickAccessIsSortable = computed(() => _quickAccessIsSortable.value);

    // Actions
    function moveQuickAccessItem(fromIndex: number | undefined, toIndex: number | undefined) {
      if (fromIndex === undefined || toIndex === undefined) return;
      if (fromIndex === toIndex) return;

      const item = quickAccessItemsOrder.value.splice(fromIndex, 1)[0];
      quickAccessItemsOrder.value.splice(toIndex, 0, item);
    }

    function toggleQuickAccessIsSortable() {
      _quickAccessIsSortable.value = !_quickAccessIsSortable.value;
    }

    return {
      // State
      quickAccessItems,
      quickAccessIsSortable,
      quickAccessItemsOrder,

      // Actions
      moveQuickAccessItem,
      toggleQuickAccessIsSortable,
    };
  },
  { persist: true },
);
