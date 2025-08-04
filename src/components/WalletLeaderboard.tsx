import { useState } from 'react';
import { Search, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SmartWallet } from '@/types/trading';

const mockWallets: SmartWallet[] = [
  {
    id: '1',
    address: '0x7e3f...8a21',
    winPercentage: 92,
    volume: 2100000,
    tradeCount: 34,
    verified: true,
    rank: 1
  },
  {
    id: '2',
    address: 'WhalHuntr4',
    winPercentage: 87,
    volume: 950000,
    tradeCount: 30,
    verified: false,
    rank: 2
  },
  {
    id: '3',
    address: '0x9a2b...5f83',
    winPercentage: 79,
    volume: 720000,
    tradeCount: 42,
    verified: false,
    rank: 3
  },
  {
    id: '4',
    address: 'MemeKing',
    winPercentage: 85,
    volume: 530000,
    tradeCount: 38,
    verified: true,
    rank: 4
  },
  {
    id: '5',
    address: '0x3c9e...2f14',
    winPercentage: 76,
    volume: 480000,
    tradeCount: 29,
    verified: false,
    rank: 5
  }
];

const filterTabs = ['All', 'High Win %', 'Trending', 'Verified'];

export function WalletLeaderboard() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `$${(volume / 1000).toFixed(0)}K`;
    return `$${volume}`;
  };

  return (
    <div className="w-80 bg-card border-r border-border p-4 h-screen overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          Smart Wallet Leaderboard
        </h2>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search wallets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted border-muted"
          />
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                activeFilter === tab
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {mockWallets.map((wallet) => (
          <div
            key={wallet.id}
            className="bg-gradient-card p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                  {wallet.rank}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-foreground font-medium text-sm">
                    {wallet.address}
                  </span>
                  {wallet.verified && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
              <Badge 
                variant="secondary" 
                className={`${
                  wallet.winPercentage >= 80 
                    ? 'bg-success/20 text-success border-success/30' 
                    : 'bg-warning/20 text-warning border-warning/30'
                }`}
              >
                {wallet.winPercentage}% Win
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Volume</span>
                <div className="text-foreground font-medium">
                  {formatVolume(wallet.volume)}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Trades</span>
                <div className="text-foreground font-medium">
                  {wallet.tradeCount}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
        View All Smart Wallets
      </button>
    </div>
  );
}