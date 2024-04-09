import { TokenInfo, ListMarketInfo, ProjectStatus } from 'types/project';

export interface IAdditionalInfo {
  projectName: string;
  projectSummary: string;
  projectDescription: string;
  x: string;
  telegram: string;
  medium: string;
  logoUrl: string;
  projectImgs: string;
  [key: string]: string;
}

export interface IProjectInfo {
  additionalInfo?: IAdditionalInfo;
  creator?: string;
  crowdFundingIssueAmount?: string;
  crowdFundingIssueToken?: TokenInfo & {
    name: string;
  };
  crowdFundingType?: string;
  currentCrowdfundingTokenAmount?: string;
  currentPeriod?: number;
  currentRaisedAmount?: string;
  endTime?: string;
  firstDistributeProportion?: string;
  hash?: string;
  id?: string;
  investAmount?: string;
  isBurnRestToken?: boolean;
  isCanceled?: boolean;
  lastModificationTime?: string;
  liquidityLockProportion?: number;
  listMarketInfo?: ListMarketInfo[];
  maxSubscription?: string;
  minSubscription?: string;
  participantCount?: number;
  periodDuration?: number;
  preSalePrice?: string;
  publicSalePrice?: string;
  restPeriodDistributeProportion?: number;
  startTime?: string;
  toClaimAmount?: string;
  toRaiseToken?: TokenInfo;
  targetRaisedAmount?: string;
  totalPeriod?: number;
  unlockTime?: string;
  whitelistId?: string;
  isEnableWhitelist?: boolean;
  status?: ProjectStatus;
  cancelTime?: string;
  whitelistInfo?: {
    url?: string;
  };
  tokenReleaseTime?: string;
}
