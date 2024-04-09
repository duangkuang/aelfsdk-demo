import { sleep } from 'utils';
import AElf from 'aelf-sdk';
import { COMMON_PRIVATE } from 'constants/aelf';
import { NETWORK_CONFIG } from 'constants/network';
const Wallet = AElf.wallet;

let wallet: any = null;
const httpProviders: any = {};
export function getAElf(rpc = NETWORK_CONFIG.sideChainInfo.endPoint) {
  if (!httpProviders[rpc]) httpProviders[rpc] = new AElf(new AElf.providers.HttpProvider(rpc));
  return httpProviders[rpc];
}

export function getWallet() {
  if (!wallet) wallet = Wallet.getWalletByPrivateKey(COMMON_PRIVATE);

  return wallet;
}

class TXError extends Error {
  public TransactionId?: string;
  public transactionId?: string;
  constructor(message: string, id?: string) {
    super(message);
    this.TransactionId = id;
    this.transactionId = id;
  }
}

export function handleContractErrorMessage(error?: any) {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error.Error) {
    return error.Error.Details || error.Error.Message || error.Error || error.Status;
  }
  return `Transaction: ${error.Status}`;
}

export async function getTxResult(
  TransactionId: string,
  reGetCount = 0,
  notExistedReGetCount = 0,
  rpc?: string,
): Promise<any> {
  const txFun = getAElf(rpc).chain.getTxResult;
  let txResult;
  try {
    txResult = await txFun(TransactionId);
    console.log(txResult, TransactionId, 'compBalanceMetadata====txResult');
  } catch (error) {
    console.log('getTxResult:error', error);
    throw new TXError(handleContractErrorMessage(error), TransactionId);
  }

  const result = txResult?.result || txResult;
  if (!result) {
    throw new TXError('Can not get transaction result.', TransactionId);
  }

  const lowerCaseStatus = result.Status.toLowerCase();
  if (lowerCaseStatus === 'notexisted') {
    if (notExistedReGetCount > 5) throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
    await sleep(1000);
    notExistedReGetCount++;
    reGetCount++;
    return getTxResult(TransactionId, reGetCount, notExistedReGetCount, rpc);
  }
  if (lowerCaseStatus === 'pending' || lowerCaseStatus === 'pending_validation') {
    if (reGetCount > 20) throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
    await sleep(1000);
    reGetCount++;
    return getTxResult(TransactionId, reGetCount, notExistedReGetCount, rpc);
  }

  if (lowerCaseStatus === 'mined') return result;
  throw new TXError(result.Error || `Transaction: ${result.Status}`, TransactionId);
}
