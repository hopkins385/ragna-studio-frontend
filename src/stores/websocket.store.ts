import useToast from '@/composables/useToast';
import { socketClient } from '@/socket';
import { useAuthStore } from '@/stores/auth.store';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWebSocketStore = defineStore('websocket', () => {
  const toast = useToast();
  const authStore = useAuthStore();

  const isConnected = ref(socketClient.connected);

  function connect() {
    if (socketClient.connected) return;
    setupDefaultListeners();
    socketClient.connect();
  }

  function disconnect() {
    if (!socketClient.connected) return;
    cleanupListeners();
    socketClient.disconnect();
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

  function joinUserRoom() {
    if (authStore.isAuthenticated && authStore.user) {
      emit('join', `user:${authStore.user.id}`);
    }
  }

  function leaveUserRoom() {
    if (authStore.isAuthenticated && authStore.user) {
      emit('leave', `user:${authStore.user.id}`);
    }
  }

  function setupDefaultListeners() {
    socketClient.on('connect', () => {
      joinUserRoom();
      isConnected.value = true;
      console.log('Socket connected:', socketClient.connected);
    });

    socketClient.onAny((event, ...args) => {
      console.log('Socket event:', event, args);
    });

    socketClient.on('disconnect', () => {
      leaveUserRoom();
      isConnected.value = false;
      toast.error({
        description: 'Lost connection to the event server. Please refresh the page to reconnect.',
      });
      console.log('Socket disconnected');
    });

    socketClient.on('connect_error', error => {
      console.error('Socket connection error:', error);
    });
    socketClient.on('connect_timeout', timeout => {
      console.error('Socket connection timeout:', timeout);
    });
    socketClient.on('reconnect', attempt => {
      console.log('Socket reconnected:', attempt);
    });
  }

  function addListener(event: string, callback: (data: any) => void) {
    socketClient.on(event, callback);
  }

  function removeListener(event: string, callback: (data: any) => void) {
    socketClient.off(event, callback);
  }

  function cleanupListeners() {
    socketClient.off('connect_error');
    socketClient.off('connect_timeout');
    socketClient.off('reconnect');
    socketClient.off('connect');
    socketClient.off('disconnect');
    socketClient.offAny();
  }

  return {
    isConnected,
    connect,
    disconnect,
    emit,
    on,
    off,
    setupDefaultListeners,
    addListener,
    removeListener,
    cleanupListeners,
    joinUserRoom,
    leaveUserRoom,
  };
});
