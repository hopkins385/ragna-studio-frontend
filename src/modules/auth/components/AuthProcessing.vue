<script setup lang="ts">
import BrandHeader from '@/components/brand/BrandHeader.vue';
import ErrorAlert from '@/components/error/ErrorAlert.vue';
import { LoaderIcon } from 'lucide-vue-next';
import SecureLogin from '~icons/illustrations/secure_login';

const props = defineProps<{
  errorMessage?: string;
}>();

const showError = ref(false);

watch(
  () => props.errorMessage,
  value => {
    if (value) {
      showError.value = true;
    }
  },
);
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen">
    <div class="w-full max-w-xl">
      <ErrorAlert :model-value="showError" :message="errorMessage ?? 'Unknown Error'" />
    </div>
    <BrandHeader />
    <div class="flex flex-col items-center">
      <SecureLogin class="size-60" />
      <LoaderIcon v-if="!showError" class="size-6 animate-spin" />
    </div>
  </div>
</template>
