import { z } from 'zod';

export const editImageRouteQuerySchema = z.object({
  runId: z.string().optional(),
  imageId: z.string().optional(),
});
