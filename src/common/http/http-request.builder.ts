import { $axios } from '@/axios/axiosInstance';
import {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type ResponseType = 'json' | 'text' | 'blob' | 'arraybuffer';

interface RequestOptions<TParams = never, TData = never> {
  method: HttpMethod;
  url: string;
  params?: TParams;
  data?: TData;
  headers?: Record<string, string>;
  timeout?: number;
  responseType?: ResponseType;
  signal?: AbortSignal;
}

class RequestBuilder<TResponse, TParams = never, TData = never> {
  private instance: AxiosInstance;
  private errorHandler: (error: AxiosError) => void = () => {};
  private config: RequestOptions<TParams, TData> = {
    method: 'GET',
    url: '',
  };

  constructor(axiosInstance: AxiosInstance, method: HttpMethod = 'GET') {
    this.instance = axiosInstance;
    this.config.method = method;
  }

  public setRoute(url: string): this {
    this.config.url = url;
    return this;
  }

  public setParams(params: TParams): this {
    this.config.params = params;
    return this;
  }

  public setData(data: TData): this {
    this.config.data = data;
    return this;
  }

  public setHeaders(headers: Record<string, string>): this {
    this.config.headers = { ...this.config.headers, ...headers };
    return this;
  }

  public setTimeout(timeout: number): this {
    this.config.timeout = timeout;
    return this;
  }

  public setResponseType(responseType: ResponseType): this {
    this.config.responseType = responseType;
    return this;
  }

  public setSignal(signal: AbortSignal): this {
    this.config.signal = signal;
    return this;
  }

  public setErrorHandler(handler: (error: AxiosError) => void): this {
    this.errorHandler = handler;
    return this;
  }

  public async execute(): Promise<AxiosResponse<TResponse>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        ...this.config,
        method: this.config.method,
        url: this.config.url,
      };

      return await this.instance.request<TResponse>(axiosConfig);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (this.errorHandler) {
          this.errorHandler(error);
        }
      }
      throw error;
    }
  }
}

// API client factory
export function newApiRequest() {
  return {
    GET<TResponse, TParams = never, TData = never>() {
      return new RequestBuilder<TResponse, TParams, TData>($axios, 'GET');
    },
    POST<TResponse, TParams = never, TData = never>() {
      return new RequestBuilder<TResponse, TParams, TData>($axios, 'POST');
    },
    PATCH<TResponse, TParams = never, TData = never>() {
      return new RequestBuilder<TResponse, TParams, TData>($axios, 'PATCH');
    },
    DELETE<TResponse, TParams = never, TData = never>() {
      return new RequestBuilder<TResponse, TParams, TData>($axios, 'DELETE');
    },
  };
}
