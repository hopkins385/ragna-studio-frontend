<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useNavBarStore } from '@/stores/nav-bar.store';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { useMousePressed } from '@vueuse/core';
import {
  BotIcon,
  MessagesSquareIcon,
  ArchiveIcon,
  HomeIcon,
  WorkflowIcon,
  DatabaseIcon,
  CloudUploadIcon,
  ChevronRightIcon,
  SettingsIcon,
  Building2Icon,
  UsersIcon,
  FolderKanbanIcon,
  BriefcaseBusinessIcon,
  UserIcon,
  SpeechIcon,
  ImageIcon,
  type LucideProps,
  PaintbrushVerticalIcon,
  CompassIcon,
  PlusCircleIcon,
  HistoryIcon,
  FolderIcon,
} from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';
import NavLink from './NavLink.vue';
import { Separator } from '@ui/separator';
import NavUserMenu from './NavUserMenu.vue';
import BrandLogo from '../brand/BrandLogo.vue';

interface NavItem {
  icon: FunctionalComponent<LucideProps, {}, any, {}> | null;
  path: string;
  label: string;
  hidden: boolean | null;
  children: NavItem[];
}

enum UserRoles {
  ADMIN = 'admin',
  // Additional roles...
}

const navBarRef = ref(null);
const navBarResizerRef = ref(null);

const route = useRoute();

const navBar = useNavBarStore();
const workspaceStore = useWorkspaceStore();
const authStore = useAuthStore();

const homeNavItem: NavItem = {
  icon: HomeIcon,
  path: '/',
  label: 'Home',
  hidden: false,
  children: [],
};

const spacerNavItem: NavItem = {
  icon: null,
  path: '',
  label: '',
  hidden: false,
  children: [],
};

const defaultRoutes = computed((): NavItem[] => [
  {
    icon: WorkflowIcon,
    path: '/workflow',
    label: 'Workflows',
    hidden: false,
    children: [],
  },
  {
    icon: ImageIcon,
    path: '/text-to-image',
    label: 'Image Gen',
    hidden: false,
    children: [],
  },
  {
    icon: MessagesSquareIcon,
    path: '/chat',
    label: 'Chat',
    hidden: false,
    children: [],
  },
  {
    icon: BotIcon,
    path: '/assistant',
    label: 'Agents',
    hidden: false,
    children: [],
  },
  {
    icon: DatabaseIcon,
    path: '/collection',
    label: 'Collections',
    hidden: false,
    children: [],
  },
  {
    icon: CloudUploadIcon,
    path: '/media',
    label: 'Uploads',
    hidden: false,
    children: [],
  },
  /*{
    icon: SpeechIcon,
    path: '/speech',
    label: 'Speech',
    hidden: false,
    children: [],
  },*/
]);

const workflowRoutes: NavItem[] = [
  {
    icon: PlusCircleIcon,
    path: '/workflow/create',
    label: 'Create',
    hidden: false,
    children: [],
  },
  {
    icon: WorkflowIcon,
    path: '/workflow',
    label: 'Workflows',
    hidden: false,
    children: [],
  },
];

const chatRoutes: NavItem[] = [
  {
    icon: PlusCircleIcon,
    path: '/chat/new',
    label: 'New',
    hidden: false,
    children: [],
  },
  {
    icon: MessagesSquareIcon,
    path: '/chat',
    label: 'Chat',
    hidden: false,
    children: [],
  },
  {
    icon: HistoryIcon,
    path: '/chat/history',
    label: 'History',
    hidden: false,
    children: [],
  },
];

const assistantRoutes: NavItem[] = [
  {
    icon: PlusCircleIcon,
    path: '/assistant/create',
    label: 'Create',
    hidden: false,
    children: [],
  },
  {
    icon: BotIcon,
    path: '/assistant',
    label: 'Agents',
    hidden: false,
    children: [],
  },
];

const collectionRoutes: NavItem[] = [
  {
    icon: PlusCircleIcon,
    path: '/collection/create',
    label: 'Create',
    hidden: false,
    children: [],
  },
  {
    icon: DatabaseIcon,
    path: '/collection',
    label: 'Collections',
    hidden: false,
    children: [],
  },
];

const mediaManagerRoutes: NavItem[] = [
  {
    icon: FolderIcon,
    path: '/media',
    label: 'Manager',
    hidden: false,
    children: [],
  },
  {
    icon: CloudUploadIcon,
    path: '/media/upload',
    label: 'Uploads',
    hidden: false,
    children: [],
  },
];

