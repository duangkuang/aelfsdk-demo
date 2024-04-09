import React from 'react';
import { Flex, FlexProps } from 'antd';
import EmptyLogo from 'assets/images/project/emptyLogo.png';

interface EmptyProps extends Omit<FlexProps, 'children'> {
  text?: string | React.ReactNode | any;
  children?: React.ReactNode;
}

const Empty: React.FC<EmptyProps> = ({ text, style, ...props }) => {
  return (
    <Flex justify="center" align="center" {...props} style={{ padding: '48px 0', ...style }}>
      <Flex vertical justify="center" align="center">
        <img src={EmptyLogo} alt="empty logo" style={{ width: 80, height: 80, marginBottom: 16 }} />
        {text ? (
          typeof text === 'string' ? (
            <div style={{ fontSize: 14, textAlign: 'center' }}>{text}</div>
          ) : (
            <>{text}</>
          )
        ) : null}
      </Flex>
    </Flex>
  );
};

export default Empty;
