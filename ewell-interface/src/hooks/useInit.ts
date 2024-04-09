import { useAssets } from 'contexts/useAssets/hooks';
import { useEffectOnce } from 'react-use';

export const useInit = () => {
  const { init: initAssets } = useAssets();

  useEffectOnce(() => {
    initAssets();
  });
};
