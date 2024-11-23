<script setup lang="ts">
import BrandHeader from '@/components/brand/BrandHeader.vue';
import { socialAuthGoogleCallbackSchema } from '@/schemas/social-auth-google-callback.schema';
import { useAuthStore } from '@/stores/auth.store';
import SecureLogin from '@assets/illustrations/secure_login.svg?component';
import { LoaderIcon } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const validateQuery = (query: any) => {
  const result = socialAuthGoogleCallbackSchema.safeParse(query);
  if (!result.success) {
    throw new Error('Invalid query params');
  }
  return result.data;
};

onMounted(async () => {
  try {
    const validatedQuery = validateQuery(route.query);
    await authStore.socialGoogleLogin(validatedQuery);
    if (!authStore.isAuthenticated) {
      throw new Error('Failed to login');
    }
    await router.push({ name: 'home' });
  } catch (error) {
    console.error('[social auth login]', error);
    await router.push({ name: 'login' });
  }
});
</script>

<template>
  <div class="flex flex-col justify-center items-center h-screen">
    <BrandHeader />
    <div class="flex flex-col items-center">
      <SecureLogin class="size-60" />
      <LoaderIcon class="size-6 animate-spin" />
    </div>
  </div>
</template>
