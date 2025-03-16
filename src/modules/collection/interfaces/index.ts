import type { PaginateMeta } from '@/common/interfaces/paginate-meta.interface';
import type { CollectionAbleModel } from '@/modules/collection-able/interfaces';

export interface Collection {
  id: string;
  name: string;
  description: string;
  model: CollectionAbleModel;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionResponse {
  collection: Collection;
}

export interface CollectionsResponse {
  collections: Collection[];
}

export interface CollectionsPaginatedResponse {
  collections: Collection[];
  meta: PaginateMeta;
}

export interface CollectionRequest {}

export interface CreateCollectionPayload {
  name: string;
  description: string;
}

export interface EditCollectionPayload {
  name: string;
  description?: string;
}
