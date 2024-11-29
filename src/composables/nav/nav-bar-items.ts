import {
  BotIcon,
  MessagesSquareIcon,
  HomeIcon,
  WorkflowIcon,
  DatabaseIcon,
  CloudUploadIcon,
  SettingsIcon,
  Building2Icon,
  UsersIcon,
  FolderKanbanIcon,
  BriefcaseBusinessIcon,
  UserIcon,
  ImageIcon,
  PaintbrushVerticalIcon,
  CompassIcon,
  PlusCircleIcon,
  HistoryIcon,
  FolderIcon,
} from 'lucide-vue-next';
import type { NavItem } from '@/interfaces/nav/nav-item.interface';

export const homeNavItem: NavItem = {
  icon: HomeIcon,
  path: '/',
  label: 'Home',
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

export const defaultRoutes = [
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
    label: 'Files',
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
];

export const workflowRoutes: NavItem[] = [
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

export const chatRoutes: NavItem[] = [
  {
    icon: PlusCircleIcon,
    path: '/assistant',
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

export const assistantRoutes: NavItem[] = [
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

export const collectionRoutes: NavItem[] = [
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

export const mediaManagerRoutes: NavItem[] = [
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

export const settingsRoutes: NavItem[] = [
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

export const adminRoutes: NavItem[] = [
  // spacerNavItem,
  {
    icon: SettingsIcon,
    path: '/admin',
    label: 'Admin',
    hidden: false,
    children: [],
  },
];

export const imageGenRoutes: NavItem[] = [
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
