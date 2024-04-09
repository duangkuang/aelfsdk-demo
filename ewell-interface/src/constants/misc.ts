import BigNumber from 'bignumber.js';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from './network';
import { ITokenInfo } from 'types/assets';
import { timesDecimals } from 'utils/calculate';

export enum REQ_CODE {
  UserDenied = -1,
  Fail = -2,
  Success = 1,
}

export const LANG_MAX = new BigNumber('9223372036854774784');

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

export const isEffectiveNumber = (v: any) => {
  const val = new BigNumber(v);
  return !val.isNaN() && !val.lte(0);
};

export enum TokenType {
  ELF = 'ELF',
  USDT = 'USDT',
}

export const AELF_TOKEN_INFO: ITokenInfo = {
  symbol: TokenType.ELF,
  decimals: 8,
  chainId: DEFAULT_CHAIN_ID,
  name: 'Native Token',
  address: NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
  id: `${DEFAULT_CHAIN_ID}-${TokenType.ELF}`,
};
export const DEFAULT_TOKEN_INFO = AELF_TOKEN_INFO;
export const DEFAULT_TOKEN_SYMBOL = DEFAULT_TOKEN_INFO.symbol;
export const DEFAULT_TOKEN_DECIMALS = DEFAULT_TOKEN_INFO.decimals;

export const USDT_TOKEN_INFO: ITokenInfo = {
  symbol: TokenType.USDT,
  decimals: 6,
  chainId: DEFAULT_CHAIN_ID,
  name: '',
  address: NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
  id: `${DEFAULT_CHAIN_ID}-${TokenType.USDT}`,
};

export const TOKEN_LIST = [AELF_TOKEN_INFO, USDT_TOKEN_INFO];
export const TOKEN_MAP: Record<string, ITokenInfo> = TOKEN_LIST.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

export const PriceDecimal = 8;
export const InstallmentDecimal = 8;
export const LiquidatedDamageProportionDecimal = 6;

export const DEFAULT_LIQUIDATED_DAMAGE_PROPORTION = timesDecimals(10, LiquidatedDamageProportionDecimal);
