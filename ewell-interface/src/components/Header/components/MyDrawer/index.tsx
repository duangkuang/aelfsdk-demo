import { MutableRefObject, useCallback, useState } from 'react';
import './styles.less';
import { CommonDrawer, ICommonDrawerInterface } from 'components/CommonDrawer';
import { arrow } from 'assets/images';
import clsx from 'clsx';
import { WalletInfo } from '../WalletInfo';
import { Button } from 'aelf-design';
import { useWallet } from 'contexts/useWallet/hooks';

export interface IMyDrawerProps {
  drawerRef?: MutableRefObject<ICommonDrawerInterface | undefined>;
}
export const MyDrawer = ({ drawerRef }: IMyDrawerProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { logout } = useWallet();

  const onMyProjectClick = useCallback(() => {
    drawerRef?.current?.hide();
  }, [drawerRef]);

  const onLogout = useCallback(() => {
    drawerRef?.current?.hide();
    logout();
  }, [drawerRef, logout]);
  return (
    <CommonDrawer ref={drawerRef} className="mobile-my-drawer">
      <div className="mobile-my-drawer-body">
        <div className="mobile-menu-item-wrap">
          <div
            className="mobile-menu-item cursor-pointer"
            onClick={() => {
              setIsOpen((v) => !v);
            }}>
            <span className="mobile-menu-item-title">My</span>
            <img
              src={arrow}
              className={clsx([
                'mobile-menu-item-arrow mobile-menu-item-arrow-down',
                isOpen && 'mobile-menu-item-arrow-up',
              ])}
            />
          </div>

          <div className={clsx(['mobile-menu-children-wrap', isOpen && 'mobile-menu-children-wrap-active'])}>
            <div className="mobile-menu-children">
              <WalletInfo onMyProjectClick={onMyProjectClick} />
            </div>
          </div>
        </div>

        <Button type="primary" className="logout-btn" onClick={onLogout}>
          Log out
        </Button>
      </div>
    </CommonDrawer>
  );
};
