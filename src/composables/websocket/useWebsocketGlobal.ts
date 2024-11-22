import { createSharedComposable } from '@vueuse/core';
import useWebsocket from './useWebsocket';

export const useWebsocketGlobal = createSharedComposable(useWebsocket);
