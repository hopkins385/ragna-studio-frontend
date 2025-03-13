import { $axios } from '@/axios/axiosInstance';
import { BadRequestError } from '@/common/errors/bad-request.error';
import { ConnectionError } from '@/common/errors/connection.error';
import { ForbiddenError } from '@/common/errors/forbidden.error';
import { NotFoundError } from '@/common/errors/not-found.error';
import { UnauthorizedError } from '@/common/errors/unauthorized.error';
import { UnknownError } from '@/common/errors/unknown.error';
import { ValidationError } from '@/common/errors/validation.error';
import { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { RequestAbortError } from '../errors/abort.error';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type ResponseType = 'json' | 'text' | 'blob' | 'arraybuffer';

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

interface ErrorHandler {
  (error: AxiosError): void;
}

class RequestBuilder<TResponse, TParams = never, TData = never> {
  private instance: AxiosInstance;
  private errorHandler: ErrorHandler | null = null;
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

  public async send(): Promise<AxiosResponse<TResponse>> {
    try {
      const axiosConfig: AxiosRequestConfig = {
        ...this.config,
        method: this.config.method,
        url: this.config.url,
      };

      return await this.instance.request<TResponse>(axiosConfig);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.name === 'AbortError') {
          throw new RequestAbortError();
        }
        if (error.code === 'ERR_NETWORK') {
          throw new ConnectionError();
        }
        if (this.errorHandler) {
          this.errorHandler(error);
        } else {
          defaultErrorHandler(error);
        }
      }
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new RequestAbortError();
        }
      }
      throw error;
    }
  }
}

function defaultErrorHandler(error: AxiosError) {
  switch (error.response?.status) {
    case 400:
      throw new BadRequestError();
    case 401:
      throw new UnauthorizedError();
    case 403:
      throw new ForbiddenError();
    case 404:
      throw new NotFoundError();
    case 422:
      throw new ValidationError();
    default:
      throw new UnknownError(error.message);
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

export type { RequestBuilder as HttpRequestBuilder };
export type ApiRequest = ReturnType<typeof newApiRequest>;
