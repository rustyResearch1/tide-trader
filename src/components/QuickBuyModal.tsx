import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { TradingSignal } from '@/types/trading';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuickBuy } from '@/hooks/useQuickBuy';

interface QuickBuyModalProps {
  signal: TradingSignal | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [0.1, 0.5, 1.0, 5.0];
const SLIPPAGE_OPTIONS = [0.5, 1.0, 3.0];

export function QuickBuyModal({ signal, isOpen, onClose }: QuickBuyModalProps) {
  const [solAmount, setSolAmount] = useState(0.5);
  const [slippage, setSlippage] = useState(1.0);
  const [customAmount, setCustomAmount] = useState('');
  const [useCustomAmount, setUseCustomAmount] = useState(false);
  const { connected } = useWallet();
  
  const {
    quote,
    isLoadingQuote,
    executeTrade,
    isExecuting,
    error
  } = useQuickBuy(signal?.tokenAddress, useCustomAmount ? parseFloat(customAmount) : solAmount, slippage);

  const handleAmountSelect = (amount: number) => {
    setSolAmount(amount);
    setUseCustomAmount(false);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setUseCustomAmount(true);
  };

  const handleBuy = async () => {
    if (!connected || !signal) return;
    await executeTrade();
  };

  const actualAmount = useCustomAmount ? parseFloat(customAmount) : solAmount;
  const isValidAmount = actualAmount > 0 && actualAmount <= 100;

  if (!signal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Quick Buy ${signal.tokenSymbol}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Token Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            {signal.tokenImage && (
              <img 
                src={signal.tokenImage.startsWith('data:') ? signal.tokenImage : `data:image/png;base64,${signal.tokenImage}`}
                alt={`${signal.tokenSymbol} token`}
                className="w-8 h-8 rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <div>
              <div className="font-semibold">${signal.tokenSymbol}</div>
              <div className="text-sm text-muted-foreground">
                Price: ${signal.priceUSD?.toFixed(6) || 'N/A'}
              </div>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="space-y-2">
            <Label>SOL Amount</Label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={!useCustomAmount && solAmount === amount ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleAmountSelect(amount)}
                >
                  {amount} SOL
                </Button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                step="0.1"
                min="0.01"
                max="100"
              />
            </div>
          </div>

          {/* Slippage Selection */}
          <div className="space-y-2">
            <Label>Slippage Tolerance</Label>
            <div className="grid grid-cols-3 gap-2">
              {SLIPPAGE_OPTIONS.map((option) => (
                <Button
                  key={option}
                  variant={slippage === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSlippage(option)}
                >
                  {option}%
                </Button>
              ))}
            </div>
          </div>

          {/* Quote Information */}
          {isLoadingQuote && (
            <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Getting best quote...</span>
            </div>
          )}

          {quote && (
            <div className="space-y-2 p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">You're buying:</span>
                <span className="font-medium">{quote.outAmount} {signal.tokenSymbol}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rate:</span>
                <span className="font-medium">{quote.price} {signal.tokenSymbol}/SOL</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price Impact:</span>
                <span className={`font-medium ${
                  parseFloat(quote.priceImpactPct) > 5 ? 'text-danger' : 'text-success'
                }`}>
                  {quote.priceImpactPct}%
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-danger/10 border border-danger/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-danger" />
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              disabled={!connected || !isValidAmount || isExecuting || !quote}
              className="flex-1 bg-gradient-success hover:opacity-90"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Buying...
                </>
              ) : (
                `Buy ${actualAmount} SOL`
              )}
            </Button>
          </div>

          {!connected && (
            <div className="text-center">
              <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">
                Connect wallet to trade
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}