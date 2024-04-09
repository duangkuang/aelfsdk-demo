import axios from 'axios';
import myEvents from 'utils/myEvent';

const isDeniedRequest = (error: { message: string }) => {
  try {
    const message: string = error.message;
    if (message.includes('401')) return true;
  } catch (error) {
    console.log(error);
  }
  return false;
};

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 10000,
});

axiosInstance.defaults.headers.common['x-csrf-token'] = 'AUTH_TOKEN';

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res?.code?.substring(0, 1) !== '2') {
      return Promise.reject(res);
    }
    return res;
  },
  (error) => {
    if (isDeniedRequest(error)) {
      myEvents.AuthorizationExpired.emit();
    }
    return Promise.reject(error);
  },
);

export const service = axiosInstance;

export function spliceUrl(baseUrl: string, extendArg?: string) {
  return extendArg ? baseUrl + '/' + extendArg : baseUrl;
}
