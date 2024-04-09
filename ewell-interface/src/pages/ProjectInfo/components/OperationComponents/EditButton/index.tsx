import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Button, IButtonProps } from 'aelf-design';
import { edit } from 'assets/images';
import { ProjectListType } from 'types/project';
import './styles.less';

interface IEditButtonProps extends IButtonProps {
  projectId?: string;
  projectName?: string;
  size?: 'large' | 'small';
}

export default function EditButton({ projectId, projectName, size = 'large', ...buttonProps }: IEditButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { from = ProjectListType.ALL } = (location.state || {}) as { from?: ProjectListType };
  return (
    <Button
      {...buttonProps}
      className={clsx('common-edit-button', buttonProps.className)}
      size={size}
      icon={<img className={`${size}-icon`} src={edit} alt="edit" />}
      onClick={() => {
        if (projectId) {
          console.log('button', projectName);
          navigate(`/edit-information/${projectId}`, { state: { projectName, from } });
        }
      }}
    />
  );
}
