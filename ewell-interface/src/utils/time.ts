import { ZERO } from 'constants/misc';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const unifyMillisecond = (time: any) => {
  const { seconds } = time || {};
  const tim = ZERO.plus(seconds || time);
  if (tim.isNaN()) return time;
  if (tim.toFixed().length <= 10) return tim.times(1000).toNumber();
  return tim.toNumber();
};

export const unifySecond = (time: any) => {
  const { seconds } = time || {};
  const tim = ZERO.plus(seconds || time);
  if (tim.isNaN()) return time;
  if (tim.toFixed().length !== 10) return Number(tim.toString().slice(0, 10));
  return tim.toNumber();
};

export const timeDuration = (time: any, format = 'HH:mm:ss') => {
  return dayjs.duration(time)?.format(format);
};
