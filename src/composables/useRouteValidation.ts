import { RouteName } from '@/router/enums/route-names.enum';
import { cuidSchema } from '@/schemas/cuid.schema';
import { z } from 'zod';

export default function useRouteValidation() {
  const router = useRouter();

  function getValidatedId(params: any) {
    const idSchema = z.object({
      id: cuidSchema,
    });
    const res = idSchema.safeParse(params);
    if (!res.success) {
      router.push({ name: RouteName.NOT_FOUND });
      return { id: null };
    }
    return res.data;
  }

  function hasValidProjectWorkflowId(params: any) {
    const res = z
      .object({
        projectId: cuidSchema,
        workflowId: cuidSchema,
      })
      .safeParse(params);
    return res.success;
  }

  function hasValidProjectDocumentId(params: any) {
    const res = z
      .object({
        projectId: cuidSchema,
        documentId: cuidSchema,
      })
      .safeParse(params);
    return res.success;
  }

  function hasValidPage(params: any) {
    const regexScheme = /^[1-9]\d{0,4}$/;
    const res = z
      .object({
        page: z.string().regex(regexScheme).optional().default('1'),
      })
      .safeParse(params);
    return res.success;
  }

  return {
    getValidatedId,
    hasValidProjectWorkflowId,
    hasValidProjectDocumentId,
    hasValidPage,
  };
}
