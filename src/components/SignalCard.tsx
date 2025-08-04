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

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Buy Size</div>
          <div className="font-semibold text-foreground">
            {formatSOL(signal.buySize)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Entry Mcap</div>
          <div className="font-semibold text-foreground">
            {formatNumber(signal.entryMarketCap)}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">Current ROI</div>
          <div className={`font-semibold ${
            (signal.currentROI ?? 0) >= 0 ? 'text-success' : 'text-danger'
          }`}>
            {(signal.currentROI ?? 0) >= 0 ? '+' : ''}{(signal.currentROI ?? 0).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Token Details */}
      {signal.marketCap && (
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap:</span>
              <span className="text-foreground">{formatNumber(signal.marketCap)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Volume:</span>
              <span className="text-foreground">{formatNumber(signal.volume24h || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Holders:</span>
              <span className="text-foreground">{signal.totalHolders?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="text-foreground">${signal.priceUSD != null ? signal.priceUSD.toFixed(6) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Age:</span>
              <span className="text-foreground">{signal.age || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk:</span>
              <span className={getRiskColor(signal.riskLevel || 'MEDIUM')}>
                {signal.riskLevel || 'MEDIUM'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <ExternalLink className="h-3 w-3 mr-1" />
          View Chart
        </Button>
        
        {signal.twitterUrl && (
          <Button variant="ghost" size="sm">
            <Twitter className="h-3 w-3" />
          </Button>
        )}
        
        {signal.websiteUrl && (
          <Button variant="ghost" size="sm">
            <Globe className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}