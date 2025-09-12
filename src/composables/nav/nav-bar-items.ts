import type { NavItem } from '@/common/interfaces/nav-item.interface';
import { useAiChatStore } from '@/modules/ai-chat/stores';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import {
  BotIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  CloudUploadIcon,
  DatabaseIcon,
  EllipsisIcon,
  FilePenIcon,
  FileTextIcon,
  FolderClockIcon,
  FolderIcon,
  FolderKanbanIcon,
  HomeIcon,
  ImageIcon,
  ImagePlusIcon,
  MessagesSquareIcon,
  MonitorCogIcon,
  NetworkIcon,
  PaintbrushVerticalIcon,
  PieChartIcon,
  PlusCircleIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
  WorkflowIcon,
} from 'lucide-vue-next';

const authStore = useAuthStore();
const chatStore = useAiChatStore();

export const homeNavItem: NavItem = {
  icon: HomeIcon,
  path: '/',
  label: 'nav.home',
  hidden: false,
  children: [],
};

export const spacerNavItem: NavItem = {
  icon: null,
  path: '',
  label: '',
  hidden: false,
  children: [],
};

const baseMoreMenuItems: NavItem[] = [
  // {
  //   icon: MessagesSquareIcon,
  //   path: '/chat',
  //   label: 'nav.chat',
  //   hidden: false,
  //   children: [],
  // },
  // {
  //   icon: ImageIcon,
  //   path: '/text-to-image',
  //   label: 'nav.textToImage',
  //   hidden: false,
  //   children: [],
  // },
  {
    icon: DatabaseIcon,
    path: '/collection',
    label: 'nav.collections',
    hidden: false,
    children: [],
  },
  {
    icon: FolderIcon,
    path: '/media',
    label: 'nav.media',
    hidden: false,
    children: [],
  },
  {
    icon: PieChartIcon,
    path: '/account/statistics',
    label: 'nav.analytics',
    hidden: false,
    children: [],
  },
];

export const defaultItems = computed((): NavItem[] => [
  {
    icon: WorkflowIcon,
    path: '/workflow',
    label: 'nav.workflows',
    hidden: false,
    children: [],
  },
  {
    icon: FileTextIcon,
    path: '/document',
    label: 'nav.documents',
    hidden: false,
    children: [],
  },
  {
    icon: MessagesSquareIcon,
    path: '/chat/recent',
    label: 'nav.chat',
    hidden: false,
    children: [],
  },
  {
    icon: ImageIcon,
    path: '/text-to-image',
    label: 'nav.textToImage',
    hidden: false,
    children: [],
  },
  {
    icon: BotIcon,
    path: '/assistant',
    label: 'nav.agents',
    hidden: false,
    children: [],
  },
  // {
  //   icon: DatabaseIcon,
  //   path: '/collection',
  //   label: 'nav.collections',
  //   hidden: false,
  //   children: [],
  // },
  // {
  //   icon: FolderIcon,
  //   path: '/media',
  //   label: 'nav.media',
  //   hidden: false,
  //   children: [],
  // },
  // {
  //   icon: PieChartIcon,
  //   path: '/analytics',
  //   label: 'nav.analytics',
  //   hidden: false,
  //   children: [],
  // },
  // {
  //   icon: KanbanSquareIcon,
  //   path: '/kanban',
  //   label: 'nav.kanban',
  //   hidden: false,
  //   children: [],
  // },
  // {
  //   icon: NetworkIcon,
  //   path: '/architecture',
  //   label: 'nav.architecture',
  //   hidden: false,
  //   children: [],
  // },
  // {
  //   icon: ListTodoIcon,
  //   path: '/test',
  //   label: 'nav.tests',
  //   hidden: false,
  //   children: [],
  // },
  // {
  //   icon: SpeechIcon,
  //   path: '/speech',
  //   label: 'Speech',
  //   hidden: false,
  //   children: [],
  // },
  {
    icon: EllipsisIcon,
    path: '',
    label: 'More',
    hidden: false,
    children: authStore.userHasAdminRole
      ? [...baseMoreMenuItems, ...adminItems]
      : baseMoreMenuItems,
  },
]);

