import { createRouter, createWebHistory } from 'vue-router';
import { adminMiddleware } from './middlewares/admin.middleware';
import { authMiddleware } from './middlewares/auth.middleware';
import { layoutMiddleware } from './middlewares/layout.middleware';
import { NProgressPlugin } from './plugins/nprogress.router.plugin';

const progressPlugin = new NProgressPlugin();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [], // Routes are added dynamically via registerModules
});

// Order matters: layout first, then auth, then admin
router.beforeEach(layoutMiddleware);
router.beforeEach(authMiddleware);
router.beforeEach(adminMiddleware);

// Install NProgress plugin
progressPlugin.install(router);

export default router;
