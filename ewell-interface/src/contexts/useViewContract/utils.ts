import AElf from 'aelf-sdk';
import { COMMON_PRIVATE } from 'constants/aelf';
import { getAElf } from 'utils/aelfUtils';

export const getContract = async (endPoint, contractAddress: string, wallet?: any) => {
  if (!wallet) wallet = AElf.wallet.getWalletByPrivateKey(COMMON_PRIVATE);
  const aelf = getAElf(endPoint);
  const contract = await aelf.chain.contractAt(contractAddress, wallet);
  return contract;
};
