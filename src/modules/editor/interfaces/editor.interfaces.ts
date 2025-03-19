import type { Component } from 'vue';

export interface SidebarButton {
  icon: Component;
  action: () => any;
  tooltip?: string;
}
