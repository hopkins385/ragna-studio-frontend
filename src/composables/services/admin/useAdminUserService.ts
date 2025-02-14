import type { PaginateDto } from '@/interfaces/paginate.interface';

export function useAdminUserService() {
  const ac = new AbortController();

  const fetchAllUsers = async (params: PaginateDto) => {};

  const fetchUser = async ({ userId }: { userId: string }) => {};

  const deleteUser = async ({ userId }: { userId: string }) => {};

  return {
    fetchAllUsers,
    fetchUser,
    deleteUser,
  };
}
