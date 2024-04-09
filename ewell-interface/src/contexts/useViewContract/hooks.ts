import { useCallback, useRef } from 'react';
import { useViewContractContext } from '.';
import { getContract } from './utils';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from 'constants/network';
import { unifyMillisecond } from 'utils/time';
import { TWhitelistUser } from './types';
import { ZERO } from 'constants/misc';

export function useViewContract() {
  const [{ tokenContract, ewellContract, whitelistContract }, dispatch] = useViewContractContext();
  const tokenContractRef = useRef(tokenContract);
  tokenContractRef.current = tokenContract;
  const ewellContractRef = useRef(ewellContract);
  ewellContractRef.current = ewellContract;
  const whitelistContractRef = useRef(whitelistContract);
  whitelistContractRef.current = whitelistContract;

  const getTokenContract = useCallback(async () => {
    if (tokenContractRef.current) return tokenContractRef.current;
    const contract = await getContract(
      NETWORK_CONFIG.sideChainInfo.endPoint,
      NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
    );
    dispatch({
      type: 'SET_VIEW_CONTRACT',
      payload: {
        tokenContract: contract,
      },
    });

    return contract;
  }, [dispatch]);

  const getEwellContract = useCallback(async () => {
    if (ewellContractRef.current) return ewellContractRef.current;
    const contract = await getContract(NETWORK_CONFIG.sideChainInfo.endPoint, NETWORK_CONFIG.ewellContractAddress);
    dispatch({
      type: 'SET_VIEW_CONTRACT',
      payload: {
        ewellContract: contract,
      },
    });

    return contract;
  }, [dispatch]);

  const getWhitelistContract = useCallback(async () => {
    if (whitelistContractRef.current) return whitelistContractRef.current;
    const contract = await getContract(NETWORK_CONFIG.sideChainInfo.endPoint, NETWORK_CONFIG.whitelistContractAddress);
    dispatch({
      type: 'SET_VIEW_CONTRACT',
      payload: {
        whitelistContract: contract,
      },
    });

    return contract;
  }, [dispatch]);

  const getWhitelistUserList = useCallback(
    async (whitelistId: string) => {
      const whitelistContract = await getWhitelistContract();
      const whitelistInfo = await whitelistContract.GetWhitelist.call(whitelistId);
      const addressList: TWhitelistUser[] = (whitelistInfo?.extraInfoIdList?.value?.[0]?.addressList?.value ?? []).map(
        (item) => ({
          address: `ELF_${item.address}_${DEFAULT_CHAIN_ID}`,
          createTime: unifyMillisecond(item.createTime),
        }),
      );
      return addressList;
    },
    [getWhitelistContract],
  );

  const checkIsNeedApprove = useCallback(
    async ({ symbol, amount, owner, spender }: { symbol: string; amount: string; owner: string; spender: string }) => {
      const tokenContract = await getTokenContract();
      const { allowance } = await tokenContract.GetAllowance.call({
        symbol,
        owner,
        spender,
      });

      return ZERO.plus(allowance).lt(amount);
    },
    [getTokenContract],
  );

  return {
    getTokenContract,
    getEwellContract,
    getWhitelistContract,
    getWhitelistUserList,
    checkIsNeedApprove,
  };
}
