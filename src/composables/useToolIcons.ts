import { BookIcon, DatabaseIcon, Globe, PanelsTopLeftIcon, Search } from 'lucide-vue-next';

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
    }[iconName];
  };

  return {
    getToolIcon,
  };
}
