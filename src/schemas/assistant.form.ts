import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { cuidSchema } from './cuid.schema';

export const assistantSchema = z.object({
  teamId: cuidSchema,
  llmId: cuidSchema,
  title: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  systemPrompt: z.string().min(3).max(6000),
  temperature: z.array(z.number().int().positive().min(0).max(100).default(80)),
  hasKnowledgeBase: z.boolean().default(false),
  hasWorkflow: z.boolean().default(false),
  isShared: z.boolean().default(false),
  tools: z.array(cuidSchema),
});

export const assistantFormSchema = toTypedSchema(assistantSchema);
