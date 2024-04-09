export enum ProjectStatus {
  ALL = 1,
  UPCOMING = 2,
  PARTICIPATORY = 3,
  UNLOCKED = 4,
  ENDED = 5,
  CANCELED = 6,
}

export enum ProjectType {
  ACTIVE = 1,
  CLOSED = 2,
  CREATED = 3,
  PARTICIPATE = 4,
}

export interface TokenInfo {
  id: string;
  address: string;
  symbol: string;
  name?: string;
  decimals: number;
}

export interface IAdditionalInfo {
  projectName: string;
  projectSummary: string;
  projectDescription: string;
  x: string;
  telegram: string;
  medium: string;
  logoUrl: string;
  projectImgs: string;
}

export interface IProjectInfo {
  additionalInfo?: IAdditionalInfo;
  creator?: string;
  crowdFundingIssueAmount?: string;
  crowdFundingIssueToken?: TokenInfo & {
    name: string;
    balance?: string;
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
  listMarketInfo?: string;
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
  isCreator?: boolean;
  isInWhitelist?: boolean;
  liquidatedDamageAmount?: string;
  receivableLiquidatedDamageAmount?: string;
  currentCrowdFundingIssueAmount?: string;
  claimedLiquidatedDamage?: boolean;
  isWithdraw?: boolean;
  tokenReleaseTime?: string;
  actualClaimAmount?: string;
  virtualAddress?: string;
  liquidatedDamageProportion?: number;
}

export interface ListMarketInfo {
  market?: string;
  weight?: number;
}

export enum ProjectListType {
  ALL = 'all',
  MY = 'my',
}
