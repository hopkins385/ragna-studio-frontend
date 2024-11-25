import { z } from 'zod';

export const workflowSettingsSchema = z.object({
  name: z.string().min(3).max(20),
  description: z.string().min(3).max(50),
});

export const workflowNameSchema = z.object({
  name: z.string().min(3).max(20),
});
