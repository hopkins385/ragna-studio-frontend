import { Globe, Image, Map, Search } from 'lucide-vue-next';

export function useToolIcons() {
  const getToolIcon = (iconName: string | null | undefined) => {
    if (!iconName) {
      return Globe;
    }
    return {
      search: Search,
      web: Globe,
      image: Image,
      map: Map,
      directions: Map,
    }[iconName];
  };

  return {
    getToolIcon,
  };
}
