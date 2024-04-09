import { ChainId } from './aelf';

export interface ITokenInfo {
  symbol: string;
  decimals: number;
  chainId: ChainId;
  name: string;
  address: string;
  id: string;
}
