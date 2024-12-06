import './assets/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import veeConfigPlugin from './plugins/vee-validate.plugin';
import router from './router';

import { setupAxiosJwtInterceptor } from './axios/setupJwt';

import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueDOMPurifyHTML from 'vue-dompurify-html';

import { createHead } from '@unhead/vue';
// NProgress styles
import 'nprogress/nprogress.css';

// CASL
import { abilitiesPlugin } from '@casl/vue';
import { ability } from './services/ability.service';

// i18n
import messages from '@intlify/unplugin-vue-i18n/messages';

const i18n = createI18n({
  legacy: false,
  locale: 'de-DE',
  fallbackLocale: 'en-UK',
  messages,
});

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const head = createHead();

app.use(i18n);
app.use(head);
app.use(pinia);
app.use(router);
app.use(veeConfigPlugin);
app.use(VueDOMPurifyHTML);
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
});

setupAxiosJwtInterceptor();

app.mount('#app');
