import { z } from 'zod';
export const cuidSchema = z
  .string()
  .trim()
  .length(24)
  .cuid2({ message: 'Please select a resource' });
