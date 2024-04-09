import { ZERO } from 'constants/misc';
import { SCREEN_SIZE_POINT, ScreenSize } from 'constants/theme';
import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { useEffectOnce } from 'react-use';
import isMobile from 'utils/isMobile';

const INITIAL_STATE = {};
const StoreContext = createContext<any>(INITIAL_STATE);

const body = window.document.getElementsByTagName('body')[0];
body.className = 'pc-site';

const miniScreenPoint = ZERO.plus(SCREEN_SIZE_POINT[ScreenSize.MINI]);
const smallScreenPoint = ZERO.plus(SCREEN_SIZE_POINT[ScreenSize.SMALL]);
const mediumScreenPoint = ZERO.plus(SCREEN_SIZE_POINT[ScreenSize.MEDIUM]);
const largeScreenPoint = ZERO.plus(SCREEN_SIZE_POINT[ScreenSize.LARGE]);
declare type StoreState = {
  mobile?: boolean;
  screenSize: ScreenSize;
};
export function useStore(): [StoreState] {
  return useContext(StoreContext);
}

//reducer payload
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    default:
      return Object.assign({}, state, payload);
  }
}

export default function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [mobile, setMobile] = useState<boolean>();
  const [screenSize, setScreenSize] = useState<ScreenSize>(ScreenSize.ULTRA);

  // isMobile
  useEffectOnce(() => {
    const resize = () => {
      const isM = isMobile();
      setMobile(
        miniScreenPoint.gte(window.innerWidth) ||
          isM.apple.phone ||
          isM.android.phone ||
          isM.apple.tablet ||
          isM.android.tablet,
      );
      if (miniScreenPoint.gte(window.innerWidth)) {
        setScreenSize(ScreenSize.MINI);
      } else if (smallScreenPoint.gte(window.innerWidth)) {
        setScreenSize(ScreenSize.SMALL);
      } else if (mediumScreenPoint.gte(window.innerWidth)) {
        setScreenSize(ScreenSize.MEDIUM);
      } else if (largeScreenPoint.gte(window.innerWidth)) {
        setScreenSize(ScreenSize.LARGE);
      } else {
        setScreenSize(ScreenSize.ULTRA);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  });

  // className
  useEffect(() => {
    if (!body) return;
    const addClassName = [mobile ? 'mobile-site' : 'pc-site'];
    body.className = '';
    addClassName.forEach((i) => {
      if (!body.className.includes(i)) body.className = (body.className.trim() + ' ' + i).trim();
    });
  }, [mobile]);

  return (
    <StoreContext.Provider
      value={useMemo(() => [{ ...state, mobile, screenSize }, { dispatch }], [state, mobile, screenSize])}>
      {children}
    </StoreContext.Provider>
  );
}
