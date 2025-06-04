import { isValidJWT } from '@/utils/token';
import { z } from 'zod';

const passwordMinLength = 4;
const passwordMaxLength = 100;

export const loginFormSchema = z.object({
  email: z.string().trim().email().max(100),
  password: z.string().trim().min(passwordMinLength).max(passwordMaxLength),
});

export const registerFormSchema = z.object({
  name: z.string().trim().min(4),
  email: z.string().trim().email().max(100),
  password: z.string().trim().min(passwordMinLength).max(passwordMaxLength),
  terms: z
    .boolean()
    .default(false)
    .refine(value => value),
  // invitation code is a jwt token
  invitationCode: z
    .string()
    .trim()
    .min(1)
    .refine(value => isValidJWT(value)),
});
