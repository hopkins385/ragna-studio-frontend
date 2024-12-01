<script setup lang="ts">
import AuthProcessing from '@components/auth/AuthProcessing.vue';
import { useAuthStore } from '@stores/auth.store';

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

onMounted(async () => {
  const code = route.query.code?.toString();
  try {
    await authStore.socialGoogleLogin({ code });
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
