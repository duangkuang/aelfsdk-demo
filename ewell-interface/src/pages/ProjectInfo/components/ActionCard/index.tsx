import { useParams } from 'react-router-dom';
import { Flex } from 'antd';
import { Button } from 'aelf-design';
import EditButton from '../OperationComponents/EditButton';
import JoinCard from '../JoinCard';
import ProjectManagementCard from '../ProjectManagementCard';
import { login as loginIcon } from 'assets/images';
import { useWallet } from 'contexts/useWallet/hooks';
import { IProjectInfo } from 'types/project';
import './styles.less';

interface IActionCardProps {
  projectInfo: IProjectInfo;
  isPreview: boolean;
  isLogin: boolean;
  canEdit: boolean;
  isMobileStyle: boolean;
  handleRefresh?: () => void;
}

export default function ActionCard({
  projectInfo,
  isPreview,
  isLogin,
  canEdit,
  isMobileStyle,
  handleRefresh,
}: IActionCardProps) {
  const { login } = useWallet();
  const { projectId } = useParams();

  return (
    <Flex className="action-card-wrapper" vertical gap={24}>
      {canEdit && !isMobileStyle && (
        <EditButton
          className="edit-button"
          projectId={projectId}
          projectName={projectInfo?.additionalInfo?.projectName || '--'}>
          Edit Project Information
        </EditButton>
      )}
      <JoinCard projectInfo={projectInfo} isPreview={isPreview} isLogin={isLogin} handleRefresh={handleRefresh} />
      {!isLogin && (
        <Button
          className="login-button"
          type="primary"
          icon={<img src={loginIcon} alt="login" />}
          onClick={() => login()}>
          Log in to View Details
        </Button>
      )}
      {canEdit && <ProjectManagementCard projectInfo={projectInfo} />}
    </Flex>
  );
}
