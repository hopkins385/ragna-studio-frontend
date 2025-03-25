import './assets/css/main.css';

import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

import App from './App.vue';
import veeConfigPlugin from './plugins/vee-validate.plugin';

import router from './router';
import pinia from './store';

import VueDOMPurifyHTML from 'vue-dompurify-html';

import { createHead } from '@unhead/vue/client';
// NProgress styles
import 'nprogress/nprogress.css';

// CASL
import { abilitiesPlugin } from '@casl/vue';
import { ability } from './modules/ability/services/ability.service';

// i18n
import { registerModules } from '@/register-modules';
import messages from '@intlify/unplugin-vue-i18n/messages';

// Modules
import accountModule from '@/modules/account';
import adminModule from '@/modules/admin';
import aiChatModule from '@/modules/ai-chat';
import architectureModule from '@/modules/architecture';
import assistantModule from '@/modules/assistant';
import authModule from '@/modules/auth';
import appBaseModule from '@/modules/base';
import collectionModule from '@/modules/collection';
import documentModule from '@/modules/document';
import homeModule from '@/modules/home';
import kanbanModule from '@/modules/kanban';
import mediaModule from '@/modules/media';
import notFoundModule from '@/modules/not-found';
import onboardingModule from '@/modules/onboarding';
import textToImageModule from '@/modules/text-to-image';
import userModule from '@/modules/user';
import workflowModule from '@/modules/workflow';
import ragnaClientPlugin from '@/plugins/ragna-client.plugin';

registerModules({
  app: appBaseModule,
  admin: adminModule,
  auth: authModule,
  user: userModule,
  home: homeModule,
  account: accountModule,
  aiChat: aiChatModule,
  assistant: assistantModule,
  collection: collectionModule,
  document: documentModule,
  media: mediaModule,
  textToImage: textToImageModule,
  onboarding: onboardingModule,
  workflow: workflowModule,
  architecture: architectureModule,
  kanban: kanbanModule,
  // 404 must be last
  notFound: notFoundModule,
});

const i18n = createI18n({
  legacy: false,
  locale: 'de',
  // fallbackLocale: 'en',
  messages,
});

const app = createApp(App);

const head = createHead();

app.use(i18n);
app.use(head);
app.use(pinia);
app.use(router);
app.use(veeConfigPlugin);
app.use(ragnaClientPlugin);
app.use(VueDOMPurifyHTML, {
  hooks: {
    afterSanitizeAttributes: (currentNode: any) => {
      if ('target' in currentNode && currentNode instanceof HTMLElement) {
        currentNode.setAttribute('target', '_blank');
        // currentNode.setAttribute('rel', 'noopener');
      }
    },
  },
});
app.use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
});

app.mount('#app');
