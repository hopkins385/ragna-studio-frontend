import { z } from 'zod';

export const chatInputTextSchema = z.object({
  input: z.string().min(1),
});