const settingsRoutes: NavItem[] = [
  {
    icon: SettingsIcon,
    path: '/settings',
    label: 'Settings',
    hidden: false,
    children: [
      {
        icon: UserIcon,
        path: '/settings/profile',
        label: 'My Profile',
        hidden: false,
        children: [],
      },
    ],
  },
  {
    icon: Building2Icon,
    path: '/settings/organization',
    label: 'Organization',
    hidden: false,
    children: [
      {
        icon: Building2Icon,
        path: '/settings/organization',
        label: 'Overview',
        hidden: false,
        children: [],
      },
      {
        icon: UsersIcon,
        path: '/settings/organization/members',
        label: 'Members',
        hidden: false,
        children: [],
      },
      {
        icon: SettingsIcon,
        path: '/settings/organization/billing',
        label: 'Billing',
        hidden: false,
        children: [],
      },
      {
        icon: SettingsIcon,
        path: '/settings/organization/models',
        label: 'Models',
        hidden: false,
        children: [],
      },
      {
        icon: SettingsIcon,
        path: '/settings/organization/statistics',
        label: 'Statistics',
        hidden: false,
        children: [],
      },
      {
        icon: SettingsIcon,
        path: '/settings/organization/privacy',
        label: 'Privacy',
        hidden: false,
        children: [],
      },
    ],
  },
  {
    icon: BriefcaseBusinessIcon,
    path: '/settings/workspaces',
    label: 'Workspaces',
    hidden: false,
    children: [
      {
        icon: BriefcaseBusinessIcon,
        path: '/settings/workspaces',
        label: 'Overview',
        hidden: false,
        children: [],
      },
      {
        icon: UsersIcon,
        path: '/settings/workspace/users',
        label: 'Users',
        hidden: false,
        children: [],
      },
    ],
  },
  {
    icon: FolderKanbanIcon,
    path: '/settings/projects',
    label: 'Projects',
    hidden: false,
    children: [
      {
        icon: FolderKanbanIcon,
        path: '/settings/projects',
        label: 'Overview',
        hidden: false,
        children: [],
      },
      {
        icon: UsersIcon,
        path: '/settings/project/users',
        label: 'Users',
        hidden: false,
        children: [],
      },
    ],
  },
];

const adminRoutes: NavItem[] = [
  // spacerNavItem,
  {
    icon: SettingsIcon,
    path: '/admin',
    label: 'Admin',
    hidden: false,
    children: [],
  },
];

const imageGenRoutes: NavItem[] = [
  {
    icon: PaintbrushVerticalIcon,
    path: '/text-to-image',
    label: 'Create',
    hidden: false,
    children: [],
  },
  // Explore
  {
    icon: CompassIcon,
    path: '/text-to-image/explore',
    label: 'Explore',
    hidden: false,
    children: [],
  },
  // Assets
  /*{
      icon: FoldersIcon,
      path: '/text-to-image/assets',
      label: 'Assets',
      hidden: false,
      children: [],
    },*/
];

const isAdmin = computed(
  () => authStore.user?.roles?.includes(UserRoles.ADMIN) ?? false,
);

const navItems: Ref<NavItem[]> = computed((): NavItem[] => {
  const items = [homeNavItem]; // , spacerNavItem

  const routePathStartsWith = route.path.split('/')[1];

  switch (routePathStartsWith) {
    case 'admin':
      items.push(...adminRoutes);
      break;
    case 'workflow':
      items.push(...workflowRoutes);
      break;
    case 'chat':
      items.push(...chatRoutes);
      break;
    case 'assistant':
      items.push(...assistantRoutes);
      break;
    case 'collection':
      items.push(...collectionRoutes);
      break;
    case 'media':
      items.push(...mediaManagerRoutes);
      break;
    case 'settings':
      items.push(...settingsRoutes);
      break;
    case 'text-to-image':
      items.push(...imageGenRoutes);
      break;
    default:
      items.push(...defaultRoutes.value);

      if (isAdmin.value) {
        items.push(...adminRoutes);
      }
  }

  /*if (route.path.startsWith('/settings')) {
    items.push(...settingsRoutes);
  } else if (route.path.startsWith('/text-to-image')) {
    items.push(...imageGenRoutes);
  } else {
    items.push(...defaultRoutes.value);

    if (isAdmin.value) {
      items.push(...adminRoutes);
    }
  }*/

  return items;
});

const { pressed } = useMousePressed({ target: navBarResizerRef });

function onFullScreenClick() {
  const elem = document.documentElement;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    elem.requestFullscreen();
  }
}

watch(pressed, isPressed => {
  if (isPressed && navBar.isOpen) {
    addEventListener('mousemove', navBar.setWidth);
  } else {
    removeEventListener('mousemove', navBar.setWidth);
  }
});
</script>

<template>
  <div
    ref="navBarRef"
    class="relative flex shrink-0 flex-col justify-between border-r bg-stone-100 transition-all duration-300 ease-out"
    :style="{ width: navBar.isFullClosed ? 0 : `${navBar.width}rem` }"
  >
    <div
      ref="navBarResizerRef"
      class="absolute right-0 top-0 z-10 h-full"
      :class="{
        'bg-blue-600': pressed && navBar.isOpen,
        'cursor-ew-resize hover:bg-blue-600': navBar.isOpen,
      }"
      style="width: 0.25rem"
    ></div>
    <div
      class="relative h-full overflow-y-hidden transition-opacity duration-200 ease-in-out"
      :class="{
        'opacity-0': navBar.isFullClosed,
      }"
    >
      <div id="spacer" class="h-4"></div>
      <div class="flex h-full flex-col">
        <ul class="space-y-2">
          <template v-for="(item, index) in navItems" :key="index">
            <li v-if="item.path" class="nav-item">
              <NavLink
                v-if="item.path"
                :active="route.path === item.path"
                :to="item.path"
                :icon="item.icon"
                :label="item.label"
                :label-visible="navBar.isOpen"
              />
              <!-- children disabled -->
            </li>
            <li v-else class="px-5">
              <Separator class="bg-stone-200" />
            </li>
          </template>
        </ul>
      </div>
      <!-- Nav toggle control -->
    </div>
    <!-- Nav User Menu -->
  </div>
</template>

<style scoped>
.nav-text {
  @apply text-sm;
}

.nav-item {
  @apply flex min-h-8 flex-col justify-center border-0 px-2 py-0;
  @apply nav-text;
}

.nav-item-child {
  @apply pl-4 pt-0;
}
</style>
