import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut } from 'lucide-react';

export function WalletButton() {
  const { wallet, connected, disconnect, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-success/20 text-success border-success/30">
          <Wallet className="h-3 w-3 mr-1" />
          {formatAddress(publicKey.toString())}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={disconnect}
          className="text-muted-foreground hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => setVisible(true)} className="bg-gradient-primary hover:opacity-90">
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
}