import { IconBaseProps } from '@ant-design/icons/lib/components/Icon';
import clsx from 'clsx';
import IconFont from 'components/IconFont';
import './styles.less';
import { pageToTop } from './utils';
export default function ToTop({
  type = 'arrow-up',
  onClick = () => pageToTop(),
  ...props
}: {
  type?: string;
} & IconBaseProps) {
  return <IconFont {...props} type={type} onClick={onClick} className={clsx('scroll-to-top', props.className)} />;
}
