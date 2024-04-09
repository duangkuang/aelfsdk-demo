import { useCallback, useMemo, useRef, useState } from 'react';
import { Flex, message } from 'antd';
import { Button, IButtonProps, Modal, Typography } from 'aelf-design';
import UpdateModal, { UpdateModalInterface } from './UpdateModal';
import AddressValidationModal from './AddressValidationModal';
import { emitLoading } from 'utils/events';
import { success } from 'assets/images';
import { UpdateType } from './types';
import './styles.less';
import Web3Button from 'components/Web3Button';
import { useViewContract } from 'contexts/useViewContract/hooks';
import {
  TWhitelistIdentifyItem,
  WhitelistAddressIdentifyStatusEnum,
  identifyWhitelistData,
} from 'utils/parseWhiteList';
import { useWallet } from 'contexts/useWallet/hooks';
import { NETWORK_CONFIG } from 'constants/network';

const { Text } = Typography;

interface IUpdateWhitelistUsersButtonProps {
  buttonProps: IButtonProps;
  updateType: UpdateType;
  whitelistId?: string;
  onSuccess?: () => void;
}

export default function UpdateWhitelistUsers({
  buttonProps,
  updateType,
  whitelistId,
  onSuccess,
}: IUpdateWhitelistUsersButtonProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const updateModalRef = useRef<UpdateModalInterface>();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddressValidationModalOpen, setIsAddressValidationModalOpen] = useState(false);
  const [isRemoveUsersConfirmModalOpen, setIsRemoveUsersConfirmModalOpen] = useState(false);
  const [isUpdateSuccessModalOpen, setIsUpdateSuccessModalOpen] = useState(false);
  const [validationData, setValidationData] = useState<TWhitelistIdentifyItem[]>([]);
  const { wallet } = useWallet();
  const activeAddressList = useMemo(
    () =>
      validationData
        .filter((item) => item.status === WhitelistAddressIdentifyStatusEnum.active)
        .map((item) => item.address),
    [validationData],
  );

  const { getWhitelistUserList } = useViewContract();
  const onUpdateSubmit = useCallback(
    async (uploadAddressList: string[]) => {
      setIsUpdateModalOpen(false);

      emitLoading(true, {
        text: (
          <>
            Checking the address{uploadAddressList.length > 1 ? 'es' : ''}...
            <br />
            Please wait a while.
          </>
        ),
      });
      try {
        const userList = await getWhitelistUserList(whitelistId || '');
        const userAddressList = userList.map((item) => item.address);

        const _validationData = await identifyWhitelistData({
          originData: userAddressList,
          identifyData: uploadAddressList,
          type: updateType,
        });
        setValidationData(_validationData);
      } catch (error: any) {
        messageApi.open({
          type: 'error',
          content: error?.message || 'Validate failed',
        });
        console.log('onUpdateSubmit error', error);
      }
      emitLoading(false);

      setIsAddressValidationModalOpen(true);
    },
    [getWhitelistUserList, messageApi, updateType, whitelistId],
  );

  const onValidationConfirm = useCallback(async () => {
    emitLoading(true);
    try {
      const txResult = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.whitelistContractAddress,
        methodName:
          updateType === UpdateType.ADD ? 'AddAddressInfoListToWhitelist' : 'RemoveAddressInfoListFromWhitelist',
        args: {
          whitelistId,
          extraInfoIdList: {
            value: [
              {
                addressList: {
                  value: activeAddressList.map((item) => ({
                    address: item,
                  })),
                },
              },
            ],
          },
        },
      });
      console.log('txResult', txResult);

      setIsUpdateSuccessModalOpen(true);
      onSuccess?.();
    } catch (error: any) {
      messageApi.open({
        type: 'error',
        content: error?.message || 'Update users failed',
      });
      console.log('onValidationConfirm error', error);
    }
    emitLoading(false);
  }, [activeAddressList, messageApi, onSuccess, updateType, wallet, whitelistId]);

  const init = useCallback(() => {
    updateModalRef.current?.reset();
    setValidationData([]);
    setIsUpdateModalOpen(true);
  }, []);

  return (
    <>
      {contextHolder}
      <Web3Button {...buttonProps} onClick={init} />
      <UpdateModal
        ref={updateModalRef}
        updateType={updateType}
        modalOpen={isUpdateModalOpen}
        onModalCancel={() => setIsUpdateModalOpen(false)}
        onModalSubmit={onUpdateSubmit}
      />
      <AddressValidationModal
        updateType={updateType}
        modalOpen={isAddressValidationModalOpen}
        validationData={validationData}
        onModalCancel={() => setIsAddressValidationModalOpen(false)}
        onModalBack={() => {
          setIsAddressValidationModalOpen(false);
          setIsUpdateModalOpen(true);
        }}
        onModalConfirm={() => {
          setIsAddressValidationModalOpen(false);
          if (updateType === UpdateType.REMOVE) {
            setIsRemoveUsersConfirmModalOpen(true);
          } else {
            onValidationConfirm();
          }
        }}
      />
      <Modal
        className="common-modal"
        title="Remove Users from Whitelist"
        footer={null}
        centered
        destroyOnClose
        open={isRemoveUsersConfirmModalOpen}
        onCancel={() => {
          setIsRemoveUsersConfirmModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <Text className="text-center">
            Upon confirmation, {activeAddressList.length} whitelisted users will be removed.
          </Text>
          <Flex className="mobile-flex-vertical-reverse" gap={16}>
            <Button
              className="flex-1"
              onClick={() => {
                setIsRemoveUsersConfirmModalOpen(false);
                setIsAddressValidationModalOpen(true);
              }}>
              Back
            </Button>
            <Button
              className="flex-1"
              type="primary"
              danger
              onClick={() => {
                setIsRemoveUsersConfirmModalOpen(false);
                onValidationConfirm();
              }}>
              Confirm
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <Modal
        wrapClassName="whitelist-users-update-success-modal"
        title={`${updateType === UpdateType.ADD ? 'Added' : 'Removed'} Successfully`}
        footer={null}
        centered
        destroyOnClose
        open={isUpdateSuccessModalOpen}
        onCancel={() => setIsUpdateSuccessModalOpen(false)}>
        <Flex vertical gap={24} align="center">
          <Flex vertical gap={8} align="center">
            <img className="success-icon" src={success} alt="success" />
            <Text className="text-center">
              {activeAddressList.length} address{activeAddressList.length > 1 ? 'es' : ''}{' '}
              {updateType === UpdateType.ADD ? 'added to' : 'removed from'} the whitelist
            </Text>
          </Flex>
          <Button className="modal-single-button" type="primary" onClick={() => setIsUpdateSuccessModalOpen(false)}>
            OK
          </Button>
        </Flex>
      </Modal>
    </>
  );
}
