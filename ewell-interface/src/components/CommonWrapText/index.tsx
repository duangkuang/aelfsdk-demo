import clsx from 'clsx';
import { ITextProps, Typography } from 'aelf-design';
import { Flex } from 'antd';

const { Text } = Typography;

export enum CommonWrapTextAlignType {
  LEFT = 'left',
  RIGHT = 'right',
}

interface ICommonWrapTextProps {
  align?: CommonWrapTextAlignType;
  rowTextList: string[];
  textProps?: ITextProps;
}

export default function CommonWrapText({
  align = CommonWrapTextAlignType.LEFT,
  rowTextList,
  textProps,
}: ICommonWrapTextProps) {
  return (
    <Flex wrap="wrap" justify={align === CommonWrapTextAlignType.LEFT ? 'flex-start' : 'flex-end'} gap={3}>
      {rowTextList.map((text, index) => (
        <Text
          {...textProps}
          key={index}
          className={clsx(textProps?.className, { ['text-right']: align === CommonWrapTextAlignType.RIGHT })}>
          {text}
        </Text>
      ))}
    </Flex>
  );
}