export const workflowItems: NavItem[] = [
  {
    icon: PlusCircleIcon,
    path: '/workflow/create',
    label: 'nav.create',
    hidden: false,
    children: [],
  },
  {
    icon: WorkflowIcon,
    path: '/workflow',
    label: 'nav.workflows',
    hidden: false,
    children: [],
  },
];

export const documentItems: NavItem[] = [
  // {
  //   icon: PlusCircleIcon,
  //   path: '/document/create',
  //   label: 'nav.create',
  //   hidden: false,
  //   children: [],
  // },
  // {
  //   icon: FolderIcon,
  //   path: '/document/folders',
  //   label: 'nav.folders',
  //   hidden: false,
  //   children: [],
  // },
  {
    icon: FilePenIcon,
    path: '/document',
    label: 'nav.editor',
    hidden: false,
    children: [],
  },
];

export const chatItems = computed((): NavItem[] => [
  {
    icon: PlusCircleIcon,
    path: '/chat',
    label: 'nav.new',
    hidden: false,
    children: [],
  },
  {
    icon: MessagesSquareIcon,
    path: chatStore.chatId ? '/chat/' + chatStore.chatId : '/chat/recent',
    label: 'nav.chat',
    hidden: false,
    children: [],
  },
  {
    icon: FolderClockIcon,
    path: '/chat/history',
    label: 'nav.history',
    hidden: false,
    children: [],
  },
]);

export const assistantItems: NavItem[] = [
  {
    icon: PlusCircleIcon,
    path: '/assistant/create',
    label: 'nav.create',
    hidden: false,
    children: [],
  },
  /*{
    icon: LayoutTemplateIcon,
    path: '/assistant/template',
    label: 'nav.templates',
    hidden: false,
    children: [],
  },*/
  {
    icon: BotIcon,
    path: '/assistant',
    label: 'nav.agents',
    hidden: false,
    children: [],
  },
  /*{
    icon: HammerIcon,
    path: '/assistant/tool',
    label: 'nav.tools',
    hidden: false,
    children: [],
  },*/
];

export const collectionItems: NavItem[] = [
  {
    icon: PlusCircleIcon,
    path: '/collection/create',
    label: 'nav.create',
    hidden: false,
    children: [],
  },
  {
    icon: DatabaseIcon,
    path: '/collection',
    label: 'nav.collections',
    hidden: false,
    children: [],
  },
];

export const mediaManagerItems: NavItem[] = [
  {
    icon: FolderIcon,
    path: '/media',
    label: 'nav.media',
    hidden: false,
    children: [],
  },
  {
    icon: CloudUploadIcon,
    path: '/media/upload',
    label: 'nav.uploads',
    hidden: false,
    children: [],
  },
];

export const settingsItems: NavItem[] = [
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

export const adminItems: NavItem[] = [
  // spacerNavItem,
  {
    icon: MonitorCogIcon,
    path: '/admin',
    label: 'nav.admin',
    hidden: false,
    children: [],
  },
];

export const imageGenItems: NavItem[] = [
  {
    icon: PaintbrushVerticalIcon,
    path: '/text-to-image',
    label: 'nav.create',
    hidden: false,
    children: [],
  },
  {
    icon: ImagePlusIcon,
    path: '/text-to-image/edit',
    label: 'nav.edit',
    hidden: false,
    children: [],
  },
  // Explore
  /*{
    icon: FolderIcon,
    path: '/text-to-image/folders',
    label: 'nav.folders',
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

export const kanbanItems: NavItem[] = [
  {
    icon: FolderKanbanIcon,
    path: '/kanban',
    label: 'nav.kanban',
    hidden: false,
    children: [],
  },
];

export const architectureItems: NavItem[] = [
  {
    icon: NetworkIcon,
    path: '/architecture',
    label: 'nav.architecture',
    hidden: false,
    children: [],
  },
];
