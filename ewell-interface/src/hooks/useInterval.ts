import { DependencyList, useEffect, useRef } from 'react';
import { useDeepCompareEffect } from 'react-use';

const useInterval = (callback: () => void, delay?: number | null, deps?: DependencyList): void => {
  const savedCallback = useRef<() => void>();
  const interval = useRef<any>();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useDeepCompareEffect(() => {
    savedCallback.current?.();
    if (delay !== null) {
      interval.current = setInterval(() => savedCallback.current?.(), delay || 0);
      return () => clearInterval(interval.current);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, deps]);

  return interval.current;
};

export default useInterval;
