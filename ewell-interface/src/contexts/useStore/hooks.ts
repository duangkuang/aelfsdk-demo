import { useMemo } from 'react';
import { useStore } from '.';

export function useMobile() {
  const [{ mobile }] = useStore();
  return useMemo(() => !!mobile, [mobile]);
}

export function useScreenSize() {
  const [{ screenSize }] = useStore();
  return useMemo(() => screenSize, [screenSize]);
}
