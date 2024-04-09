import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';

import { TWalletContextState } from './types';
import {
  WebLoginProvider,
  WebLoginState,
  useWebLoginEvent,
  WebLoginEvents,
  setGlobalConfig,
  PortkeyDid,
  useWebLogin,
  WebLoginInterface,
  getContractBasicAsync,
} from 'aelf-web-login';
import Wallet from './Wallet';
import { IWallet } from './Wallet/types';
import { DEFAULT_CHAIN_ID, IS_OFFLINE_NETWORK, NETWORK_CONFIG } from 'constants/network';
import { authToken, clearLocalJWT } from './utils';
import myEvents from 'utils/myEvent';
import { useLocation } from 'react-use';
import { useNavigate } from 'react-router-dom';
import { checkPathExist } from 'utils/reg';
import { APP_NAME } from 'constants/aelf';
import { message } from 'antd';
import { service } from 'api/axios';
import { useBalance } from 'hooks/useBalance';
import { DEFAULT_TOKEN_DECIMALS, DEFAULT_TOKEN_SYMBOL, ZERO } from 'constants/misc';

setGlobalConfig({
  appName: APP_NAME || '',
  chainId: DEFAULT_CHAIN_ID,
  networkType: NETWORK_CONFIG.webLoginNetworkType,
  onlyShowV2: true,
  portkey: {} as any,
  portkeyV2: {
    networkType: NETWORK_CONFIG.networkType,
    useLocalStorage: true,
    graphQLUrl: NETWORK_CONFIG.webLoginGraphqlUrl,
    connectUrl: NETWORK_CONFIG.webLoginConnectUrl,
    requestDefaults: {
      baseURL: NETWORK_CONFIG.webLoginRequestDefaultsUrl,
      timeout: 20 * 1000,
    },
    loginConfig: {
      loginMethodsOrder: ['Google', 'Apple', 'Telegram', 'Email', 'Scan'],
    },
    // socialLogin: {
    //   Portkey: {
    //     websiteName: '',
    //     websiteIcon: '',
    //   },
    // },
    serviceUrl: NETWORK_CONFIG.webLoginRequestDefaultsUrl,
    customNetworkType: IS_OFFLINE_NETWORK ? 'Offline' : 'onLine',
  },
  aelfReact: {
    appName: APP_NAME || '',
    nodes: {
      AELF: {
        chainId: 'AELF',
        rpcUrl: NETWORK_CONFIG.mainChainInfo.endPoint,
      },
      tDVW: {
        chainId: 'tDVW',
        rpcUrl: NETWORK_CONFIG.sideChainInfo.endPoint,
      },
      tDVV: {
        chainId: 'tDVV',
        rpcUrl: NETWORK_CONFIG.sideChainInfo.endPoint,
      },
    },
  },
  defaultRpcUrl: 'https://explorer.aelf.io/chain',
});

export const DESTROY = 'DESTROY';
const SET_WALLET = 'SET_WALLET';

const INITIAL_STATE = {};
const WalletContext = createContext<any>(INITIAL_STATE);

export function useWalletContext(): [TWalletContextState, React.Dispatch<any>] {
  return useContext(WalletContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case SET_WALLET: {
      return {
        ...state,
        wallet: payload,
      };
    }
    case DESTROY: {
      return {};
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

const LOGOUT_STAY_PATH = ['example', 'project', 'projects/all'];
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const webLoginContext = useWebLogin();
  const webLoginContextRef = useRef<WebLoginInterface>(webLoginContext);
  webLoginContextRef.current = webLoginContext;

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const { wallet } = state;
  if (webLoginContext.loginState === WebLoginState.logined && wallet && webLoginContext.callContract) {
    webLoginContext.callContract && (wallet as IWallet).setCallContract(webLoginContext.callContract);
    webLoginContext.getSignature && (wallet as IWallet).setGetSignature(webLoginContext.getSignature);
  }

  const onLogin = useCallback(async () => {
    const _webLoginContext = webLoginContextRef.current;
    console.log('onLogin');
    console.log(_webLoginContext);
    const wallet = new Wallet({
      walletInfo: _webLoginContext.wallet,
      walletType: _webLoginContext.walletType,
      callContract: _webLoginContext.callContract,
      getSignature: _webLoginContext.getSignature,
    });
    dispatch({
      type: SET_WALLET,
      payload: wallet,
    });
    authToken(wallet);
  }, []);

  // useWebLoginEvent(WebLoginEvents.LOGINED, onLogin);
  useEffect(() => {
    if (webLoginContext.loginState !== WebLoginState.logined) return;
    onLogin();
  }, [webLoginContext.loginState, onLogin]);

  const onLogout = useCallback(() => {
    console.log('onLogout');
    dispatch({
      type: SET_WALLET,
      payload: undefined,
    });
    service.defaults.headers.common['Authorization'] = '';
    clearLocalJWT();

    const isStay = checkPathExist(LOGOUT_STAY_PATH, pathnameRef.current || '');
    if (!isStay) {
      navigate('/', { replace: true });
    }
  }, [navigate]);
  useWebLoginEvent(WebLoginEvents.LOGOUT, onLogout);

  const onLoginError = useCallback(
    (error) => {
      console.log('onLoginError', error);
      if (error?.message) {
        messageApi.error(error.message);
      }
    },
    [messageApi],
  );
  useWebLoginEvent(WebLoginEvents.LOGIN_ERROR, onLoginError);

  const onAuthorizationExpired = useCallback(() => {
    if (webLoginContext.loginState !== WebLoginState.logined) {
      console.log('AuthorizationExpired: Not Logined');
      return;
    }
    clearLocalJWT();
    console.log('AuthorizationExpired');
    authToken(wallet);
  }, [wallet, webLoginContext.loginState]);
  const onAuthorizationExpiredRef = useRef(onAuthorizationExpired);
  onAuthorizationExpiredRef.current = onAuthorizationExpired;

  useEffect(() => {
    const { remove } = myEvents.AuthorizationExpired.addListener(() => {
      onAuthorizationExpiredRef.current?.();
    });
    return () => {
      remove();
    };
  }, [wallet]);

  return (
    <WalletContext.Provider value={useMemo(() => [state, dispatch], [state, dispatch])}>
      {contextHolder}
      {children}
    </WalletContext.Provider>
  );
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <PortkeyDid.PortkeyProvider networkType={NETWORK_CONFIG.networkType}>
      <WebLoginProvider
        nightElf={{
          connectEagerly: true,
        }}
        portkey={{
          autoShowUnlock: true,
          checkAccountInfoSync: true,
        }}
        discover={{
          autoRequestAccount: true,
          autoLogoutOnDisconnected: true,
          autoLogoutOnNetworkMismatch: true,
          autoLogoutOnAccountMismatch: true,
          autoLogoutOnChainMismatch: true,
          onPluginNotFound: (openStore) => {
            openStore();
          },
        }}
        extraWallets={['discover', 'elf']}>
        <WalletProvider>{children}</WalletProvider>
      </WebLoginProvider>
    </PortkeyDid.PortkeyProvider>
  );
}
