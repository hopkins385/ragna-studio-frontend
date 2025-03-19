<script setup lang="ts">
import imageUrl from '@/assets/images/home2.jpg?q=100&format=webp&imagetools';
import { Input } from '@/components/ui/input';
import { useRagnaClient } from '@/composables/useRagnaClient';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { RouteName } from '@/router/enums/route-names.enum';
import ButtonLoading from '@ui/button/ButtonLoading.vue';
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

const client = useRagnaClient();
const router = useRouter();
const authStore = useAuthStore();

const open = true;
const orgName = ref('');
const isLoading = ref(false);

async function onSubmit() {
  isLoading.value = true;
  try {
    const res = await client.onboarding.onboardUser({ orgName: orgName.value });
    if (res.success !== true) {
      throw new Error('Failed to onboard user');
    }
    // refresh session
    await authStore.refreshAuth();
    // navigate to home
    await router.push({ name: RouteName.HOME });
  } catch (error) {
    console.error('Error during onboarding:', error);
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
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
