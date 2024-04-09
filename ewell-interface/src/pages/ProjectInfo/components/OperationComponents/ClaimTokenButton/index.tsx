import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { Flex, message } from 'antd';
import { Button, Modal, Typography, FontWeightEnum, HashAddress } from 'aelf-design';
import SuccessModal from '../SuccessModal';
import { IProjectInfo } from 'types/project';
import { divDecimalsStr } from 'utils/calculate';
import { useWallet } from 'contexts/useWallet/hooks';
import { emitLoading, emitSyncTipsModal } from 'utils/events';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from 'constants/network';
import { timesDecimals } from 'utils/calculate';
import { useTokenPrice, useTxFee } from 'contexts/useAssets/hooks';
import { renderTokenPrice } from 'utils/project';
import { useBalance } from 'hooks/useBalance';
import { getExploreLink } from 'utils';
import { DEFAULT_TOKEN_SYMBOL, DEFAULT_TOKEN_DECIMALS } from 'constants/misc';

const { Title, Text } = Typography;

interface IClaimTokenButtonProps {
  projectInfo?: IProjectInfo;
}

export default function ClaimTokenButton({ projectInfo }: IClaimTokenButtonProps) {
  const { projectId } = useParams();

  const { wallet, checkManagerSyncState } = useWallet();
  const { tokenPrice } = useTokenPrice(DEFAULT_TOKEN_SYMBOL);
  const { txFee } = useTxFee();
  const [messageApi, contextHolder] = message.useMessage();
  const { balance: defaultTokenBalance, updateBalance: updateDefaultTokenBalance } = useBalance(DEFAULT_TOKEN_SYMBOL);

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    if (isSubmitModalOpen) {
      updateDefaultTokenBalance();
    }
  }, [updateDefaultTokenBalance, isSubmitModalOpen]);

  const txFeeAmount = useMemo(() => {
    return timesDecimals(txFee, DEFAULT_TOKEN_DECIMALS);
  }, [txFee]);

  const notEnoughTokens = useMemo(() => {
    return new BigNumber(defaultTokenBalance ?? 0).lt(txFeeAmount);
  }, [defaultTokenBalance, txFeeAmount]);

  const handleSubmit = async () => {
    setIsSubmitModalOpen(false);
    emitLoading(true, { text: 'Synchronising data on the blockchain...' });
    const isManagerSynced = await checkManagerSyncState();
    if (!isManagerSynced) {
      emitLoading(false);
      emitSyncTipsModal(true);
      return;
    }
    try {
      const result = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.ewellContractAddress,
        methodName: 'Claim',
        args: {
          projectId,
          user: wallet?.walletInfo.address,
        },
      });
      console.log('Claim result', result);
      const { TransactionId } = result;
      setTransactionId(TransactionId);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.log('Claim error', error);
      messageApi.open({
        type: 'error',
        content: error?.message || 'Claim failed',
      });
    } finally {
      emitLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={() => {
          setIsSubmitModalOpen(true);
        }}>
        Claim
      </Button>
      <Modal
        className="common-modal"
        title="Claim"
        footer={null}
        centered
        destroyOnClose
        open={isSubmitModalOpen}
        onCancel={() => {
          setIsSubmitModalOpen(false);
        }}>
        <Flex vertical gap={24}>
          <Text>{`After clicking “Submit”, EWELL transfer ${
            projectInfo?.toRaiseToken?.symbol || DEFAULT_TOKEN_SYMBOL
          } to the designated account.`}</Text>
          <Flex justify="center" align="baseline" gap={8}>
            <Title fontWeight={FontWeightEnum.Medium} level={4}>
              {divDecimalsStr(projectInfo?.toClaimAmount, projectInfo?.crowdFundingIssueToken?.decimals)}
            </Title>
            <Title fontWeight={FontWeightEnum.Medium}>{projectInfo?.crowdFundingIssueToken?.symbol || '--'}</Title>
          </Flex>
          <Flex className="modal-box-data-wrapper mobile-flex-vertical-gap-0" justify="space-between">
            <Text>My address</Text>
            <HashAddress
              className="hash-address-small"
              preLen={8}
              endLen={9}
              chain={DEFAULT_CHAIN_ID}
              address={wallet?.walletInfo.address || ''}
              addressClickCallback={(_, address) => {
                const exploreLink = address ? getExploreLink(address) : '';
                if (exploreLink) {
                  window.open(exploreLink, '_blank');
                }
              }}
            />
          </Flex>
          <Flex justify="space-between">
            <Flex className="mobile-flex-vertical-gap-0" gap={3}>
              <Text>Estimated</Text>
              <Text>Transaction Fee</Text>
            </Flex>
            <Flex className="mobile-flex-vertical-end-gap-2" gap={8} align="baseline">
              <Text>{`${txFee} ${DEFAULT_TOKEN_SYMBOL}`}</Text>
              {renderTokenPrice({
                textProps: {
                  size: 'small',
                },
                amount: txFee,
                decimals: 0,
                tokenPrice,
              })}
            </Flex>
          </Flex>
          <Text
            className={clsx('error-text', 'text-center', { ['display-none']: !notEnoughTokens })}
            fontWeight={FontWeightEnum.Medium}>
            {`Insufficient balance to cover the transaction fee. Please transfer some ${DEFAULT_TOKEN_SYMBOL} to this address before you try again.`}
          </Text>
          <Flex justify="center">
            <Button className="modal-single-button" type="primary" disabled={notEnoughTokens} onClick={handleSubmit}>
              Submit
            </Button>
          </Flex>
        </Flex>
      </Modal>
      <SuccessModal
        modalProps={{
          title: 'Successfully Claimed',
          open: isSuccessModalOpen,
          onCancel: () => {
            setIsSuccessModalOpen(false);
          },
          onOk: () => {
            setIsSuccessModalOpen(false);
          },
        }}
        data={{
          amountList: [
            {
              amount: divDecimalsStr(projectInfo?.toClaimAmount, projectInfo?.crowdFundingIssueToken?.decimals),
              symbol: projectInfo?.crowdFundingIssueToken?.symbol || '--',
            },
          ],
          description: 'Congratulations! You have received the tokens.',
          boxData: {
            label: 'Transaction ID',
            value: transactionId,
          },
        }}
      />
    </>
  );
}
