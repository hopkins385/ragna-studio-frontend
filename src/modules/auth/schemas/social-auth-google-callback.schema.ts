import { z } from 'zod';

export const socialAuthGoogleCallbackSchema = z.object({
  code: z.string().trim().min(1).max(255),
  scope: z.string().trim().optional(),
  authuser: z.string().trim().optional(),
  prompt: z.string().trim().optional(),
  error: z.string().optional(),
});
