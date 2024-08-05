import './styles.less';
import mainPosterImg from './images/background.png';
import imgClose from './images/close.png';
import imgLogo from './images/logo.png';
import multipleCirclesImg from './images/multiple-circles.svg';
import multipleArrowImg from './images/multiple-arrow.svg';
import specialWordCircleImg from './images/special-word-circle.svg';
import { Button } from 'aelf-design';
import Web3Button from 'components/Web3Button';
import { useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';
import { useMobile } from 'contexts/useStore/hooks';
import { ElfIcon, WebLoginState } from 'aelf-web-login';
import { useWallet } from 'contexts/useWallet/hooks';
import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useBalance } from 'hooks/useBalance';
import { DEFAULT_TOKEN_DECIMALS, DEFAULT_TOKEN_SYMBOL, ZERO } from 'constants/misc';
import { useViewContract } from 'contexts/useViewContract/hooks';
import { Flex, Progress, message } from 'antd';
import { MyButton } from 'components/Header/components/MyButton';
import { ControlSound } from 'components/Header/components/ControlSound';
import { ControlFullScreen } from 'components/Header/components/ControlFullScreen';
import { ScreenOrientationDetector } from 'components/Header/components/ScreenOrientationDetector';
import { getTxResult } from 'utils/aelfUtils';
import detectProvider from '@portkey/detect-provider';
import { getContractBasic } from '@portkey/contracts';
import { aelf } from '@portkey/utils';
import { getContract } from '../../contexts/useViewContract/utils';
import { DEFAULT_CHAIN_ID, NETWORK_CONFIG, IS_MAINNET_PRODUCTION } from 'constants/network';
import { getLog } from '../../../src/utils/protoUtils';
import { WalletType } from 'aelf-web-login';


