<script setup lang="ts">
// Imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRagnaClient } from '@/composables/useRagnaClient';
import getDaysInMonth from '@/utils/date';
import type { TokenUsage } from '@hopkins385/ragna-sdk';
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
const data = shallowRef<TokenUsage[] | null>(null);
const isLoading = ref(false);
const monthYear = reactive<{ month: string; year: string }>({
  month: (new Date().getMonth() + 1).toString(),
  year: new Date().getFullYear().toString(),
});

// Composables
const client = useRagnaClient();

// Computed
const formattedData = computed(() => {
  if (!data.value) {
    return null;
  }

  const result: Record<string, Array<{ tokens: number; price: string }>> = {};
  data.value.forEach((item: TokenUsage) => {
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
      result[item.llm.displayName] = Array.from({ length: 31 }, () => ({ tokens: 0, price: '0' }));
    }
    // Add tokens to the corresponding day
    result[item.llm.displayName][day - 1].tokens += item.totalTokens;
    // Add price (converting string to number, adding, then back to string)
    const currentPrice = parseFloat(result[item.llm.displayName][day - 1].price);
    const itemPrice = item.totalPrice;
    result[item.llm.displayName][day - 1].price = (currentPrice + itemPrice).toFixed(4);
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
      data: formattedData.value ? formattedData.value[name].map(item => item.tokens) : [],
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
      let totalPrice = 0;

      params.forEach((item: any) => {
        const value = Math.round(item.value);
        if (value === 0) {
          return;
        }

        const priceData = formattedData.value![item.seriesName][item.dataIndex].price;
        const price = parseFloat(priceData);
        totalPrice += price;

        tooltipText += `${item.marker} ${item.seriesName}: ${value} ($${price.toFixed(2)})<br/>`;
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
    const { tokenUsages } = await client.accountStats.fetchTokenHistory(payload);
    data.value = tokenUsages;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Hooks
watchEffect(async () => {
  await initData({ month: monthYear.month, year: monthYear.year });
});

/* Example fetch data response which is TokenUsage[]
[         {
            "promptTokens": 413,
            "completionTokens": 970,
            "totalTokens": 1383,
            "createdAt": "2025-04-08T14:15:48.536Z",
            "promptPrice": 0.0310,
            "completionPrice": 0.1455,
            "totalPrice": 0.1765,
            "llm": {
                "provider": "openai",
                "displayName": "GPT 4.5 (preview)"
            }
        },]
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
  <div class="h-4" id="spacer"></div>
  <Chart
    class="h-80 w-full max-w-3xl"
    :option="option"
    :loading="isLoading"
    theme="light"
    autoresize
  />
</template>
