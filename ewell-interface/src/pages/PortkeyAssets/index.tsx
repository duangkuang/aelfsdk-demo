import './styles.less';
import assetsBackImg from './images/assetsBack.svg';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { PortkeyDid, WebLoginState } from 'aelf-web-login';
import { useWallet } from 'contexts/useWallet/hooks';
import { NETWORK_CONFIG } from 'constants/network';
import { useEffectOnce } from 'react-use';

export default function PortkeyAssets() {
  const navigate = useNavigate();
  const { wallet, loginState } = useWallet();
  const isLogin = useMemo(() => loginState === WebLoginState.logined, [loginState]);

  useEffectOnce(() => {
    if (!isLogin) {
      navigate('/', { replace: true });
    }
  });

  const onOverviewBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return isLogin ? (
    <PortkeyDid.PortkeyAssetProvider
      pin={wallet?.walletInfo.portkeyInfo?.pin || ''}
      caHash={wallet?.walletInfo.portkeyInfo?.caInfo.caHash}
      originChainId={wallet?.walletInfo.portkeyInfo?.chainId || NETWORK_CONFIG.sideChainId}>
      <PortkeyDid.Asset
        className="portkey-assets"
        backIcon={<img className="assets-back-wrap" src={assetsBackImg} alt="" />}
        overrideAchConfig={{
          appId: 'H41s4ysiPX57fj31',
          baseUrl: 'https://ramp.alchemypay.org',
          updateAchOrder: '/api/app/thirdPart/order/alchemy',
        }}
        onLifeCycleChange={(lifeCycle) => {
          console.log(lifeCycle, 'onLifeCycleChange');
        }}
        onOverviewBack={onOverviewBack}
      />
    </PortkeyDid.PortkeyAssetProvider>
  ) : (
    <></>
  );
}
