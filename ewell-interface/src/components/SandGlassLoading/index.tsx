import clsx from 'clsx';
import { sandGlass } from 'assets/images';
import './styles.less';

export default function SandGlassLoading({ className }: { className?: string }) {
  return <img className={clsx('sand-glass-loading', className)} src={sandGlass} alt="loading" />;
}
