import type { NavItem } from '@/common/interfaces/nav-item.interface';
import { AdminRouteName } from '@/modules/admin/enums/admin-route-names.enum';
import { RouteName } from '@/router/enums/route-names.enum';
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
  workflowItems,
} from './nav-bar-items';

export function useNavBarItems() {
  const route = useRoute();

  const getDefaultItems = (): NavItem[] => defaultItems.value;

  const dynamicNavItems: Ref<NavItem[]> = computed((): NavItem[] => {
    const items = [homeNavItem];

    switch (route.name) {
      case AdminRouteName.ADMIN_INDEX:
      case AdminRouteName.ADMIN_USER:
      case AdminRouteName.ADMIN_USER_CREATE:
      case AdminRouteName.ADMIN_USER_SHOW:
      case AdminRouteName.ADMIN_USER_EDIT:
      case AdminRouteName.ADMIN_TEAM:
      case AdminRouteName.ADMIN_TEAM_EDIT:
        items.push(...adminItems);
        break;
      case RouteName.KANBAN_INDEX:
        items.push(...kanbanItems);
        break;
      case RouteName.ARCHITECTURE_INDEX:
        items.push(...architectureItems);
        break;
      case RouteName.DOCUMENT_INDEX:
      case RouteName.DOCUMENT_SHOW:
        items.push(...documentItems);
        break;
      case RouteName.WORKFLOW_INDEX:
      case RouteName.WORKFLOW_CREATE:
      case RouteName.WORKFLOW_EDIT:
      case RouteName.WORKFLOW_SHOW:
        items.push(...workflowItems);
        break;
      case RouteName.CHAT_INDEX:
      case RouteName.CHAT_RECENT:
      case RouteName.CHAT_CREATE:
      case RouteName.CHAT_HISTORY:
      case RouteName.CHAT_SHOW:
        items.push(...chatItems.value);
        break;
      case RouteName.ASSISTANT_INDEX:
      case RouteName.ASSISTANT_CREATE:
      case RouteName.ASSISTANT_EDIT:
      case RouteName.ASSISTANT_TEMPLATE:
        items.push(...assistantItems);
        break;
      case RouteName.COLLECTION_INDEX:
      case RouteName.COLLECTION_CREATE:
      case RouteName.COLLECTION_SHOW:
      case RouteName.COLLECTION_MEDIA:
        items.push(...collectionItems);
        break;
      case RouteName.MEDIA_INDEX:
      case RouteName.MEDIA_UPLOAD:
      case RouteName.MEDIA_GOOGLE_DRIVE_INDEX:
      case RouteName.MEDIA_GOOGLE_DRIVE_CALLBACK:
      case RouteName.MEDIA_GOOGLE_DRIVE_SHOW:
      case RouteName.MEDIA_ONE_DRIVE:
        items.push(...mediaManagerItems);
        break;
      // case 'settings':
      //   items.push(...settingsItems);
      //   break;
      case RouteName.TEXT_TO_IMAGE_INDEX:
      case RouteName.TEXT_TO_IMAGE_EDIT_INDEX:
      case RouteName.TEXT_TO_IMAGE_EDIT_RUN_IMAGE:
      case RouteName.TEXT_TO_IMAGE_EXPLORE:
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
