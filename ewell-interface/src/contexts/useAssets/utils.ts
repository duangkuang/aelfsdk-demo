import { request } from 'api';

export type TGetTokenPriceApiResult = {
  price?: number;
};
export const getTokenPriceApi = async (baseCoin: string, quoteCoin: string) => {
  // const result = await request.assets.getTokenPrice({
  //   params: {
  //     baseCoin,
  //     quoteCoin,
  //   },
  // });
  return {price: 0 } as TGetTokenPriceApiResult;
};

export type TGetTxFeeApiResult = {
  transactionFee?: number;
};
export const getTxFeeApi = async () => {
  const result = await request.assets.getTxFee();
  return {transactionFee: 0} as TGetTxFeeApiResult;
};
