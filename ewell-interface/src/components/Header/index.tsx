import clsx from 'clsx';
import { useMobile } from 'contexts/useStore/hooks';
import { useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-use';
import arrowSvg from 'assets/images/arrow.svg';
import './styles.less';
import { useWallet } from 'contexts/useWallet/hooks';
import { WebLoginState } from 'aelf-web-login';
import { Button } from 'aelf-design';
import { useCheckRoute } from 'hooks';
import menuSvg from './images/menu.svg';
import { COMMUNITY_LIST } from 'constants/community';
import { WelcomeModal } from 'components/WelcomeModal';
import { ICommonDrawerInterface } from 'components/CommonDrawer';
import { CommunityItem } from './components/CommunityItem';
import { MenuDrawer } from './components/MenuDrawer';
import { logo } from 'assets/images';
import { MyButton } from './components/MyButton';
import './common.less';

export type TMenuItem = {
  name: string;
  icon?: string;
  content?: string;
  onClick?: () => void;
  children?: TMenuItem[];
  isActive?: boolean;
};

export default function Header() {
  const isMobile = useMobile();
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const isHome = useMemo(() => {
    return pathname === '/';
  }, [pathname]);

  const { login, loginState } = useWallet();
  const isProjectPage = useCheckRoute('projects/all');

  const menuList: TMenuItem[] = useMemo(
    () => [
      {
        name: 'Projects',
        onClick: () => {
          console.log('project');
          navigate('/projects/all');
        },
        isActive: isProjectPage,
      },
      {
        name: 'Community',
        children: COMMUNITY_LIST.map((item) => ({
          ...item,
          onClick: () => {
            window.open(item.link, '_blank');
          },
        })),
      },
      {
        name: 'Launch with ewell',
        onClick: () => {
          if (loginState === WebLoginState.logining) return;
          if (loginState === WebLoginState.logined) {
            navigate('/create-project');
          }
          if (loginState === WebLoginState.initial || loginState === WebLoginState.lock) return login();
        },
      },
    ],
    [isProjectPage, login, loginState, navigate],
  );

  const menuDrawerRef = useRef<ICommonDrawerInterface>();
  const switchMenuOpen = useCallback(() => {
    menuDrawerRef.current?.show();
  }, []);

  return (
    <>
      <header className="header common-page">
        <div className="header-body flex-row-center">
          <img
            className="header-logo cursor-pointer"
            src={logo}
            alt="logo"
            onClick={() => navigate('/', { replace: true })}
          />
          <div className="btn-row">
            {!isMobile &&
              menuList.map((menu, menuIdx) => (
                <div className="btn-item-wrap" key={menuIdx}>
                  <Button
                    className={clsx('btn-item-box', menu.isActive && 'btn-item-box-active')}
                    type="link"
                    onClick={menu.onClick}>
                    {menu.name}
                    {menu.children && <img className="arrow-wrap " src={arrowSvg} alt="" />}
                  </Button>
                  {menu.children && (
                    <div className="drawer-wrap">
                      <div className="drawer-wrap-box">
                        {menu.children.map((childMenu, childMenuIdx) => (
                          <CommunityItem key={childMenuIdx} data={childMenu} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            {isMobile && <img className="menu-btn" src={menuSvg} onClick={switchMenuOpen} />}

            {!isHome && <MyButton />}
          </div>
        </div>
      </header>
      <WelcomeModal />
      {isMobile && <MenuDrawer drawerRef={menuDrawerRef} list={menuList} />}
    </>
  );
}
