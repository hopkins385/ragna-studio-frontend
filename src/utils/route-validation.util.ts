import { cuidSchema } from '@/schemas/cuid.schema';
import { socialAuthGoogleCallbackSchema } from '@/schemas/social-auth-google-callback.schema';
import type { RouteLocationNormalized } from 'vue-router';
import { z } from 'zod';

const idSchema = z.object({
  id: cuidSchema,
});

const querySchema = z.object({
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().optional(),
  search: z.string().trim().min(1).optional(),
});

export function hasValidRouteId(to: RouteLocationNormalized) {
  const res = idSchema.safeParse(to.params);
  if (!res.success) {
    return { name: 'not-found' };
  }
  return true;
}

export function hasValidRouteQuery(to: RouteLocationNormalized) {
  const res = querySchema.safeParse(to.query);
  if (!res.success) {
    return { name: 'not-found' };
  }
  return true;
}

export function hasValidGoogleCallbackQuery(to: RouteLocationNormalized) {
  const res = socialAuthGoogleCallbackSchema.safeParse(to.query);
  if (!res.success) {
    return { name: 'not-found' };
  }
  return true;
}
