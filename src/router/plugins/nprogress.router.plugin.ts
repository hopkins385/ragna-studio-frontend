import NProgress from 'nprogress';
import type { Router } from 'vue-router';

export class NProgressPlugin {
  private loadingTimer: number | null = null;

  constructor() {
    NProgress.configure({
      showSpinner: false,
    });
  }

  install(router: Router) {
    router.beforeEach((to, from, next) => {
      if (to.path !== from.path) {
        if (this.loadingTimer) {
          clearTimeout(this.loadingTimer);
        }

        this.loadingTimer = window.setTimeout(() => {
          NProgress.start();
        }, 200);
      }
      next();
    });

    router.afterEach(() => {
      if (this.loadingTimer) {
        clearTimeout(this.loadingTimer);
        this.loadingTimer = null;
      }
      NProgress.done();
    });
  }
}
