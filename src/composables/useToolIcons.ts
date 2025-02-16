import { DatabaseIcon, Globe, Search } from 'lucide-vue-next';

export function useToolIcons() {
  const getToolIcon = (iconName: string | null | undefined) => {
    if (!iconName) {
      return Globe;
    }
    return {
      search: Search,
      web: Globe,
      database: DatabaseIcon,
    }[iconName];
  };

  return {
    getToolIcon,
  };
}
