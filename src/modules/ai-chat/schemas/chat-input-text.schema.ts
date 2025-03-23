import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

// do not allow backticks in the input

export const chatInputTextSchema = z.object({
  input: z.string().trim().min(1).max(50000),
});

export const chatInputFormSchema = toTypedSchema(chatInputTextSchema);
