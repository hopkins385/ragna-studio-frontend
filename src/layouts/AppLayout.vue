<script setup lang="ts">
import { RouteName } from '@/router/enums/route-names.enum';
import DrawerPanel from '@components/drawer/DrawerPanel.vue';
import NavBar from '@components/nav/NavBar.vue';
import NavTopBar from '@components/nav/NavTopBar.vue';
import { Toaster } from '@components/ui/sonner';
import { useWebsocketGlobal } from '@composables/websocket/useWebsocketGlobal';
import { useAuthStore } from '@stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();
const socket = useWebsocketGlobal();

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
  titleTemplate: (title?: string) =>
    !title ? 'RAGNA Studio' : `${title} | RAGNA Studio`,
});

const joinUserRoom = () => {
  if (authStore.isAuthenticated && authStore.user) {
    socket.emit('join', `user:${authStore.user.id}`);
  }
};

const leaveUserRoom = () => {
  if (authStore.isAuthenticated && authStore.user) {
    socket.emit('leave', `user:${authStore.user.id}`);
  }
};

// Websocket connection
onMounted(() => {
  socket.socketClient.on('connect', joinUserRoom);
  socket.socketClient.on('disconnect', leaveUserRoom);
  socket.connect();
});

onUnmounted(() => {
  socket.socketClient.disconnect();
  socket.socketClient.off('connect', joinUserRoom);
  socket.socketClient.off('disconnect', leaveUserRoom);
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
        class="relative grow overflow-y-scroll overflow-x-hidden text-slate-800 bg-white shadow-lg border-l border-t rounded-xl"
        style="max-width: calc(100vw - 4.5rem)"
      >
        <slot />
      </div>
    </div>
  </body>
</template>
