import clsx from 'clsx';
import { Typography } from 'aelf-design';
import { PROJECT_STATUS_TEXT_MAP } from 'constants/project';
import { ProjectStatus } from 'types/project';
import './styles.less';

const { Text } = Typography;

interface ICommonProjectStatusTagProps {
  className?: string;
  status: ProjectStatus;
}

export default function CommonProjectStatusTag({ className, status }: ICommonProjectStatusTagProps) {
  return (
    <div
      className={clsx(className, 'common-project-status-tag', {
        'common-project-status-tag-purple':
          status === ProjectStatus.UPCOMING ||
          status === ProjectStatus.UNLOCKED ||
          status === ProjectStatus.PARTICIPATORY,
      })}>
      <Text size="small">{PROJECT_STATUS_TEXT_MAP[status]}</Text>
    </div>
  );
}
