import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WalletButton } from '@/components/WalletButton';

export function DashboardHeader() {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SS</span>
            </div>
            <span className="text-xl font-bold text-foreground">SolanaSignals</span>
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
              BETA
            </Badge>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Smart Wallets
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Signals
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
              Watchlist
            </a>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
            Connect Bot
          </Button>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}