import './styles.less';
import mainPosterImg from './images/background.png';
import multipleCirclesImg from './images/multiple-circles.svg';
import multipleArrowImg from './images/multiple-arrow.svg';
import specialWordCircleImg from './images/special-word-circle.svg';
import { Button } from 'aelf-design';
import Web3Button from 'components/Web3Button';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useMobile } from 'contexts/useStore/hooks';
import { WebLoginState } from 'aelf-web-login';
import { useWallet } from 'contexts/useWallet/hooks';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useBalance } from 'hooks/useBalance';
import { DEFAULT_TOKEN_DECIMALS, DEFAULT_TOKEN_SYMBOL, ZERO } from 'constants/misc';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { Flex, Progress, message } from 'antd';
import { MyButton } from 'components/Header/components/MyButton';
import { getTxResult } from 'utils/aelfUtils';
import detectProvider from '@portkey/detect-provider';
import { getContractBasic } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import { getContract } from '../../contexts/useViewContract/utils';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG } from 'constants/network';

type ChainType = 'tVDW|aelf';

export default function Home() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { wallet, loginState } = useWallet();
  const isLogin = useMemo(() => loginState === WebLoginState.logined, [loginState]);

  const [visible, setVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [money, setMoney] = useState(0);
  const [bet_dict, setBetDict] = useState([]);
  const [percent, setPercent] = useState(0);
  const [withdrawPercent, setWithdrawPercent] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();

  const stateDescription = {
    0: '',
    25: '下注中',
    50: '下注成功',
    75: '等待链上合约执行',
    100: '合约执行成功',
  };

  const withdrawDescription = {
    0: '',
    50: '等待链上合约执行',
    100: '合约执行成功',
  };

  const { balance: ELFBalance } = useBalance(DEFAULT_TOKEN_SYMBOL);

  const { getTokenContract } = useViewContract();

  const owner = useMemo(() => wallet?.walletInfo.address, [wallet?.walletInfo.address]);

  const sendResToGame = (data) => {
    const iframe = document.getElementById('game_iframe') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.contentWindow?.postMessage(data, '*');
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const withdraw = async () => {
    // 调用提现合约
    try {
      setWithdrawVisible(true);
      setWithdrawPercent(50);
      const result = await wallet?.callContract({
        contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
        methodName: 'WithdrawBalance',
        args: {},
      });
      setWithdrawPercent(100);
      await sleep(500);
      sendResToGame({ code: 5, num: 100 });
    } catch (err) {
      sendResToGame({ code: 7 });
      messageApi.info('操作失败');
      return;
    } finally {
      setWithdrawPercent(0);
      setWithdrawVisible(false);
    }
  };

  const onOk = async () => {
    if (percent > 0 && percent < 100) {
      // 提示 正在开奖中，请稍等
      messageApi.info('合约执行中，请稍等');
      return;
    }
    try {
      // 调用接口下注 这里能拿到结果就说明成功了
      var bet_res = await wallet?.callContract<any, any>({
        contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
        methodName: 'PlaceBet',
        args: {
          bankerAmount: bet_dict[0] / 10000,
          playerAmount: bet_dict[1] / 10000,
          tieAmount: bet_dict[2] / 10000,
          bankerPairAmount: bet_dict[3] / 10000,
          playerPairAmount: bet_dict[4] / 10000,
        },
      });
    } catch (err) {
      sendResToGame({ code: 3 });
      setVisible(false);
      return;
    }
    setPercent(25);
    // 获取返回结果
    await sleep(2000);
    setPercent(50);
    try {
      // 调用 开奖合约
      var game_result = await wallet?.callContract<any, any>({
        contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
        methodName: 'BetAndPlay',
        args: {},
      });
      // 开奖结果
      const event = game_result?.Logs?.filter((item) => {
        return item.Name == 'GameOutcome';
      })?.[0];
      setPercent(100);
      await sleep(500);
      setPercent(0);
      setVisible(false);
      // 通知cocos
      sendResToGame({ code: 0, res: event });
      messageApi.info('合约执行成功');
    } catch (err) {
      sendResToGame({ code: 4 });
      setVisible(false);
      return;
    }
  };

  const closeModal = () => {
    // 提示 正在开奖中，请稍等
    if (percent > 0 && percent < 100) {
      // 提示 正在开奖中，请稍等
      messageApi.info('合约执行中，请稍等');
      return;
    }
    // 通知 cocos 未下注
    sendResToGame({ code: 2 });
    setVisible(false);
  };

  useEffect(() => {
    // 获取余额
    // const fetchData = async () => {
    //   const tokenContract = await getTokenContract();
    //   console.log(tokenContract);
    //   const result = await tokenContract.GetBalance.call({
    //     symbol: 'ELF',
    //     owner,
    //   });
    //   console.log(result);
    // };
    // fetchData();
    console.log(ELFBalance);

    const setHouse = async () => {
      console.log(wallet?.walletInfo);

      // const contract = await getContract(
      //   NETWORK_CONFIG.sideChainInfo.endPoint,
      //   'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
      //   wallet,
      // );
      // console.log(contract);
      // var res = await contract.Update.call({
      //   input: 'hello world',
      // });
      // console.log(res);

      console.log(wallet!.walletInfo!.portkeyInfo!.walletInfo.privateKey);

      const contract = await getContractBasic({
        account: aelf.getWallet(wallet!.walletInfo!.portkeyInfo!.walletInfo!.privateKey),
        contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
        rpcUrl: 'https://tdvw-test-node.aelf.io',
      });

      const res = await contract.callSendMethod('Update', wallet!.walletInfo!.portkeyInfo!.walletInfo!.address, {
        input: 'hello world',
      });
      console.log(res);

      // const result = getTxResult(res!.transactionId!);
      // console.log(result);

      // const res = await wallet?.callContract<any, any>({
      //   contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
      //   methodName: 'Update',
      //   args: {
      //     input: 'hello world',
      //   },
      // });
      // console.log('111' + JSON.stringify(res));
      // const res1 = await wallet?.callContract<any, any>({
      //   contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
      //   methodName: 'Read',
      //   args: {},
      // });
      // console.log('2222' + JSON.stringify(res1));
    };
    setHouse();
  }, [ELFBalance]);

  useEffect(() => {
    // 监听来自 iframe 的消息
    const handleMessage = async (event: any) => {
      // 在这里处理接收到的消息
      console.log('Received message from iframe:', event.data);
      if (event.data) {
        if (event.data.type == 'lottery') {
          var sum = 0;
          for (const m of event.data.bet_dict) {
            sum += m;
          }
          setMoney(sum);
          setBetDict(event.data.bet_dict);
          setVisible(true);
        }
        // 预留一个获取用户余额的接口
        else if (event.data.type == 'balance') {
        } else if (event.data.type == 'withdraw') {
          withdraw();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      // 组件卸载时移除事件监听
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const description = stateDescription[percent] || '';

  const withdrawDescriptionDesc = withdrawDescription[withdrawPercent] || '';

  const onProjectsClick = useCallback(() => {
    navigate('/projects/all');
  }, [navigate]);

  const onLaunchClick = useCallback(() => {
    navigate('/create-project');
  }, [navigate]);

  return (
    <div className="home">
      <header className="header common-page">
        <div className="header-body flex-row-center" style={{ height: '50px', width: '80%' }}>
          <div className="btn-row" style={{ marginLeft: 'auto' }}>
            <MyButton />
          </div>
        </div>
      </header>
      <div className="home-body common-page page-body">
        <div className="home-frame" style={{ padding: 0 }}>
          {true && (
            <div className="main-poster-wrap" style={{ backgroundImage: `url(${mainPosterImg})` }}>
              <div className="main-poster"></div>
            </div>
          )}
          {!isLogin && (
            <div
              className="home-content-warp"
              /* style={{ justifyContent: 'center' }} */
            >
              <div className="home-content">
                {false && <img className="multiple-circles-wrap" src={multipleCirclesImg} alt="" />}
                {false && <img className="multiple-arrow-wrap" src={multipleArrowImg} alt="" />}
                {false && <div className="home-title">EWELL IDO</div>}
                <div className="home-sub-title">
                  AELF-Baccarat
                  <br></br>
                  {false && (
                    <span className="special-word-wrap">
                      AELF-百家乐，链上公平游戏
                      {/* <div className="special-word-circle-wrap">
                    {isMobile ? (
                      <img className="special-word-circle-img" src={specialWordCircleImg} alt="" />
                    ) : (
                      <div className="special-word-circle" />
                    )}
                  </div> */}
                    </span>
                  )}
                  <br />
                </div>
                <div className="btn-area">
                  {false && (
                    <Button className="btn-wrap" type="primary" block onClick={onProjectsClick}>
                      Projects
                    </Button>
                  )}
                  <Web3Button className="btn-wrap" block onClick={onLaunchClick}>
                    Login with portkey wallet
                  </Web3Button>
                </div>
              </div>
            </div>
          )}
          {isLogin && (
            <div>
              <iframe
                id="game_iframe"
                src={'http://localhost:8001?caAddress=' + wallet?.walletInfo.address + '&balance=' + ELFBalance}
                style={{ width: '1360px', height: '700px', border: 'none' }}></iframe>
            </div>
          )}

          <Modal title="提示" open={visible} onOk={onOk} onCancel={closeModal}>
            {contextHolder}
            <p>庄胜：{bet_dict[0] / 10000} ELF</p>
            <p>闲胜：{bet_dict[1] / 10000} ELF</p>
            <p>和胜：{bet_dict[2] / 10000} ELF</p>
            <p>庄对：{bet_dict[3] / 10000} ELF</p>
            <p>闲对：{bet_dict[4] / 10000} ELF</p>
            <p>下注总额:{money / 10000} ELF， 确认下注吗？</p>
            <Flex gap="small" vertical>
              <Progress percent={percent} style={{ width: '80%' }} format={() => description}></Progress>
            </Flex>
          </Modal>

          <Modal title="提示" open={withdrawVisible} footer={null}>
            {contextHolder}
            <Flex gap="small" vertical>
              <Progress
                percent={withdrawPercent}
                style={{ width: '80%' }}
                format={() => withdrawDescriptionDesc}></Progress>
            </Flex>
          </Modal>
        </div>
      </div>
    </div>
  );
}
