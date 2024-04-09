import { DEFAULT_TOKEN_INFO, TOKEN_MAP } from 'constants/misc';
import { DEFAULT_CHAIN_ID } from 'constants/network';
import { ITokenInfo } from 'types/assets';

export const getTokenInfo = (symbol: string, chainId = DEFAULT_CHAIN_ID): ITokenInfo => {
  return TOKEN_MAP[`${chainId}-${symbol}`] || DEFAULT_TOKEN_INFO;
};
