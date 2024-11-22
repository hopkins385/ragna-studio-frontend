<script setup lang="ts">
import NavTopBar from '@/components/nav/NavTopBar.vue';
import { useAuthStore } from '@/stores/auth.store';
import NavBar from '@components/nav/NavBar.vue';
import { Toaster } from '@components/ui/sonner';

const router = useRouter();
const authStore = useAuthStore();

// Token refresh logic
const refreshTokens = async () => {
  try {
    await authStore.refreshAuth();
  } catch (error) {
    console.error('Failed to refresh tokens', error);
    router.push({ name: 'login' });
  }
};

const debouncedRefresh = useDebounceFn(refreshTokens, 300);

const handleVisibilityChange = () => {
  if (!document.hidden) {
    debouncedRefresh();
  }
};

// Handle visibility changes
useEventListener(document, 'visibilitychange', handleVisibilityChange);
useEventListener(window, 'focus', handleVisibilityChange);

useHead({
  titleTemplate: (title?: string) =>
    !title ? 'RAGNA Cloud' : `${title} | RAGNA Cloud`,
});
</script>

<template>
  <body class="bg-stone-50">
    <NavTopBar />
    <div class="flex overflow-hidden" style="height: calc(100vh - 3.5rem)">
      <!-- Toast -->
      <Toaster position="top-right" />
      <!-- NavBar -->
      <NavBar />
      <!-- Main -->
      <div
        id="main"
        class="relative grow overflow-y-scroll overflow-x-hidden text-slate-800 bg-white shadow-lg border-0"
        style="max-width: calc(100vw - 4.5rem)"
      >
        <slot />
      </div>
    </div>
  </body>
</template>
