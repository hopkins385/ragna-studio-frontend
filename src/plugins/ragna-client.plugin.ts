import { getRagnaClient } from '@/common/http/ragna.client';
import type { Plugin } from 'vue';

const ragnaClientPlugin: Plugin = {
  install(app) {
    const client = getRagnaClient();
    app.config.globalProperties.$ragnaClient = client;
    app.provide('$ragnaClient', client);
  },
};
export default ragnaClientPlugin;
