import { useAuthStore } from '@/modules/auth/stores/auth.store';
import { socketClient } from '@/socket';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useWebSocketStore = defineStore('websocket', () => {
  const auth = useAuthStore();
  const authStore = useAuthStore();

  const isConnected = ref(socketClient.connected);

  function connect() {
    // if (socketClient.connected) return;
    setupDefaultListeners();
    socketClient.connect();
  }

  function disconnect() {
    // if (!socketClient.connected) return;
    cleanupDefaultListeners();
    socketClient.disconnect();
  }

  function handleConnectEvent() {
    joinUserRoom();
    isConnected.value = true;
    console.log('Socket connected:', socketClient.connected);
  }

  function handleDisconnectEvent() {
    leaveUserRoom();
    isConnected.value = false;
    console.log('Socket disconnected:', socketClient.connected);
    if (auth.isAuthenticated && !socketClient.connected) {
      socketClient.connect();
      console.log('Attempting to reconnect socket');
      if (socketClient.connected) {
        handleConnectEvent();
      }
    } else {
      console.log('Socket disconnected, not reconnecting automatically');
    }
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
      // emit('join', `user:${authStore.user.id}`);
      joinRoom(`user:${authStore.user.id}`);
    }
  }

  function leaveUserRoom() {
    if (authStore.isAuthenticated && authStore.user) {
      // emit('leave', `user:${authStore.user.id}`);
      leaveRoom(`user:${authStore.user.id}`);
    }
  }

  function joinRoom(room: string) {
    emit('join', room);
  }
  function leaveRoom(room: string) {
    emit('leave', room);
  }

  function setupDefaultListeners() {
    socketClient.on('connect', handleConnectEvent);

    socketClient.onAny((event, ...args) => {
      console.log('Socket event:', event, args);
    });

    socketClient.on('disconnect', handleDisconnectEvent);

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

  function cleanupDefaultListeners() {
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
    addListener,
    removeListener,
    joinUserRoom,
    leaveUserRoom,
    setupDefaultListeners,
    cleanupDefaultListeners,
  };
});
