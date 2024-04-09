import { ReactNode } from 'react';
import clsx from 'clsx';
import { Typography, FontWeightEnum } from 'aelf-design';
import './styles.less';

const { Title } = Typography;

export interface ICommonCardProps {
  className?: string;
  contentClassName?: string;
  title?: string;
  extra?: ReactNode;
  children?: ReactNode;
}

export default function CommonCard({ className, contentClassName, title, extra, children }: ICommonCardProps) {
  return (
    <div className={clsx('common-card-wrapper', className)}>
      {!!title && (
        <div className="title-wrapper flex-row-center">
          <Title className="title flex-1" level={7} fontWeight={FontWeightEnum.Medium}>
            {title}
          </Title>
          {!!extra && <div className="extra">{extra}</div>}
        </div>
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
