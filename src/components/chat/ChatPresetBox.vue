<script setup lang="ts">
import {
  ChefHatIcon,
  ClipboardList,
  CodeSquare,
  FileTextIcon,
  GiftIcon,
  HelpCircleIcon,
  MapIcon,
  ScrollTextIcon,
  ShoppingBasketIcon,
  ShoppingCartIcon,
} from 'lucide-vue-next';

interface ChatPresetBoxProps {
  title: string;
  iconName: string;
}

defineProps<ChatPresetBoxProps>();

function getIcon(name: string) {
  return (
    {
      help: HelpCircleIcon,
      fileText: FileTextIcon,
      basket: ShoppingBasketIcon,
      shopping: ShoppingCartIcon,
      gift: GiftIcon,
      map: MapIcon,
      text: ScrollTextIcon,
      clipboard: ClipboardList,
      code: CodeSquare,
      cook: ChefHatIcon,
    }[name] || {}
  );
}
</script>

<template>
  <div
    class="h-34 max-w-72 cursor-pointer overflow-hidden rounded-lg border bg-white p-5 text-sm shadow-sm hover:shadow-md"
  >
    <div class="flex items-center space-x-3 pb-2">
      <div>
        <component :is="getIcon(iconName)" class="size-5 text-gray-500" />
      </div>
      <div>{{ title }}</div>
    </div>
    <slot />
  </div>
</template>
