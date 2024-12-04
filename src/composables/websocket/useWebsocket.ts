import { socketClient } from '@/socket';
import useToast from '../useToast';

export default function useWebsocket() {
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
    });

    socketClient.onAny((event, ...args) => {
      console.log('Socket event:', event, args);
    });

    // Handle socket disconnection event
    socketClient.on('disconnect', () => {
      isConnected.value = false;
      toast.error({
        description:
          'Lost connection to the event server. Please refresh the page to reconnect.',
      });
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
