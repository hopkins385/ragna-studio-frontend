import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().trim().min(4).max(100),
});
