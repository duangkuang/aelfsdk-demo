import { NETWORK_CONFIG } from 'constants/network';
import { API_REQ_FUNCTION, UrlObj } from './types';

export const DEFAULT_METHOD = 'GET';

/**
 * api request configuration directory
 * @example
 *    upload: {
 *      target: '/api/file-management/file-descriptor/upload',
 *      baseConfig: { method: 'POST', },
 *    },
 * or:
 *    upload:'/api/file-management/file-descriptor/upload'
 *
 * @description api configuration default method is from DEFAULT_METHOD
 * @type {UrlObj}  // The type of this object from UrlObj.
 */

const BASE_URL = NETWORK_CONFIG.ewellRequestUrl;

const ProjectApiList = {
  getProjectList: `${BASE_URL}/api/app/project/list`,
  getTokenList: `${BASE_URL}/api/app/token/list`,
  getProjectUserList: `${BASE_URL}/api/app/project/userList`,
};

const AssetsApiList = {
  getTxFee: `${BASE_URL}/api/app/project/fee`,
  getTokenPrice: `${BASE_URL}/api/app/token/price`,
};
/**
 * api request extension configuration directory
 * @description object.key // The type of this object key comes from from @type {UrlObj}
 */
export const EXPAND_APIS = { project: ProjectApiList, assets: AssetsApiList };

export type EXPAND_REQ_TYPES = {
  [X in keyof typeof EXPAND_APIS]: {
    [K in keyof typeof EXPAND_APIS[X]]: API_REQ_FUNCTION;
  };
};
