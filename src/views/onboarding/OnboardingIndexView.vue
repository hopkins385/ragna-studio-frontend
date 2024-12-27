<script setup lang="ts">
import imageUrl from '@/assets/images/home2.jpg?q=100&format=webp&imagetools';
import ButtonLoading from '@/components/button/ButtonLoading.vue';
import { Input } from '@/components/ui/input';
import { useOnboardingService } from '@/composables/services/useOnboardingService';
import { useAuthStore } from '@/stores/auth.store';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';

/**
 * Onboarding
 * Route: /onboarding
 */

const router = useRouter();
const authStore = useAuthStore();

const { onboardUser } = useOnboardingService();

const open = true;
const orgName = ref('');
const isLoading = ref(false);

async function onSubmit() {
  isLoading.value = true;
  await onboardUser({ orgName: orgName.value })
    .then(async res => {
      if (res.success !== true) {
        throw new Error('Failed to onboard user');
      }
      // refresh session
      await authStore.refreshAuth();
      // navigate to user profile
      await router.push({ name: 'home' });
    })
    .catch((error: any) => console.error(error))
    .finally(() => (isLoading.value = false));
}

const backgroundStyles = computed(() => {
  return {
    // backgroundImage: `linear-gradient(rgba(0,0,0,.20),rgba(0,0,0,.20)), url('${imageUrl}')`,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.4), rgba(255,255,255,0.4)), url('${imageUrl}')`,
    backgroundSize: 'cover',
    // opacity: 0.4,
  };
});
</script>

<template>
  <!--
  <div class="flex justify-center">
    <div class="space-y-2 p-10">
      <div>Hello, {{ authStore.user?.name ?? 'User' }}</div>
      <div>Please enter your organisation name:</div>
      <div>
        <form class="space-y-2" @submit.prevent="onSubmit">
          <Input v-model="orgName" type="text" />
          <ButtonLoading :loading="isLoading" type="submit">
            Submit
          </ButtonLoading>
        </form>
      </div>
    </div>
  </div>
  -->
  <div>
    <div class="h-60 bg-blue-200 p-5 bg-center" :style="backgroundStyles"></div>
    <div class="custom-shadow p-5 min-h-full"></div>
  </div>
  <Dialog :open="open">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {{ $t('onboard.hello', { name: authStore.user?.name ?? 'User' }) }}
        </DialogTitle>
        <DialogDescription>
          {{ $t('onboard.subtitle') }}
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-2 p-10 w-full">
        <div>{{ $t('onboard.form.label') }}:</div>
        <div>
          <form
            class="space-y-2 flex flex-col justify-center items-center"
            @submit.prevent="onSubmit"
          >
            <Input v-model="orgName" type="text" />
            <ButtonLoading :loading="isLoading" type="submit" class="self-end">
              {{ $t('form.button.save') }}
            </ButtonLoading>
          </form>
        </div>
      </div>

      <DialogFooter> </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.custom-shadow {
  box-shadow: 0px -5px 5px rgba(0, 0, 0, 0.1);
}
</style>
