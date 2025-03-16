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
  iconColor: string;
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

function getColor(color: string) {
  return (
    {
      blue: 'stroke-blue-700',
      green: 'stroke-green-700',
      red: 'stroke-red-700',
      yellow: 'stroke-yellow-700',
      purple: 'stroke-purple-700',
    }[color] || {}
  );
}
</script>

<template>
  <div
    class="h-34 max-w-96 cursor-pointer overflow-hidden rounded-full border px-5 py-3 text-sm hover:shadow-md"
  >
    <div class="flex items-center space-x-3">
      <span>
        <component
          :is="getIcon(iconName)"
          :class="getColor(iconColor)"
          class="size-4 text-gray-500"
        />
      </span>
      <span>{{ title }}</span>
    </div>
  </div>
</template>
