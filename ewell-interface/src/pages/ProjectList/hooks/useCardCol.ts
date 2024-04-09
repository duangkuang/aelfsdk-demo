import { useWindowSize } from 'react-use';

export const useCardCol = () => {
  const { width } = useWindowSize();
  return [width > 700 ? (width > 985 ? (width > 1350 ? 4 : 3) : 2) : 1];
};
