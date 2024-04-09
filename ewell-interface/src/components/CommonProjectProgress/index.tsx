import { ComponentProps, useMemo } from 'react';
import { Flex } from 'antd';
import { Progress, Typography } from 'aelf-design';
import { ProjectStatus } from 'types/project';

const { Text } = Typography;

interface ICommonProjectProgressProps {
  wrapFlexGap?: number;
  textProps?: ComponentProps<typeof Text>;
  progressPercent: number;
  projectStatus?: ProjectStatus;
  currentRaisedAmount: string;
  targetRaisedAmount: string;
  toRaiseTokenSymbol?: string;
}

export default function CommonProjectProgress({
  wrapFlexGap,
  textProps,
  progressPercent,
  projectStatus,
  currentRaisedAmount,
  targetRaisedAmount,
  toRaiseTokenSymbol,
}: ICommonProjectProgressProps) {
  const progressPercentStr = useMemo(
    () => (Infinity == progressPercent ? '--' : `${progressPercent.toFixed(0)}%`),
    [progressPercent],
  );

  return (
    <Flex vertical gap={wrapFlexGap ?? 8}>
      <Progress
        size={['100%', 12]}
        percent={progressPercent}
        strokeColor={projectStatus === ProjectStatus.PARTICIPATORY ? '#131631' : '#C1C2C9'}
        trailColor="#F5F5F6"
      />
      <Flex gap={16} align="center" justify="space-between">
        <Text {...textProps}>{progressPercentStr}</Text>
        <Text {...textProps}>
          {currentRaisedAmount}/{targetRaisedAmount} {toRaiseTokenSymbol || '--'}
        </Text>
      </Flex>
    </Flex>
  );
}
