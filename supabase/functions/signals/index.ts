import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

interface TradingSignal {
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
}

// In-memory storage for signals (will reset when function restarts)
let signals: TradingSignal[] = [];
const MAX_SIGNALS = 100;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    
    if (req.method === 'GET') {
      // Return all signals, newest first
      return new Response(
        JSON.stringify({ signals: signals.slice().reverse() }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (req.method === 'POST') {
      const body = await req.json();
      
      // Create new signal with ID and timestamp if not provided
      const newSignal: TradingSignal = {
        id: body.id || crypto.randomUUID(),
        timestamp: body.timestamp || Date.now(),
        ...body,
      };

      // Add to beginning of array (newest first when we slice)
      signals.unshift(newSignal);
      
      // Keep only last MAX_SIGNALS
      if (signals.length > MAX_SIGNALS) {
        signals = signals.slice(0, MAX_SIGNALS);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Signal added successfully',
          signalId: newSignal.id,
          totalSignals: signals.length
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Invalid request', 
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
