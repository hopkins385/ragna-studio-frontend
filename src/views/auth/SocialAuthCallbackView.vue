<script setup lang="ts">
import AuthProcessing from '@/components/auth/AuthProcessing.vue';
import { socialAuthGoogleCallbackSchema } from '@/schemas/social-auth-google-callback.schema';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const validateQuery = (query: any) => {
  const result = socialAuthGoogleCallbackSchema.safeParse(query);
  if (!result.success) {
    console.error('[social auth login]', result.error);
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
  <AuthProcessing />
</template>
