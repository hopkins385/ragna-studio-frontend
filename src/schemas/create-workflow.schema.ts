import { z } from 'zod';
import { cuidSchema } from './cuid.schema';

export const maxFileSize = 1 * 1024 * 1024; // 1MB

export const allowedMimeTypes = [
  'application/json',
  // csv
  'text/csv',
  'application/vnd.ms-excel',
  'application/csv',
  // xlsx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

export const createWorkflowSchema = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255),
  assistantId: cuidSchema.optional(),
  file: z
    .instanceof(File)
    .refine(file => allowedMimeTypes.includes(file.type), {
      message: 'Invalid file type.',
    })
    .refine(file => file.size <= maxFileSize, {
      message: `File too large. Max size is ${maxFileSize / 1024 / 1024}MB.`,
    })
    .optional(),
});
