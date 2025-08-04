import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SignalCard } from './SignalCard';
import { TradingSignal } from '@/types/trading';

// Mock data for demonstration
const mockSignals: TradingSignal[] = [
  {
    id: '1',
    timestamp: Date.now() - 30000, // 30 seconds ago
    tokenSymbol: 'BONK',
    tokenAddress: '0x123...',
    walletAddress: '0x7e3f...8a21',
    winPercentage: 92,
    buySize: 4.85,
    entryMarketCap: 340000,
    currentROI: 32.5,
    marketCap: 6800000,
    volume24h: 1200000,
    totalHolders: 2145,
    riskLevel: 'LOW',
    signalType: 'buy',
    source: 'pump.fun'
  },
  {
    id: '2',
    timestamp: Date.now() - 1080000, // 18 minutes ago
    tokenSymbol: 'MEME',
    tokenAddress: '0x456...',
    walletAddress: 'WhalHuntr4',
    winPercentage: 87,
    buySize: 3.22,
    entryMarketCap: 128000,
    currentROI: 78.3,
    marketCap: 6800000,
    volume24h: 1200000,
    totalHolders: 2145,
    riskLevel: 'MEDIUM',
    signalType: 'buy',
    alertType: 'Token Pump',
    source: 'Maestro'
  },
  {
    id: '3',
    timestamp: Date.now() - 2520000, // 42 minutes ago
    tokenSymbol: 'SOL20',
    tokenAddress: '0x789...',
    walletAddress: 'WhalHuntr4',
    winPercentage: 87,
    buySize: 3.22,
    entryMarketCap: 128000,
    currentROI: 78.3,
    marketCap: 6800000,
    volume24h: 1200000,
    totalHolders: 2145,
    riskLevel: 'LOW',
    signalType: 'buy',
    source: 'BullX'
  },
  {
    id: '4',
    timestamp: Date.now() - 7560000, // 2 hours 6 minutes ago
    tokenSymbol: 'DEGEN',
    tokenAddress: '0xabc...',
    walletAddress: '0x3c9e...2f14',
    winPercentage: 76,
    buySize: 2.56,
    entryMarketCap: 85000,
    currentROI: -12.8,
    marketCap: 6800000,
    volume24h: 1200000,
    totalHolders: 2145,
    riskLevel: 'HIGH',
    signalType: 'buy',
    source: 'pump.fun'
  }
];

export function SignalFeed() {
  const [signals, setSignals] = useState<TradingSignal[]>(mockSignals);
  const [selectedFilter, setSelectedFilter] = useState('All Signals');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would be replaced with WebSocket or Server-Sent Events
      // For now, we'll just update timestamps to show "live" behavior
      setSignals(prev => prev.map(signal => ({
        ...signal,
        timestamp: signal.timestamp // Keep original for demo
      })));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filters = ['All Signals', 'Buy Signals', 'Sell Signals', 'High ROI', 'New Tokens'];

  return (
    <div className="flex-1 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <h2 className="text-lg font-semibold text-foreground">Live Signal Feed</h2>
        </div>
        
        <div className="relative">
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="appearance-none bg-muted border border-border rounded-lg px-4 py-2 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {filters.map(filter => (
              <option key={filter} value={filter}>{filter}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Signal Cards */}
      <div className="space-y-4">
        {signals.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-6">
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          Load More Signals
        </button>
      </div>
    </div>
  );
}