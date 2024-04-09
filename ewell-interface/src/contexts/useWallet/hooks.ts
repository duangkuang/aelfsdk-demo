import { useCallback, useMemo } from 'react';
import { useWalletContext } from '.';
import { WalletType, useWebLogin, PortkeyDid } from 'aelf-web-login';
import useDiscoverProvider from 'hooks/useDiscoverProvider';
import { DEFAULT_CHAIN_ID } from 'constants/network';

export function useWallet() {
  const [state] = useWalletContext();
  const { login, logout, loginState } = useWebLogin();
  const { discoverProvider } = useDiscoverProvider();

  const wallet = useMemo(() => {
    return state.wallet;
  }, [state]);

  const checkManagerSyncState = useCallback(async () => {
    if (!wallet) return false;
    if (wallet.walletType === WalletType.elf) return true;
    if (wallet.walletType === WalletType.portkey) {
      return PortkeyDid.did.checkManagerIsExist({
        chainId: DEFAULT_CHAIN_ID,
        caHash: wallet.walletInfo.portkeyInfo?.caInfo?.caHash || '',
        managementAddress: wallet.walletInfo.portkeyInfo?.walletInfo?.address || '',
      });
    }
    if (wallet.walletType === WalletType.discover) {
      const provider = await discoverProvider();
      if (!provider) return false;
      return provider.request<boolean>({
        method: 'wallet_getManagerSyncStatus',
        payload: {
          chainId: DEFAULT_CHAIN_ID,
        },
      });
    }
    return false;
  }, [discoverProvider, wallet]);

  return {
    wallet,
    loginState,
    login,
    logout,
    checkManagerSyncState,
  };
}
