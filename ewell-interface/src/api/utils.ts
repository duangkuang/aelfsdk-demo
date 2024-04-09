import { service } from './axios';
import { BaseConfig, requestConfig } from './types';

export function getRequestConfig(base: BaseConfig, config?: requestConfig) {
  if (typeof base === 'string') {
    return config;
  } else {
    const { baseConfig } = base || {};
    const { query, method, params, data } = config || {};
    return {
      ...config,
      ...baseConfig,
      query: (baseConfig.query || '') + (query || ''),
      method: method ? method : baseConfig.method,
      params: Object.assign({}, baseConfig.params, params),
      data: Object.assign({}, baseConfig.data, data),
    };
  }
}

export const checkIsAuthorized = () => {
  return !!service.defaults.headers.common['Authorization'];
};
