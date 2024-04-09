import clsx from 'clsx';
import { useState } from 'react';
import { union } from 'assets/images';
import './styles.less';

export default function ProjectLogo({ className, src = '', alt }: { className?: string; src?: string; alt?: string }) {
  const [err, setErr] = useState<boolean>();
  if (!err) return <img alt={alt} className={clsx('project-logo', className)} src={src} onError={() => setErr(true)} />;
  return (
    <div className={clsx('project-logo', 'flex-center', className)}>
      <img alt={alt} src={union} />
    </div>
  );
}
