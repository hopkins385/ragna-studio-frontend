import type { LucideProps } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';

export interface NavItem {
  icon: FunctionalComponent<LucideProps, {}, any, {}> | null;
  path: string;
  label: string;
  hidden: boolean | null;
  children: NavItem[];
}
