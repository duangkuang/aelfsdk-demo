import { useCallback } from 'react';
import './styles.less';

export interface ICommunityItem {
  name: string;
  icon?: string;
  content?: string;
  onClick?: () => void;
}

export interface ICommunityItemProps {
  data: ICommunityItem;
  onClick?: () => void;
}
export const CommunityItem = ({ data: { name, icon, content, onClick: itemClick }, onClick }: ICommunityItemProps) => {
  const onItemClick = useCallback(() => {
    itemClick?.();
    onClick?.();
  }, [itemClick, onClick]);

  return (
    <div className="menu-community-item-wrap" onClick={onItemClick}>
      <div className="menu-community-item-icon-wrap">
        <img className="menu-community-item-icon" src={icon} alt="" />
      </div>
      <div className="menu-community-item-body-wrap">
        <span className="menu-community-item-title">{name}</span>
        <span className="menu-community-item-content">{content}</span>
      </div>
    </div>
  );
};
