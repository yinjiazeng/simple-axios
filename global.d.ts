declare module '@iegee/request' {
  import { AxiosStatic, AxiosRequestConfig, AxiosPromise } from 'axios';

  export type ServicesObject = {};

  export interface AxiosRequestOptions extends AxiosRequestConfig {
    extension?: string;
    cache?: boolean;
    delay?: number;
  }

  export const createServices: (api: ServicesObject, mockData?: any) => any;

  export const createMethod: (
    name: string,
    callback: (
      url: string,
      data?: object,
      options?: AxiosRequestOptions,
      ...rest: any[]
    ) => AxiosPromise,
    force?: boolean,
  ) => void;

  export const createMock: (mockData: object) => void;

  export const axiosConfig: (options: AxiosRequestOptions) => AxiosRequestOptions;

  export const axios: AxiosStatic;
}
