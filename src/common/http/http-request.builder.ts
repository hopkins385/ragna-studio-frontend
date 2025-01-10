import { $axios } from '@/axios/axiosInstance';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PATCH';

interface RequestOptions<TParams = never, TData = never> {
  method: HttpMethod;
  url: string;
  params?: TParams;
  data?: TData;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  signal?: AbortSignal;
}

class RequestBuilder<TResponse, TParams = never, TData = never> {
  private instance: AxiosInstance;
  private errorHandler: (error: unknown) => void = () => {};
  private config: RequestOptions<TParams, TData> = {
    method: 'GET',
    url: '',
  };

  constructor(axiosInstance: AxiosInstance) {
    this.instance = axiosInstance;
  }

  setMethodPOST(): this {
    this.config.method = 'POST';
    return this;
  }

  setMethodPATCH(): this {
    this.config.method = 'PATCH';
    return this;
  }

  setMethodDELETE(): this {
    this.config.method = 'DELETE';
    return this;
  }

  setRoute(url: string): this {
    this.config.url = url;
    return this;
  }

  setParams(params: TParams): this {
    this.config.params = params;
    return this;
  }

  setData(data: TData): this {
    this.config.data = data;
    return this;
  }

  setHeaders(headers: Record<string, string>): this {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  setTimeout(timeout: number): this {
    this.config.timeout = timeout;
    return this;
  }

  setResponseType(
    responseType: 'json' | 'text' | 'blob' | 'arraybuffer',
  ): this {
    this.config.responseType = responseType;
    return this;
  }

  setSignal(signal: AbortSignal): this {
    this.config.signal = signal;
    return this;
  }

  setErrorHandler(handler: (error: unknown) => void): this {
    this.errorHandler = handler;
    return this;
  }

  async execute(): Promise<AxiosResponse<TResponse>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        ...this.config,
        method: this.config.method,
        url: this.config.url,
      };

      return await this.instance.request<TResponse>(axiosConfig);
    } catch (error) {
      this.errorHandler(error);
      throw error;
    }
  }
}

// API client factory
export function createApiClient() {
  return {
    request<TResponse, TParams = never, TData = never>() {
      return new RequestBuilder<TResponse, TParams, TData>($axios);
    },
  };
}
