
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { SignalCard } from './SignalCard';
import { TradingSignal } from '@/types/trading';

export function SignalFeed() {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All Signals');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch signals from API
  const fetchSignals = async () => {
    try {
      console.log('Fetching signals...');
      const response = await fetch('https://bjgayswhifoubltaaexg.supabase.co/functions/v1/signals', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZ2F5c3doaWZvdWJsdGFhZXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjE5NjgsImV4cCI6MjA2OTg5Nzk2OH0.hqxde3kXAf5lHRCjzlXYaMEKMHG3Yo0xWEzSZOMzpCM`,
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZ2F5c3doaWZvdWJsdGFhZXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjE5NjgsImV4cCI6MjA2OTg5Nzk2OH0.hqxde3kXAf5lHRCjzlXYaMEKMHG3Yo0xWEzSZOMzpCM'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received signals data:', data);
      
      setSignals(data?.signals || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching signals:', err);
      setError('Failed to load signals');
    } finally {
      setLoading(false);
    }
  };

  // Fetch signals on component mount and then every 3 seconds
  useEffect(() => {
    fetchSignals();
    
    const interval = setInterval(fetchSignals, 3000);
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
        {loading && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">Loading signals...</div>
          </div>
        )}
        
        {error && (
          <div className="text-center py-8">
            <div className="text-destructive">{error}</div>
            <button 
              onClick={fetchSignals}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors mt-2"
            >
              Retry
            </button>
          </div>
        )}
        
        {!loading && !error && signals.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">No signals yet. Send some data to the API!</div>
            <div className="text-xs text-muted-foreground mt-1">
              POST to: https://bjgayswhifoubltaaexg.supabase.co/functions/v1/signals
            </div>
          </div>
        )}
        
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
