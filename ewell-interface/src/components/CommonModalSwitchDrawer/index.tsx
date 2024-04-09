import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Drawer, Flex } from 'antd';
import { Modal, Typography } from 'aelf-design';
import { useScreenSize } from 'contexts/useStore/hooks';
import { ScreenSize } from 'constants/theme';
import { close } from 'assets/images';
import './styles.less';

const { Title } = Typography;

interface ICommonModalSwitchDrawerProps {
  className?: string;
  modalClassName?: string;
  drawerClassName?: string;
  drawerHeight?: number | string;
  modalWidth?: number | string;
  title: string;
  open: boolean;
  onCancel: () => void;
  children: React.ReactNode;
}

export default function CommonModalSwitchDrawer({
  modalClassName,
  drawerClassName,
  drawerHeight,
  modalWidth,
  ...props
}: ICommonModalSwitchDrawerProps) {
  const screenSize = useScreenSize();
  const isSwitchDrawer = useMemo(() => screenSize === ScreenSize.MINI, [screenSize]);

  return isSwitchDrawer ? (
    <Drawer
      {...props}
      className={clsx('common-switch-drawer', drawerClassName, props.className)}
      placement="bottom"
      height={drawerHeight ?? 'auto'}
      closeIcon={null}
      title={
        <Flex align="center">
          <Title className="drawer-title flex-1" level={6}>
            {props.title}
          </Title>
          <img
            className="close-icon cursor-pointer"
            src={close}
            onClick={() => {
              props.onCancel();
            }}
          />
        </Flex>
      }
    />
  ) : (
    <Modal {...props} width={modalWidth} footer={null} centered />
  );
}