export default function Home() {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const { wallet, loginState } = useWallet();
  const isLogin = useMemo(() => loginState === WebLoginState.logined, [loginState]);
  const [isAllowance, setIsAllowance] = useState(true)
  const [visible, setVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [rechargeVisible, setIsRechargeVisible] = useState(false);
  const [money, setMoney] = useState(0);
  const [bet_dict, setBetDict] = useState([]);
  const [percent, setPercent] = useState(0);
  const [withdrawPercent, setWithdrawPercent] = useState(0);
  const [balanceNotEnough, setBalanceNotEnough] = useState(false);
  const [messageShow, setMessageShow] = useState('');
  const [canLottery, setCanLottery] = useState(false);
  const [isPlayDisabled, setIsPlayDisabled] = useState(false);
  const [isWithDrawDisabled, setIsWithDrawDisabled] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [balanceInit, setBalanceInit] = useState('-1');
  const [showControlSound, setIsShowControlSound] = useState(false);

  const [isIOS, setIsIOS] = useState<boolean>(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent));
  }, []);
  const { checkIsNeedApprove } = useViewContract();

  const stateDescription = {
    0: '',
    10: 'Checking approve...',
    30: 'Checking balance...',
    40: 'Betting...',
    60: 'Bet Successfully',
    80: 'Contract Executing...',
    100: 'Contract Executed',
  };

  const withdrawDescription = {
    0: '',
    50: 'Contract Executing...',
    100: 'Contract Executed',
  };

  const { balance: ELFBalance, updateBalance } = useBalance(DEFAULT_TOKEN_SYMBOL);

  const { getTokenContract } = useViewContract();

  const owner = useMemo(() => wallet?.walletInfo.address, [wallet?.walletInfo.address]);

  const sendResToGame = (data) => {
    const iframe = document.getElementById('game_iframe') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.contentWindow?.postMessage(data, '*');
    }
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const closeWithDrawModal = () => {
    // show tip: Contract executing, Please wait
    if (withdrawPercent > 0 && withdrawPercent < 100) {
      setMessageShow('Contract executing, Please wait');
      return;
    }
    sendResToGame({ code: 8 });
    setWithdrawVisible(false);
  };

  const onWithDrawOk = async () => {
    if(withdrawPercent>0 && withdrawPercent<100){
      // show tip: Contract executing, Please wait
      setMessageShow('Contract executing, Please wait');
      return;
    }
    if (percent > 0 && percent < 100) {
      // show tip: Contract executing, Please wait
      setMessageShow('Contract executing, Please wait');
      return;
    }
    setIsWithDrawDisabled(true)
    // call contract for withdraw
    try {
      setWithdrawVisible(true);
      setWithdrawPercent(50);
      var result = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.contractAddress,
        methodName: 'WithdrawBalance',
        args: {},
      });
      await sleep(500);
      console.log('3333' + result)
      if(result){
        const event = getLog(result?.Logs, 'UpdatedMessage');
        setWithdrawPercent(100);
        if(event.UpdatedMessage.value == 0){
          setMessageShow('No ELF available');
        }else{
          setMessageShow('Withdraw successfully, total of ' + (event.UpdatedMessage.value/100000000) +" ELF");
        }
        updateBalance()
        console.log('9999')
        // send game result to cocos
        sendResToGame({ code: 5, num: event.UpdatedMessage.value/1000000, balance: ELFBalance });
      }else{
        setMessageShow('Contract busy');
        sendResToGame({ code: 6 });
      }
    } catch (err:any) {
      console.log(err)
      if(err.message&&(err.message.includes("User Cancel")
      ||err.message.includes("closed the prompt"))){
        setMessageShow("User Cancel Withdraw");
      }else{
        setMessageShow('Contract busy' );
      }
      sendResToGame({ code: 7 });
    } finally {
      setWithdrawPercent(0);
      setWithdrawVisible(false);
      setIsWithDrawDisabled(true);
    }
  }
  

  const onOk = async () => {
    if(withdrawPercent>0 && withdrawPercent<100){
      // show tip: Contract executing, Please wait
      setMessageShow('Contract executing, Please wait');
      return;
    }
    if (percent > 0 && percent < 100) {
      // show tip: Contract executing, Please wait
      setMessageShow('Contract executing, Please wait');
      return;
    }
    var val =
        bet_dict[0] * 1000000 +
        ' ' +
        bet_dict[1] * 1000000 +
        ' ' +
        bet_dict[2] * 1000000 +
        ' ' +
        bet_dict[3] * 1000000 +
        ' ' +
        bet_dict[4] * 1000000;
    /* test data */
    // val = '0 0 10000000 0 0';
    // setMoney(0.1*100000000);
    /* test data */
    console.log(val);
    // check approve
    try{
      setPercent(10);
      await preCreate({
        betAmount: (money*1000000).toString(),
        amount: '1000000000000',
        symbol: 'ELF',
      });
    }catch(err:any){
      console.log("err: "+err.message)
      if(err.message&&(err.message.includes("User Cancel")
      ||err.message.includes("closed the prompt"))){
        setMessageShow("User Cancel Approve");
      }
      setPercent(0);
      setVisible(false);
      sendResToGame({ code: 10 });
      return;
    }
    setPercent(30);
    // balance is not enough
    if((money*1000000)>Number(ELFBalance)){
      // show recharge dialog
      setMessageShow("Insufficient balance, please recharge first");
      setPercent(0);
      setVisible(false);
      setIsRechargeVisible(true);
      return;
    }

    setIsPlayDisabled(true)
    setPercent(40);
    try {
      // call lottery contract 
      console.log(NETWORK_CONFIG.contractAddress)
      var bet_res = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.contractAddress,
        methodName: 'PlaceBet',
        args: {
          value: val,
        },
      });
    } catch (err:any) {
      console.log(err.message)
      if(err.message&&(err.message.includes("User Cancel")
      ||err.message.includes("closed the prompt"))){
        setMessageShow("User Cancel Betting,  waiting for restart");
      }else{
        setMessageShow('Contract busy, betting failed, waiting for restart');
      }
      sendResToGame({ code: 3 });
      setPercent(0);
      setVisible(false);
      setIsPlayDisabled(false)
      return;
    }
    // get result
    setPercent(60);
    await sleep(500);
    setPercent(80);
    try {
      // call withdraw contract
      var game_result = await wallet?.callContract<any, any>({
        contractAddress: NETWORK_CONFIG.contractAddress,
        methodName: 'BetAndPlay',
        args: {},
      });
      console.log(game_result);
      // withdraw result
      // const event = game_result?.Logs?.filter((item) => {
      //   return item.Name == 'GameOutcome';
      // })?.[0];
      const event = getLog(game_result?.Logs, 'GameOutcome');
      // event = {
      //   Result: {
      //     PlayerCard1: 1,
      //     PlayerCard2: 2,
      //     PlayerCard3: 3,
      //     BankerCard1: 4,
      //     BankerCard2: 5,
      //     BankerCard3: 6,
      //     OutCome: 1,
      //     Payout: 10000,
      //   },
      // };

      // try {
      //   console.log(getLog(game_result?.Logs, 'GameOutcome'));
      // } catch (e) {
      //   console.log(e);
      // }
      // console.log(game_result);
      console.log(event);
      setPercent(100);
      await sleep(500);
      setPercent(0);
      setVisible(false);
      updateBalance();
      await sleep(500);
      console.log(ELFBalance)
      // notify cocos
      sendResToGame({ code: 0, balance: ELFBalance, transactionId: game_result.TransactionId, res: event.GameOutcome });
      setMessageShow('Contract execute successfully');
    } catch (err:any) {
      console.log(err.message)
      if(err.message&&(err.message.includes("User Cancel")
      ||err.message.includes("closed the prompt"))){
        setMessageShow("User Cancel Lottery, please use withdrawal function to obtain locked ELF");
      }else{
        setMessageShow('Contract busy, please use withdrawal function to obtain locked ELF');
      }
      sendResToGame({ code: 4 });
      setVisible(false);
      setPercent(0);
      return;
    }finally{
      setIsPlayDisabled(false)
    }
  };

  const closeModal = () => {
    // show tip: Contract executing, Please wait
    if (percent > 0 && percent < 100) {
      setMessageShow('Contract executing, Please wait');
      return;
    }
    // send message(no bet) to cocos
    sendResToGame({ code: 2 });
    setVisible(false);
  };

  const onRechargeOk = () => {
    updateBalance()
    console.log(ELFBalance)
    setIsRechargeVisible(false);
    sendResToGame({code: 9, balance: ELFBalance})
  }

  useEffect(() => {
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

    const setHouse = async () => {
      // var res = await wallet?.callContract<any, any>({
      //   contractAddress: NETWORK_CONFIG.contractAddress,
      //   methodName: 'Update',
      //   args: {
      //     value: "hello world",
      //   },
      // });
      // console.log(res);
      // const event = getLog(res?.Logs, 'UpdatedMessage');
      // console.log(event)
      console.log(wallet);
      // const contract = await getContract(
      //   NETWORK_CONFIG.sideChainInfo.endPoint,
      //   NETWORK_CONFIG.contractAddress,
      //   wallet,
      // );
      // console.log(contract);
      // var res = await contract.Update.call({
      //   input: 'hello world',
      // });
      // console.log(res);

      // console.log(wallet!.walletInfo!.portkeyInfo!.walletInfo.privateKey);

      // const contract = await getContractBasic({
      //   account: aelf.getWallet(wallet!.walletInfo!.portkeyInfo!.walletInfo!.privateKey),
      //   contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
      //   rpcUrl: 'https://tdvw-test-node.aelf.io',
      // });

      // const res = await contract.callSendMethod('Update', wallet!.walletInfo!.portkeyInfo!.walletInfo!.address, {
      //   input: 'hello world',
      // });
      // console.log(res);

      // const result = getTxResult(res!.transactionId!);
      // console.log(result);

      // const res = await wallet?.callContract<any, any>({
      //   contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
      //   methodName: 'Initialize',
      //   args: {},
      // });
      // const res = await wallet?.callContract<any, any>({
      //   contractAddress: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
      //   methodName: 'Update',
      //   args: {
      //     value: 'Hello world',
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
    if(wallet?.walletInfo){
      setHouse();
    }
  }, [wallet]);

  useEffect(()=>{
      console.log(ELFBalance)
      console.log(balanceInit)
      updateBalance()
      console.log(ELFBalance)
      if(balanceInit == '-1' && ELFBalance != '-1'){
        // if(ELFBalance == '0'){
        //   setBalanceInit('0')
        // }else{
        //   setBalanceInit(ELFBalance)
        // }
        setBalanceInit(ELFBalance)
        console.log(balanceInit)
      }
  }, [isLogin,ELFBalance]);

  useEffect(()=>{
    if(balanceNotEnough){
      message.info('Insufficient balance, please recharge first');
      setBalanceNotEnough(false)
      setIsRechargeVisible(true)
    }
  },[balanceNotEnough])

  useEffect(()=>{
    console.log("2222" + messageShow)
    if(messageShow!=''){
      message.info(messageShow);
      setMessageShow('');
    }
  },[messageShow])

  const showMessage = (message)=>{
    message.info(message);
  }

  useEffect(() => {
    // get the message from iframe
    const handleMessage = async (event: any) => {
      // handle message
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
        else if (event.data.type == 'balance') {
        } else if (event.data.type == 'withdraw') {
          setWithdrawVisible(true);
        }else if (event.data.type == 'balance_not_enough'){
          setBalanceNotEnough(true)
        }else if (event.data.type == 'message'){
          setMessageShow(event.data.message)
        }else if (event.data.type == 'recharge'){
          // show recharge dialog
          setIsRechargeVisible(true);
        }else if(event.data.type == 'showAudioMute'){
          setIsShowControlSound(true)
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      // remove handler where component remove
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // check approve 
  const preCreate = useCallback(
    async (params: { betAmount: string; amount: string; symbol: string }) => {
      console.log(isAllowance)
      console.log('22222', wallet?.walletInfo.address || '')
      try {
        const needApprove = await checkIsNeedApprove({
          symbol: params.symbol || '',
          amount: params.betAmount,
          owner: wallet?.walletInfo.address || '',
          spender: NETWORK_CONFIG.contractAddress
        });
        console.log('needApprove', needApprove);
        if (!needApprove){
          setIsAllowance(true);
          return;
        } 
      } catch (error: any) {
        console.log('error', error);
        throw new Error(error?.message || 'GetApproveAmount failed');
      }

      // const allowanceResult = await wallet?.callContract({
      //   contractAddress: NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
      //   methodName: 'GetAllowance',
      //   args: {
      //     spender: 'eCHfp7D7TxHAMnBKJntwdJTSgL4yTYw6X2PoNM33ozT3ef3NQ',
      //     symbol: params.symbol,
      //     owner: wallet?.walletInfo.address || '',
      //   },
      // });
      //console.log('1111', allowanceResult)
      console.log(isAllowance)
      console.log('pre-create-txResult-params', params);
      const txResult = await wallet?.callContract({
        contractAddress: NETWORK_CONFIG.sideChainInfo.tokenContractAddress,
        methodName: 'Approve',
        args: {
          spender: NETWORK_CONFIG.contractAddress,
          symbol: params.symbol,
          amount: params.amount,
        },
      });

      console.log('pre-create-txResult', txResult);
      setIsAllowance(true);
      return txResult;
    },
    [checkIsNeedApprove, wallet],
  );

  const description = stateDescription[percent] || '';

  const withdrawDescriptionDesc = withdrawDescription[withdrawPercent] || '';

  // const onProjectsClick = useCallback(() => {
  //   navigate('/projects/all');
  // }, [navigate]);

  const onLaunchClick = useCallback(() => {
    navigate('/create-project');
  }, [navigate]);

  const onAssetClick = useCallback(() => {
    navigate('/assets');
  }, [navigate]);

  const onMute = () => {
    sendResToGame({code: 90})
  };
  const onUnmute = () => {
    sendResToGame({code: 91})
  };

  return (
    <div className="home">
      <header className="header common-page" style={{ backgroundColor: 'transparent',width: '100%',display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <div className="header-body flex-row-center" style={{ height: '50px', width: '100%',display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div className="btn-row">
            { isLogin && isMobile && showControlSound && (!isIOS) && <ControlFullScreen />}
            { isLogin && showControlSound && <ControlSound onMute={onMute} onUnmute={onUnmute} />}
            <MyButton />
          </div>
        </div>
      </header>
      {isMobile && isLogin && <ScreenOrientationDetector />}
      {/* {true && <ScreenOrientationDetector />} */}
      <div className="home-body common-page page-body">
        <div className="home-frame" style={{ padding: 0 }}>
          {!isLogin && (
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
                <div style={{ lineHeight: 1 }} className="home-sub-title">
                  AELF-Baccarat
                  <br></br>
                  {false && (
                    <span className="special-word-wrap">
                      AELF-Baccarat, Fair Game On Chain
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
                  <Web3Button className="btn-wrap" block onClick={onLaunchClick}>
                    Login with portkey wallet
                  </Web3Button>
                </div>
              </div>
            </div>
          )}
          {isMobile && isLogin && balanceInit!='-1' && wallet?.walletInfo.address &&  (
            <div className="game-wrap" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <iframe
                id="game_iframe"
                src={`http://ec2-13-212-221-198.ap-southeast-1.compute.amazonaws.com/game?caAddress=${wallet?.walletInfo.address}&balance=${balanceInit}`}
                style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
            </div>
          )}
          { !isMobile && isLogin && balanceInit!='-1' && wallet?.walletInfo.address &&  (
            <div className="game-wrap" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
              <iframe
                id="game_iframe"
                allow="autoplay" 
                src={`http://ec2-13-212-221-198.ap-southeast-1.compute.amazonaws.com/game?caAddress=${wallet?.walletInfo.address}&balance=${balanceInit}`}
                // src={'http://ec2-13-212-221-198.ap-southeast-1.compute.amazonaws.com/'}
                style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
                {/* <iframe
                id="game_iframe"
                // http://m.fft360.cn/game?caAddress=
                //http://ec2-13-212-88-131.ap-southeast-1.compute.amazonaws.com/game?caAddress=
                src={`http://ec2-13-212-88-131.ap-southeast-1.compute.amazonaws.com/game?caAddress=${wallet?.walletInfo.address}&balance=${balanceInit}`}
                // src={'http://ec2-13-212-221-198.ap-southeast-1.compute.amazonaws.com/'}
                style={{ width: '100%', height: '100%', border: 'none' }}></iframe> */}
            </div>
          )}
          
            {/* open={visible} */}
          <Modal
            className="custom-modal"
            closable={false}
            footer={null}
            open={false}
            onOk={onOk}
            onCancel={closeModal}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop: '-8vmin' }}
          >
            {contextHolder}
            <div className="modal-cus-container">
              <img src={imgClose} alt="" onClick={closeModal} className={`img-close ${isPlayDisabled ? 'display-none' : ''}`} />
              <div className="modal-right">
                {/* <div className="logo-content">
                  <img src={imgLogo} alt="" className="img-logo" />
                </div> */}
                {/* <div className="info-content">
                  <div className="tr-content">
                    <div className='item-tr item-tr-l'>
                      <tr className='cus-tr'><td><span className='cus-tr-title'>Banker Win：</span></td><td className={(bet_dict[0] / 100) > 0 ? '':'text-grey'}>{(bet_dict[0] / 100) || 0} ELF</td></tr>
                      <tr className='cus-tr'><td><span className='cus-tr-title'>Player Win：</span></td><td className={(bet_dict[1] / 100) > 0 ? '':'text-grey'}>{(bet_dict[1] / 100) || 0} ELF</td></tr>
                      <tr className='cus-tr'><td><span className='cus-tr-title'>Tie Win：</span></td><td className={(bet_dict[2] / 100) > 0 ? '':'text-grey'}>{(bet_dict[2] / 100) || 0} ELF</td></tr>
                    </div>
                    <div className='item-tr item-tr-r'>
                      <tr className='cus-tr'><td><span className='cus-tr-title'>Banker Pair：</span></td><td className={(bet_dict[3] / 100) > 0 ? '':'text-grey'}>{(bet_dict[3] / 100) || 0} ELF</td></tr>
                      <tr className='cus-tr'><td><span className='cus-tr-title'>Player Pair：</span></td><td className={(bet_dict[4] / 100) > 0 ? '':'text-grey'}>{(bet_dict[4] / 100) || 0} ELF</td></tr>
                      <tr className='cus-tr'><td><span className='cus-tr-title'>Total：</span></td><td className={(money / 100) > 0 ? '':'text-grey'}>{(money / 100) || 0} ELF</td></tr>
                    </div>
                  </div>
                  <div className="desc-content">
                    <p>Confirm betting？</p>
                    <Flex gap="small" vertical>
                      <Progress style={{ width: '170px' }} percent={percent} format={() => description}></Progress>
                    </Flex>
                  </div>
                </div> */}
                <div className="info-content">
                  <div className="tr-content">
                    <div className='item-tr'>
                      <tr className='cus-tr'>
                        <td><span className='cus-tr-title cus-tr-title-spec'>BANKER：</span></td>
                        <td className={`item-tr-l ${(bet_dict[0] / 100) > 0 ? '' : 'text-grey'}`}>{(bet_dict[0] / 100) || 0} ELF</td>
                        <td className='item-tr-r'><span className='cus-tr-title cus-tr-title-spec'>PLAYER：</span></td>
                        <td className={`${(bet_dict[1] / 100) > 0 ? '' : 'text-grey'}`}>{(bet_dict[1] / 100) || 0} ELF</td>
                       
                      </tr>
                      <tr className='cus-tr cus-tr-md'><td><span className='cus-tr-title'>TIE：</span></td><td className={(bet_dict[2] / 100) > 0 ? '':'text-grey'}>{(bet_dict[2] / 100) || 0} ELF</td></tr>
                      <tr className='cus-tr'>
                        <td><span className='cus-tr-title'>BANKER PAIR：</span></td>
                        <td className={`item-tr-l ${(bet_dict[3] / 100) > 0 ? '' : 'text-grey'}`}>{(bet_dict[3] / 100) || 0} ELF</td>
                        <td className='item-tr-r'><span className='cus-tr-title'>PLAYER PAIR：</span></td>
                        <td className={(bet_dict[4] / 100) > 0 ? '' : 'text-grey'}>{(bet_dict[4] / 100) || 0} ELF</td>
                      </tr>
                    </div>
                  </div>
                  <div className="desc-content">
                    <p>Confirm betting？</p>
                    <div className="progress-bar">
                      <Flex gap="small" vertical>
                        <Progress style={{ width: '140px',margin: 0 }} percent={percent} format={() => description}></Progress>
                      </Flex>
                      <tr className='cus-tr'><td><span className='cus-tr-title'>TOTAL：</span></td><td className={(money / 100) > 0 ? '':'text-grey'}>{(money / 100) || 0} ELF</td></tr>
                    </div>
                    
                  </div>
                </div> 
                <div className="btns">
                  <div onClick={onOk} className={`ok-btn ${isPlayDisabled ? 'disabled' : ''}` }> CONFIRM BETS </div>
                </div>
              </div>
            </div>
          </Modal>

          {/* open={withdrawVisible} */}
          <Modal
            open={false}
            className="custom-tip-modal"
            closable={false}
            footer={null}
            onOk={onWithDrawOk}
            onCancel={closeWithDrawModal}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop: '-8vmin' }}
          >
            {contextHolder}
            <div className="modal-cus-tip-container">
              <img src={imgClose} alt="" onClick={closeWithDrawModal} className="img-close" />
              <div className="modal-right">
                {/* <div className="logo-content">
                  <img src={imgLogo} alt="" className="img-logo" />
                </div> */}
                <p>This feature is used for abnormal browser closure and other behaviors, to extract ELF that have been placed in the contract but have not been executed in the game.</p>
                <Flex gap="small" vertical>
                  <Progress
                    percent={withdrawPercent}
                    style={{ width: '70%' }}
                    format={() => withdrawDescriptionDesc}></Progress>
                </Flex>
                  <div className="btns">
                  <div onClick={onWithDrawOk} className={`ok-btn`}>
                    CONFIRM WITHDRAW
                  </div>
                </div>
              </div>
              
            </div>
          </Modal>

          {/* open={visible}*/}
          {
            visible && (
              <div className="mask">
                <div className="modal-container">
                  <img src={imgClose} alt="" onClick={closeModal} className={`img-close ${isPlayDisabled ? 'display-none' : ''}`} />
                  <div className="grid-container">
                    <div className="item">
                      <span className='cus-tr-title cus-tr-title-spec'>BANKER：</span>
                      <span className={`item-tr-l ${(bet_dict[0] / 100) > 0 ? '' : 'text-grey'}`}>{(bet_dict[0] / 100) || 0} ELF</span>
                    </div>
                    <div className="item">
                      <span className='item-tr-r'><span className='cus-tr-title cus-tr-title-spec'>PLAYER：</span></span>
                      <span className={`${(bet_dict[1] / 100) > 0 ? '' : 'text-grey'}`}>{(bet_dict[1] / 100) || 0} ELF</span>
                    </div>
                  </div>
                  <div className='cus-tr cus-tr-md'><span className='cus-tr-title'>TIE：</span><span className={(bet_dict[2] / 100) > 0 ? '':'text-grey'}>{(bet_dict[2] / 100) || 0} ELF</span></div>
                  <div className="grid-container">
                    <div className="item">
                      <span className='cus-tr-title'>BANKER PAIR：</span>
                      <span className={`item-tr-l ${(bet_dict[3] / 100) > 0 ? '' : 'text-grey'}`}>{(bet_dict[3] / 100) || 0} ELF</span>
                    </div>
                    <div className="item">
                      <span className='item-tr-r'><span className='cus-tr-title'>PLAYER PAIR：</span></span>
                      <span className={(bet_dict[4] / 100) > 0 ? '' : 'text-grey'}>{(bet_dict[4] / 100) || 0} ELF</span>
                    </div>
                  </div>
                  <div className="desc-content">
                    <p className='confirm-bet-text'>Confirm betting？</p>
                    <div className="progress-bar">
                      <Flex gap="small" vertical>
                        <Progress style={{ width: '150px',margin: 0}} percent={percent} format={() => description}></Progress>
                      </Flex>
                      <div className='cus-tr'><span className='cus-tr-title'>TOTAL：</span><span className={(money / 100) > 0 ? '':'text-grey'}>{(money / 100) || 0} ELF</span></div>
                    </div>
                  </div>
                  <div className="btns">
                    <div onClick={onOk} className={`ok-btn ${isPlayDisabled ? 'disabled' : ''}` }> CONFIRM BETS </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* open={withdrawVisible} */}
          {
            withdrawVisible && (
              <div className="mask">
                <div className="modal-container with-draw-modal">
                  <img src={imgClose} alt="" onClick={closeWithDrawModal} className="img-close" />
                  <p className='withdraw-text'>This feature is used for abnormal browser closure and other behaviors, to extract ELF that have been placed in the contract but have not been executed in the game.</p>
                  <Flex gap="small" vertical>
                    <Progress
                      percent={withdrawPercent}
                      style={{ width: '70%' }}
                      format={() => withdrawDescriptionDesc}></Progress>
                  </Flex>
                  <div className="btns">
                    <div onClick={onWithDrawOk} className={`ok-btn ${isPlayDisabled ? 'disabled' : ''}` }> CONFIRM WITHDRAW </div>
                  </div>
                </div>
              </div>
            )
          }

          {/* rechargeVisible */}
          {
            rechargeVisible && (
              <div className="mask">
                <div className="tip-charge-modal">
                  <div className="title-tip">Tips</div>
                  <p className='withdraw-text'>Your portkey wallet balance may be insufficient, please click the link below to recharge.</p>
                  { 
                    IS_MAINNET_PRODUCTION && (
                    <>
                      <p className='withdraw-text'>1. Etransfer: 
                         <a  style={{color: '#feb800'}} href="https://app.etransfer.exchange/deposit" target="_blank" rel="noopener noreferrer">Click to jump</a>
                      </p>
                      <p className='withdraw-text'>2. Ebridge: <a  style={{color: '#feb800'}} href="https://ebridge.exchange/" target="_blank" rel="noopener noreferrer">Click to jump</a></p> 
                    </>)
                  }
                  {
                    !IS_MAINNET_PRODUCTION &&(
                      <>
                        <p className='withdraw-text'>1. Etransfer: 
                           <a  style={{color: '#feb800'}} href="https://test.etransfer.exchange/" target="_blank" rel="noopener noreferrer">Click to jump</a>
                        </p>
                        <p className='withdraw-text'>2. Ebridge: <a  style={{color: '#feb800'}} href="https://test.ebridge.exchange/" target="_blank" rel="noopener noreferrer">Click to jump</a></p> 
                      </>)
                  }
                  { 
                    wallet?.walletType === WalletType.portkey &&
                    <p className='withdraw-text'>3. Go to asset <a onClick={onAssetClick} style={{color: '#feb800'}}>Click to jump</a></p>
                  }
                  <div className="btns">
                    <div onClick={onRechargeOk} className={`ok-btn` }> OK </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
