import { useState, useCallback, useEffect } from 'react';
import { Flex } from 'antd';
import { Modal, Typography, Button } from 'aelf-design';
import myEvents from 'utils/myEvent';

const { Text } = Typography;

export interface ILoadingInfo {
  isLoading: boolean;
  text: string;
}

export default function PageSyncTipsModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setModalHandler = useCallback((isOpen) => {
    setIsModalOpen(isOpen);
  }, []);

  useEffect(() => {
    const { remove } = myEvents.SetGlobalSyncTipsModal.addListener(setModalHandler);

    return () => {
      remove();
    };
  }, [setModalHandler]);

  return (
    <Modal title="Tips" footer={null} centered destroyOnClose open={isModalOpen} onCancel={() => setIsModalOpen(false)}>
      <Flex vertical gap={24} align="center">
        <Text className="text-center">Synchronizing on-chain account information...</Text>
        <Button className="modal-single-button" type="primary" onClick={() => setIsModalOpen(false)}>
          OK
        </Button>
      </Flex>
    </Modal>
  );
}
