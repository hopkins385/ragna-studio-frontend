import { Layout } from './middlewares/layout.middleware';

export const defaultAppMeta = {
  requiresAuth: true,
  layout: Layout.App,
} as const;

export const defaultAdminMeta = {
  requiresAdmin: true,
  requiresAuth: true,
  layout: Layout.App,
} as const;
