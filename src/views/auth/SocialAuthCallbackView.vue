<script setup lang="ts">
import { useAuthService } from '@/composables/services/useAuthService';
import type { GoogleAuthCallbackQuery } from '@/interfaces/auth/google-auth-callback.interface';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();

const { googleAuth } = useAuthService();
const authStore = useAuthStore();

// social auth callback
// route query params are used to get the token
const route = useRoute();
const query = route.query as unknown as GoogleAuthCallbackQuery;

onMounted(async () => {
  const data = await googleAuth({
    code: query.code,
    scope: query?.scope || undefined,
    authuser: query?.authuser || undefined,
    prompt: query?.prompt || undefined,
  });

  authStore.setAccessToken(data.accessToken, data.accessTokenExpiresAt);
  authStore.setRefreshToken(data.refreshToken);
  await authStore.fetchUser();
  await router.push({ name: 'home' });
});
</script>

<template>
  <div>{{ $route.params }}</div>
  <div>{{ query }}</div>
</template>
