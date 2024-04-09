import { AxiosRequestConfig, AxiosResponse } from 'axios';

export enum CancelTokenSourceKey {
  GET_PROJECT_DETAIL = 'getProjectDetail',
}

export type requestConfig = {
  query?: string; //this for url parameter； example: test/:id
  cancelTokenSourceKey?: CancelTokenSourceKey;
} & AxiosRequestConfig<any>;

export type IBaseRequest = {
  url: string;
} & requestConfig;

export type BaseConfig = string | { target: string; baseConfig: requestConfig };

export type UrlObj = { [key: string]: BaseConfig };

export type API_REQ_FUNCTION<T = any> = (config?: requestConfig) => Promise<T | AxiosResponse<T>>;
