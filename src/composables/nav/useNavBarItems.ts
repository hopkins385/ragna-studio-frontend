import type { NavItem } from '@/interfaces/nav/nav-item.interface';
import {
  adminRoutes,
  assistantRoutes,
  chatRoutes,
  collectionRoutes,
  defaultRoutes,
  documentRoutes,
  homeNavItem,
  imageGenRoutes,
  mediaManagerRoutes,
  settingsRoutes,
  workflowRoutes,
} from './nav-bar-items';

export function useNavBarItems() {
  const route = useRoute();

  const getDefaultItems = (): NavItem[] => {
    return defaultRoutes.value;
  };

  const dynamicNavItems: Ref<NavItem[]> = computed((): NavItem[] => {
    const items = [homeNavItem];

    const routePathStartsWith = route.path.split('/')[1];

    switch (routePathStartsWith) {
      case 'admin':
        items.push(...adminRoutes);
        break;
      case 'document':
        items.push(...documentRoutes);
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
    }

    return items;
  });

  return {
    dynamicNavItems,
    getDefaultItems,
  };
}
