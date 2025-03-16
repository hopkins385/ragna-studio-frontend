<script setup lang="ts">
import { useWebSocketStore } from '@/common/stores/websocket.store';
import { useAuthStore } from '@/modules/auth/stores/auth.store';
import EditorSidebar from '@/modules/editor/components/EditorSidebar.vue';
import { RouteName } from '@/router/enums/route-names.enum';
import DrawerPanel from '@components/drawer/DrawerPanel.vue';
import NavBar from '@components/nav/NavBar.vue';
import NavTopBar from '@components/nav/NavTopBar.vue';
import { Toaster } from '@components/ui/sonner';

const router = useRouter();
const authStore = useAuthStore();
const socket = useWebSocketStore();

// Token refresh logic
const getSession = async () => {
  try {
    await authStore.getSession();
  } catch (error) {
    console.error('Failed to refresh tokens', error);
    router.push({ name: RouteName.LOGIN });
  }
};

const debouncedRefresh = useDebounceFn(getSession, 300);

const handleVisibilityChange = () => {
  if (!document.hidden) {
    debouncedRefresh();
  }
};

// Handle visibility changes
useEventListener(document, 'visibilitychange', handleVisibilityChange);
useEventListener(window, 'focus', handleVisibilityChange);

useHead({
  titleTemplate: (title?: string) => (!title ? 'RAGNA Studio' : `${title} | RAGNA Studio`),
});

// Websocket connection
onMounted(() => {
  socket.connect();
});

onUnmounted(() => {
  socket.disconnect();
});
</script>

<template>
  <body class="bg-stone-50">
    <NavTopBar />
    <div class="flex overflow-hidden" style="height: calc(100vh - 3.5rem)">
      <!-- Toast -->
      <Toaster position="top-right" />
      <!-- Nav SideBar -->
      <NavBar />
      <!-- Drawer -->
      <DrawerPanel />
      <!-- Main -->
      <div
        id="main"
        ref="mainContainer"
        class="relative grow overflow-y-scroll overflow-x-hidden text-slate-800 bg-white shadow-lg border rounded-xl"
        style="max-width: calc(100vw - 4.5rem)"
      >
        <slot />
      </div>
      <EditorSidebar />
    </div>
  </body>
</template>
