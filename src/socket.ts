import { io } from 'socket.io-client';
import { $axios } from './axios/axiosInstance';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const socketClient = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 3,
  transports: ['websocket'],
  auth: async cb => {
    try {
      // get token from session storage
      const sessionToken = sessionStorage.getItem('socketToken');
      if (sessionToken) {
        cb({ token: sessionToken });
        return;
      }
      const { status, data } = await $axios.post('/socket/user-auth', {});
      if (status !== 201 || !data.token) {
        throw new Error('Failed to authenticate');
      }
      sessionStorage.setItem('socketToken', data.token);
      cb({ token: data.token });
    } catch (error) {
      console.error('Failed to authenticate socket:', error);
      cb({ token: '' });
    }
  },
});
