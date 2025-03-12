<script setup lang="ts">
// Imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { accountStatsService } from '@/modules/account/account-stats.service';
import type { TokenUsage } from '@/modules/account/interfaces';
import getDaysInMonth from '@/utils/date';
import { BarChart, type BarSeriesOption } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import Chart from 'vue-echarts';
// import 'echarts';

use([GridComponent, LegendComponent, TooltipComponent, BarChart, CanvasRenderer]);

const grid = {
  left: 80,
  right: 80,
  top: 50,
  bottom: 50,
};

const defaultCategories = ['Claude 3.5 Sonnet', 'Mistral Large', 'GPT-4o', 'GPT-4o Mini'];
const barColorScheme = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE'];

// Props
// Emits

// Refs
const data = ref<TokenUsage[] | null>(null);
const isLoading = ref(false);
const monthYear = reactive<{ month: string; year: string }>({
  month: (new Date().getMonth() + 1).toString(),
  year: new Date().getFullYear().toString(),
});

// Composables

// Computed
const formattedData = computed(() => {
  if (!data.value) {
    return null;
  }

  const result: Record<string, number[]> = {};
  data.value.forEach(item => {
    const monthYearMonth = parseInt(monthYear.month);
    const monthYearYear = parseInt(monthYear.year);
    const date = new Date(item.createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (month !== monthYearMonth || year !== monthYearYear) {
      return;
    }

    if (!result[item.llm.displayName]) {
      result[item.llm.displayName] = Array.from({ length: 31 }, () => 0);
    }
    result[item.llm.displayName][day - 1] += item.totalTokens;
  });

  return result;
});

const categories = computed(() => {
  if (!formattedData.value) {
    return defaultCategories;
  }
  return Object.keys(formattedData.value);
});

const daysOfMonth = computed(() => {
  const { daysArrayString } = getDaysInMonth({ month: monthYear.month, year: monthYear.year });
  return daysArrayString;
});

const series = computed<BarSeriesOption[]>(() =>
  categories.value.map((name, sid) => {
    return {
      name,
      color: barColorScheme[sid],
      type: 'bar',
      stack: 'total',
      barWidth: '90%',
      label: {
        show: false,
        formatter: (params: any) => Math.round(params.value * 1000) / 10 + '%',
      },
      data: formattedData.value ? formattedData.value[name] : [],
    };
  }),
);

const option = computed(() => ({
  legend: {
    selectedMode: false,
  },
  grid,
  yAxis: {
    type: 'value',
  },
  xAxis: {
    type: 'category',
    data: daysOfMonth.value,
  },
  series: series.value,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: (params: any) => {
      let tooltipText = params[0].axisValue + '<br/>';
      params.forEach((item: any) => {
        const value = Math.round(item.value);
        if (value === 0) {
          return;
        }
        tooltipText += item.marker + ' ' + item.seriesName + ': ' + value + '<br/>';
      });
      return tooltipText;
    },
  },
}));

// Functions
const initData = async (payload: { month: string; year: string }) => {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  try {
    const { tokenUsages } = await accountStatsService.fetchTokenHistory(payload);
    data.value = tokenUsages;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Hooks
watch(
  monthYear,
  async () => {
    await initData({ month: monthYear.month, year: monthYear.year });
  },
  { immediate: true },
);

/* Example fetch data response which is TokenUsage[]
[ { "totalTokens": 486, "createdAt": "2025-02-19T17:15:04.665Z", "llm": { "provider": "openai", "displayName": "GPT-4o" } }, { "totalTokens": 14638, "createdAt": "2025-02-19T17:17:40.458Z", "llm": { "provider": "openai", "displayName": "GPT-4o" } }, { "totalTokens": 458, "createdAt": "2025-02-19T17:42:13.154Z", "llm": { "provider": "openai", "displayName": "o3-mini" } }, { "totalTokens": 578, "createdAt": "2025-02-20T11:29:14.772Z", "llm": { "provider": "openai", "displayName": "GPT-4o" } }, { "totalTokens": 625, "createdAt": "2025-02-20T15:18:02.056Z", "llm": { "provider": "openai", "displayName": "GPT-4o" } }, { "totalTokens": 645, "createdAt": "2025-02-20T15:18:18.326Z", "llm": { "provider": "openai", "displayName": "GPT-4o" } }, { "totalTokens": 656, "createdAt": "2025-02-20T15:18:31.649Z", "llm": { "provider": "openai", "displayName": "GPT-4o" } }, { "totalTokens": 694, "createdAt": "2025-02-20T15:18:51.196Z", "llm": { "provider": "openai", "displayName": "GPT-4o" } } ]
*/
</script>

<template>
  <div class="items-center pb-5">
    <div></div>
    <div class="flex items-center gap-2 pl-4">
      <div class="w-16">
        <!-- Change year -->
        <Select v-model:model-value="monthYear.month">
          <SelectTrigger>
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="month in 12" :key="month" :value="month.toString()">
              {{ month }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div class="w-24">
        <Select v-model:model-value="monthYear.year">
          <SelectTrigger>
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent class="w-24">
            <SelectItem v-for="year in 3" :key="year" :value="(2022 + year).toString()">
              {{ 2022 + year }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
  <div class="flex items-center justify-between pb-8 pl-4">
    <div>
      <h2 class="text-2xl font-semibold">
        {{ $t('account.stats.tokenUsage') }}
      </h2>
    </div>
  </div>
  <Chart
    class="h-80 w-full max-w-3xl"
    :option="option"
    :loading="isLoading"
    theme="light"
    autoresize
  />
</template>
