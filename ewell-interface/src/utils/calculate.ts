import BigNumber from 'bignumber.js';
import { isEffectiveNumber, ZERO } from 'constants/misc';
export function timesDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) return bigA.times(decimals);
  return bigA.times(`1e${decimals}`);
}
export function divDecimals(a?: BigNumber.Value, decimals: string | number = 18) {
  if (!a) return ZERO;
  const bigA = ZERO.plus(a);
  if (bigA.isNaN()) return ZERO;
  if (typeof decimals === 'string' && decimals.length > 10) return bigA.div(decimals);
  return bigA.div(`1e${decimals}`);
}

export function divDecimalsStr(a?: BigNumber.Value, decimals: string | number = 8, defaultVal = '--') {
  const n = divDecimals(a, decimals);
  return isEffectiveNumber(n) ? n.toFormat() : defaultVal;
}

export function bigNumberToWeb3Input(input: BigNumber): string {
  return BigNumber.isBigNumber(input) ? input.toFixed(0) : new BigNumber(input).toFixed(0);
}

export function valueToPercentage(input?: BigNumber.Value) {
  return BigNumber.isBigNumber(input) ? input.times(100) : timesDecimals(input, 2);
}

export const formatInputNumberString = (value: string | BigNumber, decimalPlaces: number = 0) => {
  const n = ZERO.plus(value);
  if (n.isNaN()) return '';
  const fixedNumber = n.toFixed(decimalPlaces, BigNumber.ROUND_DOWN);
  return ZERO.plus(fixedNumber).toFormat();
};

export const numberLteZERO = (value?: string | BigNumber) => {
  if (!value) return false;
  const n = ZERO.plus(value);
  return !n.isNaN() && n.lte(0);
};
