import { BaseApiService } from '@/common/service/base-api.service';
import type { MediaAbleModel } from '@/modules/media-able/interfaces';

export class MediaAbleService extends BaseApiService {
  constructor() {
    super();
  }

  async attachMediaTo(mediaId: string, { model }: { model: MediaAbleModel }) {
    throw new Error('Not implemented');
  }

  async detachMediaFrom() {
    throw new Error('Not implemented');
  }
}

export const mediaAbleService = new MediaAbleService();
