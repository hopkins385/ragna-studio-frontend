<script setup lang="ts">
import BoxContainer from '@components/box/BoxContainer.vue';
import defaultImgUrl from '@images/bg_2_2.jpg?w=2000&q=100&format=webp&imagetools';

type BgPosition = 'top' | 'center' | 'bottom';

const props = defineProps<{
  imgUrl?: string;
  bgPosition?: BgPosition;
}>();

const bgPositionClass = computed(() => {
  switch (props.bgPosition) {
    case 'top':
      return 'bg-top';
    case 'center':
      return 'bg-center';
    case 'bottom':
      return 'bg-bottom';
    default:
      return 'bg-top';
  }
});
const backgroundStyles = computed(() => {
  return {
    backgroundImage: `url('${props.imgUrl || defaultImgUrl}')`,
  };
});
</script>

<template>
  <BoxContainer>
    <div
      class="flex min-h-20 overflow-hidden rounded-lg bg-cover bg-no-repeat p-8 pt-14 text-white"
      :class="bgPositionClass"
      :style="backgroundStyles"
    >
      <slot name="top" />
    </div>
    <div class="pt-3 pr-1 flex overflow-hidden rounded-lg">
      <slot name="bottom" />
    </div>
  </BoxContainer>
</template>
