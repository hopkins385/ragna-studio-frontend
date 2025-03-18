import { ragnaClient } from '@/common/http/ragna.client';
import type { Plugin } from 'vue';

const ragnaClientPlugin: Plugin = {
  install(app) {
    app.config.globalProperties.$ragnaClient = ragnaClient;
  },
};
export default ragnaClientPlugin;
