import React from 'react';
import dayjs from 'dayjs';
import { Tabs, TabsProps, Flex } from 'antd';
import { Typography, FontWeightEnum } from 'aelf-design';
import CommonCard from 'components/CommonCard';
import CommonWrapText, { CommonWrapTextAlignType } from 'components/CommonWrapText';
import { IProjectInfo } from 'types/project';
import { getPreSalePriceAmount } from 'utils';
import { divDecimalsStr } from 'utils/calculate';
import './styles.less';

const { Text } = Typography;

enum ProjectTabsLabel {
  DESCRIPTION = 'Description',
  TOKEN_SALE = 'Token Sale',
}

interface IProjectTabsProps {
  projectInfo?: IProjectInfo;
}

interface IIdoInformationDataItem {
  key: string;
  label: string | React.ReactNode;
  value: string | React.ReactNode;
}

type TIdoInformationData = {
  title: string;
  data: IIdoInformationDataItem[];
}[];

const renderCardRowTimeWrapText = (time?: string) => {
  if (!time) {
    return '--';
  } else {
    const value = dayjs(time).format('DD-MM-YYYY\nH:mm [UTC] Z');
    const rowTextList = value.split('\n');
    return (
      <CommonWrapText
        align={CommonWrapTextAlignType.RIGHT}
        textProps={{ fontWeight: FontWeightEnum.Medium }}
        rowTextList={rowTextList}
      />
    );
  }
};

const renderCardRow = ({ key, label, value }: IIdoInformationDataItem) => {
  let labelElement = label;
  if (typeof label === 'string') {
    labelElement = <Text>{labelElement}</Text>;
  }

  let valueElement = value;
  if (typeof value === 'string') {
    valueElement = (
      <Text className="text-right" fontWeight={FontWeightEnum.Medium}>
        {valueElement}
      </Text>
    );
  }
  return (
    <Flex key={key} className="card-row" justify="space-between" align="self-start" gap={16}>
      {labelElement}
      {valueElement}
    </Flex>
  );
};

export default function ProjectTabs({ projectInfo }: IProjectTabsProps) {
  const idoInformationData: TIdoInformationData = [
    {
      title: 'Information',
      data: [
        {
          key: 'Sale Price',
          label: 'Sale Price',
          value: projectInfo?.preSalePrice ? (
            <CommonWrapText
              align={CommonWrapTextAlignType.RIGHT}
              textProps={{ fontWeight: FontWeightEnum.Medium }}
              rowTextList={[
                `1 ${projectInfo?.toRaiseToken?.symbol ?? '--'} =`,
                `${getPreSalePriceAmount({
                  preSalePrice: projectInfo?.preSalePrice,
                  crowdFundingIssueToken: projectInfo?.crowdFundingIssueToken,
                  toRaiseToken: projectInfo?.toRaiseToken,
                  isFormat: true,
                })} ${projectInfo?.crowdFundingIssueToken?.symbol ?? '--'}`,
              ]}
            />
          ) : (
            '--'
          ),
        },
        {
          key: 'Total Amount for Sale',
          label: 'Total Amount for Sale',
          value: `${divDecimalsStr(
            projectInfo?.crowdFundingIssueAmount,
            projectInfo?.crowdFundingIssueToken?.decimals ?? 8,
          )} ${projectInfo?.crowdFundingIssueToken?.symbol ?? '--'}`,
        },
        {
          key: 'Goal',
          label: 'Goal',
          value: `${divDecimalsStr(projectInfo?.targetRaisedAmount, projectInfo?.toRaiseToken?.decimals)} ${
            projectInfo?.toRaiseToken?.symbol || '--'
          }`,
        },
        {
          key: 'Unsold Tokens',
          label: 'Unsold Tokens',
          value: projectInfo ? (projectInfo?.isBurnRestToken ? 'Burn' : 'Return') : '--',
        },
      ],
    },
    {
      title: 'Schedule',
      data: [
        {
          key: 'Sale Start Time',
          label: <CommonWrapText rowTextList={['Sale', 'Start Time']} />,
          value: renderCardRowTimeWrapText(projectInfo?.startTime),
        },
        {
          key: 'Sale End Time',
          label: <CommonWrapText rowTextList={['Sale', 'End Time']} />,
          value: renderCardRowTimeWrapText(projectInfo?.endTime),
        },
        {
          key: 'Token Distribution Time',
          label: <CommonWrapText rowTextList={['Token', 'Distribution Time']} />,
          value: renderCardRowTimeWrapText(projectInfo?.tokenReleaseTime),
        },
      ],
    },
  ];

  const items: TabsProps['items'] = [
    {
      key: ProjectTabsLabel.DESCRIPTION,
      label: ProjectTabsLabel.DESCRIPTION,
      children: <Text className="white-space-pre-wrap">{projectInfo?.additionalInfo?.projectDescription || '--'}</Text>,
    },
    {
      key: ProjectTabsLabel.TOKEN_SALE,
      label: ProjectTabsLabel.TOKEN_SALE,
      children: (
        <div className="tabs-ido-information-wrapper flex">
          {idoInformationData.map(({ title, data }, index) => (
            <CommonCard className="flex-1" key={index} title={title}>
              <div className="ido-information-card-content-wrapper">{data.map((item) => renderCardRow(item))}</div>
            </CommonCard>
          ))}
        </div>
      ),
    },
  ];

  return <Tabs size="small" items={items} />;
}
