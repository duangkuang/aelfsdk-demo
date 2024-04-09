import { useWallet } from 'contexts/useWallet/hooks';
import { useCallback } from 'react';
import { NETWORK_CONFIG } from 'constants/network';

export const useUpdateAddition = () => {
  const { wallet } = useWallet();

  const updateAddition = useCallback(
    async function (projectId: string, data?: { [key: string]: string }) {
      console.log('addition-data', data);
      const result = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'UpdateAdditionalInfo',
        args: {
          projectId: projectId,
          additionalInfo: {
            data: data || {},
          },
        },
      });
      console.log('update infomation', result);
      return result;
    },
    [wallet],
  );

  return { updateAddition };
};
