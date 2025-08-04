export interface TradingSignal {
  id: string;
  timestamp: number;
  tokenSymbol: string;
  tokenAddress: string;
  walletAddress: string;
  winPercentage: number;
  buySize: number;
  entryMarketCap: number;
  currentROI: number;
  tokenName?: string;
  tokenImage?: string;
  hasImage?: boolean;
  marketCap?: number;
  fdv?: number;
  priceUSD?: number;
  volume24h?: number;
  liquidityAmount?: number;
  age?: string;
  totalHolders?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  freshWalletPercentage?: number;
  lpPercentage?: number;
  twitterUrl?: string;
  websiteUrl?: string;
  dexscreenerUrl?: string;
  definedUrl?: string;
  signalType: 'buy' | 'sell' | 'alert';
  alertType?: string;
  source?: string;
  percentChange1h?: string;
  liquidityRatio?: string;
  buys24h?: string;
  sells24h?: string;
  freshWallets1d?: string;
  freshWallets7d?: string;
}

export interface SmartWallet {
  id: string;
  address: string;
  winPercentage: number;
  volume: number;
  tradeCount: number;
  verified: boolean;
  rank: number;
}

export interface CommunityFeedItem {
  id: string;
  type: 'tag' | 'trade' | 'alert';
  username: string;
  content: string;
  timestamp: number;
  walletAddress?: string;
  tokenSymbol?: string;
  likes?: number;
}