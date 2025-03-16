import type { PaginateMeta } from '@/common/interfaces/paginate-meta.interface';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UsersPaginated {
  users: User[];
  meta: PaginateMeta;
}

export interface UserCreate extends Omit<User, 'id'> {
  password: string;
}
