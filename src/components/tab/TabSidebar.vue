<script setup lang="ts">
interface Tab {
  id: string;
  icon: any;
  label: string;
}

interface Props {
  tabs: Tab[];
  modelValue: string; // for v-model support
  errorTabs?: string[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const activeTab = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});
</script>

<template>
  <div class="grid grid-cols-3 gap-40">
    <div role="tablist" class="col-span-1">
      <ul class="space-y-2">
        <li v-for="tab in tabs" :key="tab.id">
          <button
            role="tab"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            :class="{
              'shadow-sm': activeTab === tab.id,
              'hover:bg-gray-100 border-transparent': activeTab !== tab.id,
              'border border-destructive': props.errorTabs?.includes(tab.id),
            }"
            class="w-full px-4 py-2 text-left transition flex items-center space-x-2 rounded-sm border"
            @click="activeTab = tab.id"
          >
            <component :is="tab.icon" class="size-4 stroke-1.5" />
            <span class="text-sm">{{ tab.label }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="col-span-2">
      <template v-for="tab in tabs" :key="tab.id">
        <div
          :id="`panel-${tab.id}`"
          role="tabpanel"
          :aria-labelledby="tab.id"
          :class="{
            hidden: activeTab !== tab.id,
            block: activeTab === tab.id,
          }"
        >
          <slot :name="tab.id" />
        </div>
      </template>
    </div>
  </div>
</template>
