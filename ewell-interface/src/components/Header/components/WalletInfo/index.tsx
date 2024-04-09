import { HashAddress } from 'aelf-design';
import walletSvg from '../../images/wallet.svg';
import { useWallet } from 'contexts/useWallet/hooks';
import { NETWORK_CONFIG } from 'constants/network';
import { useNavigate } from 'react-router-dom';
import projectsSvg from '../../images/projects.svg';
import logoutSvg from '../../images/logout.svg';
import personSvg from '../../images/person.svg';
import './styles.less';
import { useMobile } from 'contexts/useStore/hooks';
import { useCallback } from 'react';
import { getExploreLink } from 'utils';
import { WalletType } from 'aelf-web-login';

export interface IWalletInfoProps {
  onMyProjectClick?: () => void;
}

export const WalletInfo = ({ onMyProjectClick }: IWalletInfoProps) => {
  const { wallet, logout } = useWallet();
  const navigate = useNavigate();
  const isMobile = useMobile();
  const onLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <>
      <div className="wallet-info-item-wrap">
        <img src={personSvg} alt="" />
        <div className="wallet-item-body">
          <span className="wallet-item-title">My Address</span>
          <div className="wallet-item-content">
            <HashAddress
              address={wallet?.walletInfo.address || ''}
              preLen={8}
              endLen={9}
              hasCopy
              chain={NETWORK_CONFIG.sideChainId as any}
              size="small"
              addressClickCallback={(_, address) => {
                const exploreLink = address ? getExploreLink(address) : '';
                if (exploreLink) {
                  window.open(exploreLink, '_blank');
                }
              }}
            />
          </div>
        </div>
      </div>

      {wallet?.walletType === WalletType.portkey && (
        <div
          className="wallet-info-item-wrap"
          onClick={() => {
            navigate('/assets');
            onMyProjectClick?.();
          }}>
          <img src={walletSvg} alt="" />
          <div className="wallet-item-body">
            <span className="wallet-item-title">My Assets</span>
          </div>
        </div>
      )}

      {false && (
        <div
          className="wallet-info-item-wrap"
          onClick={() => {
            navigate('/projects/my');
            onMyProjectClick?.();
          }}>
          <img src={projectsSvg} alt="" />
          <div className="wallet-item-body">
            <span className="wallet-item-title">My Projects</span>
          </div>
        </div>
      )}

      {!isMobile && (
        <div className="wallet-info-item-wrap" onClick={onLogout}>
          <img src={logoutSvg} alt="" />
          <div className="wallet-item-body">
            <span className="wallet-item-title">Log out</span>
          </div>
        </div>
      )}
    </>
  );
};
