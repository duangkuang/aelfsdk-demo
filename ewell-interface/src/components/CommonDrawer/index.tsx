import { Drawer } from 'antd';
import type { DrawerClassNames } from 'antd/es/drawer/DrawerPanel';
import { createStyles } from 'antd-style';
import { useMemo, useState, ReactNode, forwardRef, useCallback, useImperativeHandle } from 'react';
import { logo } from 'assets/images';
import closeBtnSvg from './images/closeBtn.svg';
import './styles.less';
import clsx from 'clsx';

const useStyle = createStyles(() => ({
  'common-drawer-header': {
    display: 'none !important',
  },
  'common-drawer-body': {
    padding: '0 !important',
  },
}));

export interface ICommonDrawerProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
}

export interface ICommonDrawerInterface {
  show: () => void;
  hide: () => void;
}

export const CommonDrawer = forwardRef(
  ({ children, className, onClose, contentClassName }: ICommonDrawerProps, ref) => {
    const { styles } = useStyle();
    const [isOpen, setIsOpen] = useState(false);

    const drawerClassNames: DrawerClassNames = useMemo(
      () => ({
        header: styles['common-drawer-header'],
        body: styles['common-drawer-body'],
      }),
      [styles],
    );

    const show = useCallback(() => {
      setIsOpen(true);
    }, []);

    const hide = useCallback(() => {
      setIsOpen(false);
    }, []);

    useImperativeHandle(ref, () => ({
      show,
      hide,
    }));

    return (
      <Drawer
        rootClassName={clsx(['common-menu-drawer', className])}
        classNames={drawerClassNames}
        onClose={onClose}
        open={isOpen}
        width={'100%'}
        placement="right"
        mask={false}>
        <div className="common-drawer-area">
          <div className="common-drawer-header">
            <img className="common-drawer-header-logo" src={logo} alt="logo" />
            <img
              className="common-drawer-close-btn"
              src={closeBtnSvg}
              onClick={() => {
                setIsOpen(false);
              }}
            />
          </div>
          <div className={clsx(['common-drawer-content', contentClassName])}>{children}</div>
        </div>
      </Drawer>
    );
  },
);
