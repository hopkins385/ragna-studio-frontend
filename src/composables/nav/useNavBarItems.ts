import type { NavItem } from '@/interfaces/nav/nav-item.interface';
import {
  adminItems,
  architectureItems,
  assistantItems,
  chatItems,
  collectionItems,
  defaultItems,
  documentItems,
  homeNavItem,
  imageGenItems,
  kanbanItems,
  mediaManagerItems,
  settingsItems,
  testItems,
  workflowItems,
} from './nav-bar-items';

export function useNavBarItems() {
  const route = useRoute();

  const getDefaultItems = (): NavItem[] => {
    return defaultItems.value;
  };

  const dynamicNavItems: Ref<NavItem[]> = computed((): NavItem[] => {
    const items = [homeNavItem];

    const routePathStartsWith = route.path.split('/')[1];

    switch (routePathStartsWith) {
      case 'admin':
        items.push(...adminItems);
        break;
      case 'kanban':
        items.push(...kanbanItems);
        break;
      case 'architecture':
        items.push(...architectureItems);
        break;
      case 'test':
        items.push(...testItems);
        break;
      case 'document':
        items.push(...documentItems);
        break;
      case 'workflow':
        items.push(...workflowItems);
        break;
      case 'chat':
        items.push(...chatItems);
        break;
      case 'assistant':
        items.push(...assistantItems);
        break;
      case 'collection':
        items.push(...collectionItems);
        break;
      case 'media':
        items.push(...mediaManagerItems);
        break;
      case 'settings':
        items.push(...settingsItems);
        break;
      case 'text-to-image':
        items.push(...imageGenItems);
        break;
      default:
        items.push(...defaultItems.value);
    }

    return items;
  });

  return {
    dynamicNavItems,
    getDefaultItems,
  };
}
