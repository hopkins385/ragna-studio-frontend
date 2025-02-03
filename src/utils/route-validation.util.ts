import { RouteName } from '@/router/enums/route-names.enum';
import { cuidSchema } from '@/schemas/cuid.schema';
import { socialAuthGoogleCallbackSchema } from '@/schemas/social-auth-google-callback.schema';
import type { RouteLocationNormalized } from 'vue-router';
import { z } from 'zod';

const pageNumberRegex = /^[1-9]\d{0,4}$/;

const idSchema = z.object({
  id: cuidSchema,
});

const querySchema = z.object({
  page: z.string().trim().regex(pageNumberRegex).optional(),
  limit: z.string().trim().regex(pageNumberRegex).optional(),
  search: z.string().trim().min(1).optional(),
});

export function hasValidRouteId(to: RouteLocationNormalized) {
  const res = idSchema.safeParse(to.params);
  if (!res.success) {
    return { name: RouteName.NOT_FOUND };
  }
  return true;
}

export function hasValidRouteQuery(to: RouteLocationNormalized) {
  const res = querySchema.safeParse(to.query);
  if (!res.success) {
    return { name: RouteName.NOT_FOUND };
  }
  return true;
}

export function hasValidGoogleCallbackQuery(to: RouteLocationNormalized) {
  const res = socialAuthGoogleCallbackSchema.safeParse(to.query);
  if (!res.success) {
    return { name: RouteName.NOT_FOUND };
  }
  return true;
}
