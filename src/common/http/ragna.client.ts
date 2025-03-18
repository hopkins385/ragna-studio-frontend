import { RagnaClient } from '@/sdk/ragnaClient';
import type { Plugin } from 'vue';

const ragnaClient = new RagnaClient();

export const getRagnaClient = () => {
  return ragnaClient;
};

const ragnaClientPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$ragnaClient = ragnaClient;
  },
};
export default ragnaClientPlugin;
export { ragnaClient };
