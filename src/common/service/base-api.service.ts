import { newApiRequest, type ApiRequest } from '@/common/http/http-request.builder';

export class BaseApiService {
  protected ac: AbortController;
  protected api: ApiRequest;

  constructor() {
    this.ac = new AbortController();
    this.api = newApiRequest();
  }

  /**
   * Abort the current request
   */
  public abortRequest() {
    this.ac.abort();
    this.ac = new AbortController();
  }

  public getAbortController(): AbortController {
    return this.ac;
  }
  public getAbortSignal(): AbortSignal {
    return this.ac.signal;
  }
  public getAbortStatus(): boolean {
    return this.ac.signal.aborted;
  }
  public getAbortReason(): string | null {
    return this.ac.signal.reason;
  }
  public getAbortError(): Error | null {
    if (this.ac.signal.aborted) {
      return new Error(this.ac.signal.reason);
    }
    return null;
  }
}
