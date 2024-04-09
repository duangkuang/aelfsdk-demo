import { WalletInfo, WalletType, WalletHookInterface, SignatureParams, SignatureData } from 'aelf-web-login';

export type CallContractFunc = WalletHookInterface['callContract'];
export type GetSignatureFunc = WalletHookInterface['getSignature'];
export type TSignatureParams = Omit<SignatureParams, 'appName' | 'address'>;

export interface IWallet {
  walletInfo: WalletInfo;
  walletType: WalletType;
  callContract: CallContractFunc;
  getSignature: (params: TSignatureParams) => Promise<SignatureData>;
  setCallContract: (callContract: CallContractFunc) => void;
  setGetSignature: (getSignature: GetSignatureFunc) => void;
}

export type IWalletProps = {
  walletInfo: WalletInfo;
  walletType: WalletType;
  callContract: CallContractFunc;
  getSignature: GetSignatureFunc;
};
