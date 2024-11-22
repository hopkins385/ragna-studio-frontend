import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import veeConfigPlugin from './plugins/vee-validate.plugin';

import { setupAxiosJwtInterceptor } from './axios/setupJwt';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import { createHead } from '@unhead/vue';
// NProgress styles
import 'nprogress/nprogress.css';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const head = createHead();

app.use(head);
app.use(pinia);
app.use(router);
app.use(veeConfigPlugin);
app.use(VueDOMPurifyHTML);

setupAxiosJwtInterceptor();

app.mount('#app');
