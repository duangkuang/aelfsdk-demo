export const prefixCls = process.env.REACT_APP_PREFIX;

export enum ScreenSize {
  MINI = 'mini',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ULTRA = 'ultra',
}

export const SCREEN_SIZE_POINT = {
  [ScreenSize.MINI]: 640,
  [ScreenSize.SMALL]: 768,
  [ScreenSize.MEDIUM]: 1024,
  [ScreenSize.LARGE]: 1280,
  [ScreenSize.ULTRA]: 1440,
};
