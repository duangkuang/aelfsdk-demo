import AElf from 'aelf-sdk';
import { isValidBase58 } from './reg';

export function isAelfAddress(value?: string) {
  if (!value || !isValidBase58(value)) return false;
  if (value.includes('_') && value.split('_').length < 3) return false;
  try {
    return !!AElf.utils.decodeAddressRep(value);
  } catch {
    return false;
  }
}

const initAddressInfo = {
  prefix: '',
  address: '',
  suffix: '',
};
export const getAddressInfo = (value: string): { prefix: string; address: string; suffix: string } => {
  const arr = value.split('_');
  if (arr.length > 3 || arr.length === 0) return initAddressInfo;
  if (arr.length === 3) return { prefix: arr[0], address: arr[1], suffix: arr[2] };
  if (arr.length === 1) return { ...initAddressInfo, address: value };
  // arr.length === 2
  if (isAelfAddress(arr[0])) return { ...initAddressInfo, address: arr[0], suffix: arr[1] };
  return { ...initAddressInfo, prefix: arr[0], address: arr[1] };
};

export const getTxFee = (txResult: any): string => {
  const txFeeLog = txResult.Logs.find((item: any) => item.Name === 'TransactionFeeCharged');
  if (!txFeeLog) return '0';
  return AElf.pbUtils.getFee(txFeeLog?.NonIndexed || '', 'TransactionFeeCharged')?.amount || '0';
};
