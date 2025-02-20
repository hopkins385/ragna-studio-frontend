<script setup lang="ts">
import { BarChart } from '@ui/chart-bar';

const data = [
  {
    name: 'Jan',
    total: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: 'Feb',
    total: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: 'Mar',
    total: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: 'Apr',
    total: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: 'May',
    total: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: 'Jun',
    total: Math.floor(Math.random() * 2000) + 500,
  },
  {
    name: 'Jul',
    total: Math.floor(Math.random() * 2000) + 500,
  },
];
</script>

<template>
  <BarChart
    index="name"
    type="grouped"
    :data="data"
    :show-x-axis="true"
    :show-y-axis="true"
    :show-grid-line="true"
    :show-legend="true"
    :categories="['total']"
    :y-formatter="
      (tick, i) => {
        return typeof tick === 'number'
          ? `$ ${new Intl.NumberFormat('de').format(tick).toString()}`
          : '';
      }
    "
    :rounded-corners="4"
    :colors="['darkblue', 'orange', 'red']"
  />
</template>
