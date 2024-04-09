import { useState, useEffect, useMemo } from 'react';
import { Flex, message } from 'antd';
import { Button, Modal, Typography, Input } from 'aelf-design';
import CommonModalSwitchDrawer from 'components/CommonModalSwitchDrawer';
import { success } from 'assets/images';
import { useWallet } from 'contexts/useWallet/hooks';
import { emitLoading, emitSyncTipsModal } from 'utils/events';
import { NETWORK_CONFIG } from 'constants/network';
import './styles.less';

interface IWhitelistTasksButtonProps {
  whitelistId?: string;
  whitelistTasksUrl?: string;
  disabled?: boolean;
}

const { Text } = Typography;

export default function WhitelistTasksButton({ whitelistId, whitelistTasksUrl, disabled }: IWhitelistTasksButtonProps) {
  const { wallet, checkManagerSyncState } = useWallet();
  const [messageApi, contextHolder] = message.useMessage();

  const [isWhitelistTasksModalOpen, setIsWhitelistTasksModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');

  useEffect(() => {
    if (isWhitelistTasksModalOpen) {
      setUrlInputValue(whitelistTasksUrl || '');
    }
  }, [isWhitelistTasksModalOpen, whitelistTasksUrl]);

  const handleSubmit = async () => {
    setIsWhitelistTasksModalOpen(false);
    emitLoading(true);
    const isManagerSynced = await checkManagerSyncState();
    if (!isManagerSynced) {
      emitLoading(false);
      emitSyncTipsModal(true);
      return;
    }
    try {
      const result = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.whitelistContractAddress,
        methodName: 'ChangeWhitelistUrl',
        args: {
          whitelistId,
          url: urlInputValue,
        },
      });
      console.log('ChangeWhitelistUrl result', result);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.log('ChangeWhitelistUrl error', error);
      messageApi.open({
        type: 'error',
        content: error?.message || 'ChangeWhitelistUrl failed',
      });
    } finally {
      emitLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Button onClick={() => setIsWhitelistTasksModalOpen(true)}>Whitelist Tasks</Button>
      <CommonModalSwitchDrawer
        title="Whitelist Tasks"
        open={isWhitelistTasksModalOpen}
        onCancel={() => setIsWhitelistTasksModalOpen(false)}>
        <Flex vertical gap={24}>
          <Flex vertical gap={12}>
            <Text className="text-center">
              Please provide a publicly accessible link that explains the whitelist tasks.
            </Text>
            <Input placeholder="https://" value={urlInputValue} onChange={(e) => setUrlInputValue(e.target.value)} />
          </Flex>
          <Flex gap={16}>
            <Button className="flex-1" onClick={() => setIsWhitelistTasksModalOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" type="primary" disabled={disabled || !urlInputValue} onClick={handleSubmit}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </CommonModalSwitchDrawer>
      <Modal
        className="common-modal"
        title="Whitelist Tasks Updated"
        footer={null}
        centered
        destroyOnClose
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}>
        <Flex vertical gap={24} align="center">
          <Flex vertical gap={8} align="center">
            <img className="success-icon" src={success} alt="success" />
            <Text>The whitelist tasks have been successfully updated.</Text>
          </Flex>
          <Button
            className="whitelist-tasks-update-success-button"
            type="primary"
            onClick={() => setIsSuccessModalOpen(false)}>
            OK
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
