import { io } from 'socket.io-client';
import { $axios } from './axios/axiosInstance';

const URL =
  import.meta.env.NODE_ENV === 'production'
    ? undefined
    : 'http://localhost:3050';

export const socketClient = io(URL, {
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
