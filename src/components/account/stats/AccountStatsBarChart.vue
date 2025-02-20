<script setup lang="ts">
import 'echarts';
import Chart, { THEME_KEY } from 'vue-echarts';

provide(THEME_KEY, 'light');

const rawData = [
  [100, 302, 301, 334, 390, 330, 320],
  [320, 132, 101, 134, 90, 230, 210],
  [220, 182, 191, 234, 290, 330, 310],
  [150, 212, 201, 154, 190, 330, 410],
  [820, 832, 901, 934, 1290, 1330, 1320],
];
const totalData: number[] = [];
for (let i = 0; i < rawData[0].length; ++i) {
  let sum = 0;
  for (let j = 0; j < rawData.length; ++j) {
    sum += rawData[j][i];
  }
  totalData.push(sum);
}

const grid = {
  left: 100,
  right: 100,
  top: 50,
  bottom: 50,
};

const defaultCategories = ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine'];

const categories = ref(defaultCategories);

const series = computed(() =>
  categories.value.map((name, sid) => {
    return {
      name,
      type: 'bar',
      stack: 'total',
      barWidth: '60%',
      label: {
        show: true,
        formatter: (params: any) => Math.round(params.value * 1000) / 10 + '%',
      },
      data: rawData[sid].map((d, did) => (totalData[did] <= 0 ? 0 : d / totalData[did])),
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
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  series: series.value,
}));

const removeCategory = (index: number) => {
  console.log('removeCategory', index);
  categories.value.splice(index, 1);
};

const addCategory = () => {
  console.log('addCategory');
  categories.value.push('New Category');
};
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <button @click="addCategory" class="btn btn-primary">Add Category</button>
      <button @click="removeCategory(categories.length - 1)" class="btn btn-danger">
        Remove Category
      </button>
    </div>
  </div>
  <Chart class="h-96" :option="option" autoresize />
</template>
