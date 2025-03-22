import {
  BookIcon,
  DatabaseIcon,
  Globe,
  PanelsTopLeftIcon,
  PencilLineIcon,
  Search,
  TextIcon,
} from 'lucide-vue-next';

export function useToolIcons() {
  const getToolIcon = (iconName: string | null | undefined) => {
    if (!iconName) {
      return Globe;
    }
    return {
      search: Search,
      globe: Globe,
      database: DatabaseIcon,
      book: BookIcon,
      website: PanelsTopLeftIcon,
      pencil: TextIcon,
      brain: PencilLineIcon,
    }[iconName];
  };

  return {
    getToolIcon,
  };
}
