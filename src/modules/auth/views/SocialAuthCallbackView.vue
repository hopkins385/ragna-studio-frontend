<script setup lang="ts">
import AuthProcessing from '@/modules/auth/components/AuthProcessing.vue';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { RouteName } from '@/router/enums/route-names.enum';

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
    await router.push({ name: RouteName.HOME });
  } catch (error) {
    console.error('[social auth login]', error);
    await router.push({ name: RouteName.LOGIN });
  }
});
</script>

<template>
  <AuthProcessing />
</template>
