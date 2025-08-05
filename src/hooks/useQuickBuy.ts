import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { useToast } from '@/hooks/use-toast';

interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee: null;
  priceImpactPct: string;
  routePlan: any[];
  price: string;
}

interface SwapTransaction {
  swapTransaction: string;
}

const SOL_MINT = 'So11111111111111111111111111111111111111112';
const JUPITER_V6_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_V6_SWAP_API = 'https://quote-api.jup.ag/v6/swap';

export function useQuickBuy(tokenAddress?: string, solAmount?: number, slippageBps?: number) {
  const [quote, setQuote] = useState<JupiterQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const { toast } = useToast();

  // Get quote from Jupiter
  useEffect(() => {
    if (!tokenAddress || !solAmount || solAmount <= 0) {
      setQuote(null);
      return;
    }

    const getQuote = async () => {
      setIsLoadingQuote(true);
      setError(null);
      
      try {
        const lamports = Math.floor(solAmount * 1e9); // Convert SOL to lamports
        const slippageBpsValue = (slippageBps || 1) * 100; // Convert percentage to basis points
        
        const params = new URLSearchParams({
          inputMint: SOL_MINT,
          outputMint: tokenAddress,
          amount: lamports.toString(),
          slippageBps: slippageBpsValue.toString(),
          onlyDirectRoutes: 'false',
          asLegacyTransaction: 'false'
        });

        const response = await fetch(`${JUPITER_V6_QUOTE_API}?${params}`);
        
        if (!response.ok) {
          throw new Error(`Quote API error: ${response.status}`);
        }
        
        const quoteData = await response.json();
        
        if (quoteData.error) {
          throw new Error(quoteData.error);
        }
        
        // Format the quote data
        const formattedQuote: JupiterQuote = {
          ...quoteData,
          price: (parseFloat(quoteData.outAmount) / 1e6 / solAmount).toFixed(6), // Approximate token per SOL
          outAmount: (parseFloat(quoteData.outAmount) / 1e6).toFixed(6) // Convert from micro tokens
        };
        
        setQuote(formattedQuote);
      } catch (err) {
        console.error('Quote error:', err);
        setError(err instanceof Error ? err.message : 'Failed to get quote');
        setQuote(null);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    // Debounce quote requests
    const timeoutId = setTimeout(getQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [tokenAddress, solAmount, slippageBps]);

  const executeTrade = async () => {
    if (!quote || !publicKey || !signTransaction || !sendTransaction) {
      setError('Wallet not connected or quote not available');
      return;
    }

    setIsExecuting(true);
    setError(null);

    try {
      // Get swap transaction from Jupiter
      const swapResponse = await fetch(JUPITER_V6_SWAP_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
          computeUnitPriceMicroLamports: 'auto'
        }),
      });

      if (!swapResponse.ok) {
        throw new Error(`Swap API error: ${swapResponse.status}`);
      }

      const swapData: SwapTransaction = await swapResponse.json();
      
      if (!swapData.swapTransaction) {
        throw new Error('No swap transaction returned');
      }

      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapData.swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign and send the transaction
      const signedTransaction = await signTransaction(transaction);
      const signature = await sendTransaction(signedTransaction, connection);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }

      toast({
        title: "Trade Successful!",
        description: `Successfully bought ${quote.outAmount} tokens`,
      });

    } catch (err) {
      console.error('Trade execution error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Trade execution failed';
      setError(errorMessage);
      
      toast({
        title: "Trade Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return {
    quote,
    isLoadingQuote,
    executeTrade,
    isExecuting,
    error
  };
}