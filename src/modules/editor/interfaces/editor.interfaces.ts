import type { Component } from 'vue';

export interface SidebarButton {
  name: string;
  icon: Component;
  action: () => any;
  tooltip?: string;
}
