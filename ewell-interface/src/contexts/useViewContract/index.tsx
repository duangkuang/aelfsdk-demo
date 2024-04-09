import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { TViewContractState } from './types';

export const DESTROY = 'DESTROY';
export const SET_VIEW_CONTRACT = 'SET_VIEW_CONTRACT';

const INITIAL_STATE = {};
const ViewContractContext = createContext<any>(INITIAL_STATE);

export function useViewContractContext(): [TViewContractState, React.Dispatch<any>] {
  return useContext(ViewContractContext);
}

//reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case DESTROY: {
      return {};
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

export default function ViewContractProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <ViewContractContext.Provider value={useMemo(() => [state, dispatch], [state, dispatch])}>
      {children}
    </ViewContractContext.Provider>
  );
}
