import { InstallmentDecimal, ZERO } from 'constants/misc';
import { getPriceDecimal, getProtobufTime } from 'utils';
import { formatInputNumberString, timesDecimals } from 'utils/calculate';
import storages from './storages';
import dayjs, { Dayjs } from 'dayjs';
import { ITokenInfo } from 'types/assets';

export function resetCreateProjectInfo() {
  const infoKeys = [storages.ConfirmTradingPair, storages.Currency, storages.AdditionalInformation, storages.IDOInfo];
  infoKeys.forEach((key) => localStorage.removeItem(key));
}

export function getInstallments(v: any) {
  if (v.isInstallment) return v;
  return {
    totalPeriod: 1,
    firstDistributeProportion: timesDecimals(100, InstallmentDecimal - 2).toFixed(0),
    restPeriodDistributeProportion: 0,
    periodDuration: 0,
  };
}

export function ltTip(n: string | number) {
  return `Please enter a number less than ${n}`;
}

export function gtTip(n: string | number) {
  return `Please enter a number greater than ${n}`;
}
export function intervalTip(l: string | number, r: string | number) {
  return `Please enter a number between ${l} and ${r}!`;
}

export function getInfo(confirmTradingPair: any, projectPanel: any, additionalInfo: any, toRaiseToken: ITokenInfo) {
  const priceDecimal = getPriceDecimal(confirmTradingPair, toRaiseToken);
  const preSalePriceAmount = timesDecimals(projectPanel.preSalePrice, priceDecimal.toFixed()).toFixed(0);
  const publicSalePrice = ZERO.plus(preSalePriceAmount).div(1.05).toFixed(0);
  const crowdFundingIssueAmount = timesDecimals(
    projectPanel.crowdFundingIssueAmount,
    confirmTradingPair.decimals,
  ).toFixed(0);

  const minSubscription = timesDecimals(projectPanel.minSubscription, toRaiseToken.decimals).toFixed(0);
  const maxSubscription = timesDecimals(projectPanel.maxSubscription, toRaiseToken.decimals).toFixed(0);
  const _additionalInfo = {
    data: {
      ...additionalInfo,
      logoUrl: additionalInfo.logoUrl.map((item) => item.url).join(),
      projectImgs: additionalInfo.projectImgs.map((item) => item.url).join(),
    },
  };

  return {
    ...projectPanel,
    preSalePrice: preSalePriceAmount,
    totalPeriod: 1, // fixed
    periodDuration: 0,
    maxSubscription,
    publicSalePrice,
    listMarketInfo: [],
    crowdFundingIssueAmount,
    liquidityLockProportion: 0, // fixed
    restPeriodDistributeProportion: 0,
    additionalInfo: _additionalInfo,
    firstDistributeProportion: '100000000',
    acceptedSymbol: toRaiseToken.symbol,
    projectSymbol: confirmTradingPair.symbol,
    crowdFundingType: projectPanel.crowdFundingType,
    startTime: getProtobufTime(projectPanel.startTime),
    endTime: getProtobufTime(projectPanel.endTime),
    tokenReleaseTime: getProtobufTime(projectPanel.tokenReleaseTime),
    minSubscription: minSubscription === '0' ? 1 : minSubscription,
    unlockTime: getProtobufTime(projectPanel.tokenReleaseTime), // fixed
    isEnableWhitelist: projectPanel.isEnableWhitelist,
    isBurnRestToken: projectPanel.isBurnRestToken === '1' ? true : false,
  };
}

export function disabledDateBefore(current: Dayjs, target?: string | Dayjs) {
  const targetDate = target ? dayjs(target) : dayjs();
  return current && current < targetDate.endOf('day').add(-1, 'd');
}

export function disabledTimeBefore(current: Dayjs, target?: Dayjs | string) {
  const _current = current || dayjs().add(5, 's');
  const targetDate = target ? dayjs(target) : dayjs();

  return {
    disabledHours: () => {
      return _current.isAfter(targetDate, 'd') ? [] : new Array(targetDate.hour()).fill('').map((_, k) => k);
    },
    disabledMinutes: () => {
      return _current.isAfter(targetDate, 'h') ? [] : new Array(targetDate.minute()).fill('').map((_, k) => k);
    },
    disabledSeconds: () => {
      return _current.isAfter(targetDate, 'm') ? [] : new Array(targetDate.second()).fill('').map((_, k) => k);
    },
  };
}

export const integerNumberFormat = (val: string) => (val ? formatInputNumberString(val) : '');

export const formatNumberParser = (val: string) => val.replace(/,*/g, '');
