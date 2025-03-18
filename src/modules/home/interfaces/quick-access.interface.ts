import type { Component } from 'vue';

export interface QuickAccessItem {
  id: number;
  icon: Component;
  class: string;
  label: string;
  route: string;
}
