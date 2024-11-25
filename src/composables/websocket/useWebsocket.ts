import { socketClient } from '@/socket';
import { useAuthStore } from '@/stores/auth.store';
import useToast from '../useToast';

export default function useWebsocket() {
  const authStore = useAuthStore();
  const toast = useToast();

  const isConnected = ref(socketClient.connected);

  function connect() {
    if (socketClient.connected) return;
    socketClient.connect();
  }

  function emit(event: string, data: any) {
    socketClient.emit(event, data);
  }

  function on(event: string, callback: (data: any) => void) {
    socketClient.on(event, callback);
  }

  function off(event: string, callback: (data: any) => void) {
    socketClient.off(event, callback);
  }

  onMounted(() => {
    // Register listeners for socket events
    socketClient.on('connect', () => {
      isConnected.value = true;
      console.log('Socket connected:', socketClient.connected);

      // Emit 'join' event if user is authenticated
      if (authStore.isAuthenticated) {
        socketClient.emit('join', `user:${authStore.user?.id}`);
      }
    });

    socketClient.onAny((event, ...args) => {
      console.log('Socket event:', event, args);
    });

    // Handle socket disconnection event
    socketClient.on('disconnect', () => {
      isConnected.value = false;
      console.log('Socket disconnected');
    });
  });

  onUnmounted(() => {
    // Unregister listeners for socket events
    socketClient.off('connect');
    socketClient.off('disconnect');
    socketClient.offAny();
  });

  return {
    socketClient,
    isConnected,
    connect,
    emit,
    on,
    off,
  };
}
