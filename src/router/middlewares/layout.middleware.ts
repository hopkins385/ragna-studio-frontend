import type { RouteLocationNormalized } from 'vue-router';

export enum Layout {
  App = 'AppLayout',
  Login = 'LoginLayout',
  Error = 'ErrorLayout',
}

async function getLayout(layout: string) {
  // Validate layout name using enum
  if (!layout || !Object.values(Layout).includes(layout as Layout)) {
    throw new Error('Invalid layout specified');
  }
  return {
    AppLayout: import('../../layouts/AppLayout.vue'),
    LoginLayout: import('../../layouts/LoginLayout.vue'),
    ErrorLayout: import('../../layouts/ErrorLayout.vue'),
  }[layout];
}

export async function layoutMiddleware(to: RouteLocationNormalized) {
  try {
    const layout = to.meta.layout as string;

    // Safe dynamic import with validated layout name
    const layoutComponent = await getLayout(layout);

    // Set layout component
    if (!layoutComponent?.default) {
      throw new Error('Failed to load layout');
    }

    // Set layout component
    to.meta.layoutComponent = layoutComponent.default;
    return true;
  } catch (error: unknown) {
    // Production-safe error logging
    console.error('Layout middleware error:', {
      route: to.name,
      layout: to.meta.layout,
      message: error instanceof Error ? error.message : 'Failed to load layout',
    });

    // Load error layout
    try {
      const errorLayout = getLayout(Layout.Error);
      to.meta.layoutComponent = errorLayout;
      return true;
    } catch {
      // Critical failure - block navigation
      return false;
    }
  }
}
