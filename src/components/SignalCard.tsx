import { useState } from 'react';
import { ExternalLink, Bookmark, BookmarkCheck, TrendingUp, AlertTriangle, Globe, Twitter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TradingSignal } from '@/types/trading';

interface SignalCardProps {
  signal: TradingSignal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return '$0.00';
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (num: number | null | undefined) => {
    if (num == null) return '$0';
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(0)}K`;
    return `$${num.toFixed(0)}`;
  };

  const formatPercentage = (percent: string | null | undefined) => {
    if (!percent) return 'N/A';
    return percent.includes('%') ? percent : `${percent}%`;
  };

  const getPercentageColor = (percent: string | null | undefined) => {
    if (!percent) return 'text-muted-foreground';
    const numValue = parseFloat(percent.replace(/[+%]/g, ''));
    if (numValue > 0) return 'text-success';
    if (numValue < 0) return 'text-danger';
    return 'text-muted-foreground';
  };

  const formatSOL = (amount: number | null | undefined) => {
    if (amount == null) return '0.00 SOL';
    return `${amount.toFixed(2)} SOL`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-success';
      case 'MEDIUM': return 'text-warning';
      case 'HIGH': return 'text-danger';
      default: return 'text-muted-foreground';
    }
  };

  const getSignalTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'sell': return <TrendingUp className="h-4 w-4 text-danger rotate-180" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <TrendingUp className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="bg-gradient-card border border-border/50 rounded-lg p-4 hover:border-primary/20 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getSignalTypeIcon(signal.signalType)}
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
            {signal.alertType || 'New Smart Buy Signal'}
          </Badge>
          <span className="text-xl font-bold text-foreground">
            ${signal.tokenSymbol}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {formatTimeAgo(signal.timestamp)}
          </span>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm text-muted-foreground">from</span>
        <span className="text-sm font-medium text-foreground">
          {signal.walletAddress}
        </span>
        <Badge 
          variant="outline" 
          className={`${
            signal.winPercentage >= 80 
              ? 'border-success/30 text-success' 
              : 'border-warning/30 text-warning'
          }`}
        >
          {signal.winPercentage}% Win
        </Badge>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-4 gap-3 mb-4 p-3 bg-muted/30 rounded-lg">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Price</div>
          <div className="font-semibold text-foreground text-sm">
            ${signal.priceUSD != null ? signal.priceUSD.toFixed(6) : 'N/A'}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">24h Volume</div>
          <div className="font-semibold text-foreground text-sm">
            {formatVolume(signal.volume24h)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">1H Change</div>
          <div className={`font-semibold text-sm ${getPercentageColor(signal.percentChange1h)}`}>
            {formatPercentage(signal.percentChange1h)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Current ROI</div>
          <div className={`font-semibold text-sm ${
            (signal.currentROI ?? 0) >= 0 ? 'text-success' : 'text-danger'
          }`}>
            {(signal.currentROI ?? 0) >= 0 ? '+' : ''}{(signal.currentROI ?? 0).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Trading Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-muted/20 rounded-lg">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Buy Size</div>
          <div className="font-semibold text-foreground text-sm">
            {formatSOL(signal.buySize)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Entry Mcap</div>
          <div className="font-semibold text-foreground text-sm">
            {formatNumber(signal.entryMarketCap)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Market Cap</div>
          <div className="font-semibold text-foreground text-sm">
            {formatNumber(signal.marketCap)}
          </div>
        </div>
      </div>

      {/* Liquidity & Activity Details */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Liquidity:</span>
            <span className="text-foreground">{formatNumber(signal.liquidityAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Liquidity Ratio:</span>
            <span className="text-foreground">{signal.liquidityRatio || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">LP Percentage:</span>
            <span className="text-foreground">{signal.lpPercentage != null ? `${signal.lpPercentage}%` : 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Age:</span>
            <span className="text-foreground">{signal.age || 'N/A'}</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Buys 24h:</span>
            <span className="text-foreground">{signal.buys24h || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sells 24h:</span>
            <span className="text-foreground">{signal.sells24h || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Holders:</span>
            <span className="text-foreground">{signal.totalHolders?.toLocaleString() || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Risk:</span>
            <span className={getRiskColor(signal.riskLevel || 'MEDIUM')}>
              {signal.riskLevel || 'MEDIUM'}
            </span>
          </div>
        </div>
      </div>

      {/* Fresh Wallet Analysis */}
      {(signal.freshWalletPercentage || signal.freshWallets1d || signal.freshWallets7d) && (
        <div className="mb-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="text-xs font-medium text-warning mb-2">Fresh Wallet Analysis</div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            {signal.freshWalletPercentage && (
              <div>
                <span className="text-muted-foreground">Fresh Wallets:</span>
                <span className="ml-1 text-foreground">{signal.freshWalletPercentage}%</span>
              </div>
            )}
            {signal.freshWallets1d && (
              <div>
                <span className="text-muted-foreground">1d Fresh:</span>
                <span className="ml-1 text-foreground">{signal.freshWallets1d}</span>
              </div>
            )}
            {signal.freshWallets7d && (
              <div>
                <span className="text-muted-foreground">7d Fresh:</span>
                <span className="ml-1 text-foreground">{signal.freshWallets7d}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {signal.dexscreenerUrl ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => window.open(signal.dexscreenerUrl, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            DexScreener
          </Button>
        ) : signal.definedUrl ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => window.open(signal.definedUrl, '_blank')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Defined
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex-1" disabled>
            <ExternalLink className="h-3 w-3 mr-1" />
            View Chart
          </Button>
        )}
        
        {signal.twitterUrl && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(signal.twitterUrl, '_blank')}
            className="hover:bg-blue-500/10 hover:text-blue-500"
          >
            <Twitter className="h-3 w-3" />
          </Button>
        )}
        
        {signal.websiteUrl && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.open(signal.websiteUrl, '_blank')}
            className="hover:bg-primary/10"
          >
            <Globe className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}