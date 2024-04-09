import { UploadFile } from 'antd';
import { ZERO } from 'constants/misc';
export const NumberFormat = (val: string | number, precision: number = 0) => {
  return ZERO.plus(val).toFormat(precision);
};

export const urlString2FileList = (urlString: string) => {
  const fileList: UploadFile[] = [];
  if (!urlString) return fileList;

  urlString.split(',').forEach((url, index) => {
    if (url) {
      fileList.push({
        uid: '' + index,
        name: url.match(/[^/]*$/)?.[0] || '',
        status: 'done',
        url,
      });
    }
  });

  return fileList;
};

export function getLocalStorage(key: string) {
  try {
    if (!key) return '';
    return JSON.parse(localStorage.getItem(key) || '{}');
  } catch (error) {
    return undefined;
  }
}

export function convertToBytes(sizeWithUnit: string) {
  const reg = /^\d+[KM]?$/;
  if (!reg.test(sizeWithUnit)) return 0;

  console.log('convertToBytes:', sizeWithUnit);
  const unit_K = 1 * 1024;
  const unit_M = unit_K * 1024;

  if (sizeWithUnit.includes('M')) {
    return +sizeWithUnit.replace('M', '') * unit_M;
  }

  if (sizeWithUnit.includes('K')) {
    return +sizeWithUnit.replace('K', '') * unit_K;
  }

  return 10 * unit_M;
}
