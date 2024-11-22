import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { cuidSchema } from './cuid.schema';

export const assistantSchema = z.object({
  teamId: cuidSchema,
  llmId: cuidSchema,
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  systemPrompt: z.string().min(3).max(6000),
  isShared: z.boolean().default(false),
  tools: z.array(cuidSchema),
});

export const assistantFormSchema = toTypedSchema(assistantSchema);
