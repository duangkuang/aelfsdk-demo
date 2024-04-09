import { useCallback, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Flex, Switch, message } from 'antd';
import { Button, Typography, FontWeightEnum, Modal } from 'aelf-design';
import CommonCard from 'components/CommonCard';
import WhitelistTasksButton from './components/WhitelistTasksButton';
import CancelProjectButton from './components/CancelProjectButton';
import { useWallet } from 'contexts/useWallet/hooks';
import { IProjectInfo, ProjectListType, ProjectStatus } from 'types/project';
import { NETWORK_CONFIG } from 'constants/network';
import UpdateWhitelistUsersButton from 'components/UpdateWhitelistUsersButton';
import { UpdateType } from 'components/UpdateWhitelistUsersButton/types';
import './styles.less';
import { emitSyncTipsModal } from 'utils/events';
import { stringifyUrl } from 'query-string';

const { Text } = Typography;

interface IProjectManagementCardProps {
  projectInfo?: IProjectInfo;
}

export default function ProjectManagementCard({ projectInfo }: IProjectManagementCardProps) {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const location = useLocation();
  const { from = ProjectListType.ALL } = (location.state || {}) as { from?: ProjectListType };
  const { wallet, checkManagerSyncState } = useWallet();
  const [messageApi, contextHolder] = message.useMessage();

  const [isWhitelistSwitchLoading, setIsWhitelistSwitchLoading] = useState(false);
  const [isDisableWhitelistConfirmModalOpen, setIsDisableWhitelistConfirmModalOpen] = useState(false);

  const canEdit = useMemo(() => {
    return projectInfo?.status === ProjectStatus.UPCOMING || projectInfo?.status === ProjectStatus.PARTICIPATORY;
  }, [projectInfo?.status]);

  const showCancelProjectButton = useMemo(() => {
    return (
      projectInfo?.status === ProjectStatus.UPCOMING ||
      projectInfo?.status === ProjectStatus.PARTICIPATORY ||
      projectInfo?.status === ProjectStatus.UNLOCKED
    );
  }, [projectInfo?.status]);

  const handleWhitelistSwitchChange = async (checked: boolean) => {
    setIsWhitelistSwitchLoading(true);
    const isManagerSynced = await checkManagerSyncState();
    if (!isManagerSynced) {
      setIsWhitelistSwitchLoading(false);
      emitSyncTipsModal(true);
      return;
    }
    try {
      const result = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.whitelistContractAddress,
        methodName: checked ? 'EnableWhitelist' : 'DisableWhitelist',
        args: projectInfo?.whitelistId,
      });
      console.log('whitelist result', result);
      messageApi.open({
        type: 'success',
        content: checked ? 'Whitelist Enabled' : 'Whitelist Disabled',
      });
    } catch (error: any) {
      console.log('error', error);
      messageApi.open({
        type: 'error',
        content: error?.message || (checked ? 'Enable whitelist failed' : 'Disable whitelist failed'),
      });
    } finally {
      setIsWhitelistSwitchLoading(false);
    }
  };

  const jumpParticipants = useCallback(() => {
    navigate(
      stringifyUrl({
        url: `/participant-list/${projectId}`,
        query: {
          projectName: projectInfo?.additionalInfo?.projectName || '',
        },
      }),
      {
        state: {
          from,
        },
      },
    );
  }, [navigate, from, projectId, projectInfo]);

  const jumpWhitelistUsers = useCallback(() => {
    navigate(
      stringifyUrl({
        url: `/whitelist-users/${projectInfo?.whitelistId}`,
        query: {
          projectName: projectInfo?.additionalInfo?.projectName || '',
          projectId,
        },
      }),
      {
        state: {
          from,
        },
      },
    );
  }, [navigate, from, projectId, projectInfo?.additionalInfo?.projectName, projectInfo?.whitelistId]);

  return (
    <>
      {contextHolder}
      <CommonCard
        className="project-management-card-wrapper"
        contentClassName="project-management-card-content"
        title="Sale Management">
        <Flex vertical gap={12}>
          <Text fontWeight={FontWeightEnum.Medium}>Participants</Text>
          <Button onClick={jumpParticipants}>Participant List</Button>
        </Flex>
        <div className="divider" />
        <Flex vertical gap={12}>
          <Flex gap={8} justify="space-between">
            <Text fontWeight={FontWeightEnum.Medium}>Whitelist</Text>
            <Flex gap={8} align="center">
              <Text>{projectInfo?.isEnableWhitelist ? 'Enabled' : 'Disabled'}</Text>
              <Switch
                size="small"
                loading={isWhitelistSwitchLoading}
                disabled={!canEdit}
                checked={projectInfo?.isEnableWhitelist}
                onChange={(checked) => {
                  if (checked) {
                    handleWhitelistSwitchChange(true);
                  } else {
                    setIsDisableWhitelistConfirmModalOpen(true);
                  }
                }}
              />
            </Flex>
          </Flex>
          {projectInfo?.isEnableWhitelist && (
            <>
              <WhitelistTasksButton
                whitelistId={projectInfo?.whitelistId}
                whitelistTasksUrl={projectInfo?.whitelistInfo?.url}
                disabled={!canEdit}
              />
              <Button onClick={jumpWhitelistUsers}>Whitelisted Users</Button>
              <UpdateWhitelistUsersButton
                buttonProps={{
                  children: 'Add Users to Whitelist ',
                  disabled: !canEdit,
                }}
                updateType={UpdateType.ADD}
                whitelistId={projectInfo?.whitelistId}
                onSuccess={() => {}}
              />
              <UpdateWhitelistUsersButton
                buttonProps={{
                  children: 'Remove Users from Whitelist',
                  disabled: !canEdit,
                }}
                updateType={UpdateType.REMOVE}
                whitelistId={projectInfo?.whitelistId}
                onSuccess={() => {}}
              />
            </>
          )}
        </Flex>
        {showCancelProjectButton && (
          <>
            <div className="divider" />
            <Flex vertical gap={12}>
              <Text fontWeight={FontWeightEnum.Medium}>Project</Text>
              {showCancelProjectButton && <CancelProjectButton projectInfo={projectInfo} />}
            </Flex>
          </>
        )}
      </CommonCard>
      <Modal
        className="common-modal"
        title="Disable Whitelist"
        footer={null}
        centered
        destroyOnClose
        open={isDisableWhitelistConfirmModalOpen}
        onCancel={() => setIsDisableWhitelistConfirmModalOpen(false)}>
        <Flex vertical gap={24}>
          <Text className="text-center">
            Are you sure you want to disable the whitelist? Once disabled, all users will be eligible to participate in
            the sale.
          </Text>
          <Flex className="mobile-flex-vertical-reverse" gap={16}>
            <Button className="flex-1" onClick={() => setIsDisableWhitelistConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              type="primary"
              danger
              onClick={() => {
                setIsDisableWhitelistConfirmModalOpen(false);
                handleWhitelistSwitchChange(false);
              }}>
              Disable
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
