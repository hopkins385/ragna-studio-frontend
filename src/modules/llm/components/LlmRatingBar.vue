<script setup lang="ts">
interface Props {
  percentage: number; // value between 0 and 100
}

const props = defineProps<Props>();

const barWidth = computed(() => `${props.percentage}%`);
</script>

<template>
  <div
    class="flex items-center space-x-2"
    role="progressbar"
    :aria-valuenow="percentage"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="Rating Percentage"
  >
    <div class="w-full h-2 bg-stone-300 rounded-full overflow-hidden">
      <div
        class="h-full bg-green-600 transition-all duration-300 rounded-full"
        :style="{ width: barWidth }"
      ></div>
    </div>
    <span class="text-sm text-gray-600 min-w-[3rem]">{{ percentage }}%</span>
  </div>
</template>
