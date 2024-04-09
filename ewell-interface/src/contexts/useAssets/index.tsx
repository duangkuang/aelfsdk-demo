import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { TAssetsState } from './types';
import { LocalStorageKey } from 'constants/localStorage';
import { useEffectOnce } from 'react-use';

export const DESTROY = 'DESTROY';
export const SET_TX_FEE = 'SET_TX_FEE';
export const SET_TOKEN_PRICE = 'SET_TOKEN_PRICE';

const INITIAL_STATE = {};
const AssetsContext = createContext<any>(INITIAL_STATE);

export function useAssetsContext(): [TAssetsState, React.Dispatch<any>] {
  return useContext(AssetsContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case SET_TX_FEE: {
      localStorage.setItem(LocalStorageKey.TX_FEE, JSON.stringify(payload.txFee));
      return { ...state, txFee: payload.txFee };
    }
    case SET_TOKEN_PRICE: {
      const tokenPrice = { ...state.tokenPrice, ...payload.tokenPrice };
      localStorage.setItem(LocalStorageKey.TOKEN_PRICE, JSON.stringify(tokenPrice));
      return { ...state, tokenPrice };
    }
    case DESTROY: {
      return {};
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

export default function AssetsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffectOnce(() => {
    const txFeeStorage = localStorage.getItem(LocalStorageKey.TX_FEE);
    const tokenPriceStorage = localStorage.getItem(LocalStorageKey.TOKEN_PRICE);
    try {
      const txFee = txFeeStorage ? JSON.parse(txFeeStorage) : null;
      if (txFee) {
        dispatch({ type: SET_TX_FEE, payload: { txFee } });
      }
    } catch (error) {
      console.log('Init txFee', error);
    }

    try {
      const tokenPrice = tokenPriceStorage ? JSON.parse(tokenPriceStorage) : null;
      if (tokenPrice) {
        dispatch({ type: SET_TOKEN_PRICE, payload: { tokenPrice } });
      }
    } catch (error) {
      console.log('Init txFee', error);
    }
  });

  return (
    <AssetsContext.Provider value={useMemo(() => [state, dispatch], [state, dispatch])}>
      {children}
    </AssetsContext.Provider>
  );
}
