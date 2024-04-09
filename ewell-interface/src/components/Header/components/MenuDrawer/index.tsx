import { CommonDrawer, ICommonDrawerInterface } from 'components/CommonDrawer';
import { TMenuItem } from '../../index';
import { MutableRefObject, useCallback, useState } from 'react';
import clsx from 'clsx';
import { CommunityItem } from '../CommunityItem';
import { arrow } from 'assets/images';

export interface IMenuDrawerProps {
  drawerRef?: MutableRefObject<ICommonDrawerInterface | undefined>;
  list: TMenuItem[];
}
export const MenuDrawer = ({ drawerRef, list }: IMenuDrawerProps) => {
  const [activeMenuIndex, setActiveMenuIndex] = useState<number>();
  const onCommunityClick = useCallback(() => {
    drawerRef?.current?.hide();
  }, [drawerRef]);

  const onMenuClick = useCallback(
    (menu: TMenuItem, menuIdx: number) => {
      if (!menu.children) {
        menu.onClick?.();
        drawerRef?.current?.hide();
        return;
      }
      setActiveMenuIndex((v) => (v === menuIdx ? undefined : menuIdx));
    },
    [drawerRef],
  );

  return (
    <CommonDrawer ref={drawerRef} className="mobile-menu-drawer">
      {list.map((menu, menuIdx) => (
        <div key={menuIdx} className="mobile-menu-item-wrap">
          <div
            className="mobile-menu-item cursor-pointer"
            onClick={() => {
              onMenuClick(menu, menuIdx);
            }}>
            <span className="mobile-menu-item-title">{menu.name}</span>
            <img
              src={arrow}
              className={clsx([
                'mobile-menu-item-arrow',
                menu.children && 'mobile-menu-item-arrow-down',
                activeMenuIndex === menuIdx && 'mobile-menu-item-arrow-up',
              ])}
            />
          </div>

          {menu.children && (
            <div
              className={clsx([
                'mobile-menu-children-wrap',
                activeMenuIndex === menuIdx && 'mobile-menu-children-wrap-active',
              ])}>
              <div className="mobile-menu-children">
                {menu.children.map((childMenu, childMenuIdx) => (
                  <CommunityItem key={childMenuIdx} data={childMenu} onClick={onCommunityClick} />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </CommonDrawer>
  );
};
