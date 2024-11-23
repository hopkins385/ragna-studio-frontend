import { io } from 'socket.io-client';
import { $axios } from './axios/axiosInstance';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socketClient = io(SOCKET_URL, {
  autoConnect: true,
  transports: ['websocket'],
  auth: async cb => {
    try {
      const response = await $axios.post('/socket/user-auth', {});
      if (response.status !== 201) throw new Error('Failed to authenticate');
      const data = response.data;
      cb({ token: data?.token ?? '' });
    } catch (error) {
      console.error('Failed to authenticate socket:', error);
      cb({ token: '' });
    }
  },
});
