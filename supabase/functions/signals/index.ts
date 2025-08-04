import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseKey);

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
      // Fetch signals from database, newest first
      const { data: dbSignals, error } = await supabase
        .from('signals')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch signals', details: error.message }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      // Convert database format to frontend format
      const signals = (dbSignals || []).map(signal => ({
        id: signal.id,
        timestamp: signal.timestamp,
        tokenSymbol: signal.token_symbol,
        tokenAddress: signal.token_address,
        walletAddress: signal.wallet_address,
        winPercentage: signal.win_percentage,
        buySize: signal.buy_size,
        entryMarketCap: signal.entry_market_cap,
        currentROI: signal.current_roi,
        tokenName: signal.token_name,
        tokenImage: signal.token_image,
        hasImage: signal.has_image,
        marketCap: signal.market_cap,
        fdv: signal.fdv,
        priceUSD: signal.price_usd,
        volume24h: signal.volume_24h,
        liquidityAmount: signal.liquidity_amount,
        age: signal.age,
        totalHolders: signal.total_holders,
        riskLevel: signal.risk_level,
        freshWalletPercentage: signal.fresh_wallet_percentage,
        lpPercentage: signal.lp_percentage,
        twitterUrl: signal.twitter_url,
        websiteUrl: signal.website_url,
        dexscreenerUrl: signal.dexscreener_url,
        definedUrl: signal.defined_url,
        signalType: signal.signal_type,
        alertType: signal.alert_type,
        source: signal.source,
        platform: signal.platform,
        athFdv: signal.ath_fdv,
        liquidityRatio: signal.liquidity_ratio,
        percentChange1h: signal.percent_change_1h,
        buys24h: signal.buys_24h,
        sells24h: signal.sells_24h,
        ageMinutes: signal.age_minutes,
        avgHolderAge: signal.avg_holder_age,
        freshWallets1d: signal.fresh_wallets_1d,
        freshWallets7d: signal.fresh_wallets_7d,
        hasWebsite: signal.has_website,
        hasTwitter: signal.has_twitter,
        originalWallets: signal.original_wallets,
        originalMessage: signal.original_message,
        rickAnalysis: signal.rick_analysis,
        apiVersion: signal.api_version,
      }));

      return new Response(
        JSON.stringify({ signals }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    if (req.method === 'POST') {
      const body = await req.json();
      
      // Create new signal with ID and timestamp if not provided
      const signalId = body.id || crypto.randomUUID();
      const timestamp = body.timestamp || Date.now();

      // Convert frontend format to database format
      const dbSignal = {
        id: signalId,
        timestamp,
        token_symbol: body.tokenSymbol,
        token_address: body.tokenAddress,
        wallet_address: body.walletAddress,
        win_percentage: body.winPercentage,
        buy_size: body.buySize,
        entry_market_cap: body.entryMarketCap,
        current_roi: body.currentROI,
        token_name: body.tokenName,
        token_image: body.tokenImage,
        has_image: body.hasImage,
        market_cap: body.marketCap,
        fdv: body.fdv,
        price_usd: body.priceUSD,
        volume_24h: body.volume24h,
        liquidity_amount: body.liquidityAmount,
        age: body.age,
        total_holders: body.totalHolders,
        risk_level: body.riskLevel,
        fresh_wallet_percentage: body.freshWalletPercentage,
        lp_percentage: body.lpPercentage,
        twitter_url: body.twitterUrl,
        website_url: body.websiteUrl,
        dexscreener_url: body.dexscreenerUrl,
        defined_url: body.definedUrl,
        signal_type: body.signalType,
        alert_type: body.alertType,
        source: body.source,
        platform: body.platform,
        ath_fdv: body.athFdv,
        liquidity_ratio: body.liquidityRatio,
        percent_change_1h: body.percentChange1h,
        buys_24h: body.buys24h,
        sells_24h: body.sells24h,
        age_minutes: body.ageMinutes,
        avg_holder_age: body.avgHolderAge,
        fresh_wallets_1d: body.freshWallets1d,
        fresh_wallets_7d: body.freshWallets7d,
        has_website: body.hasWebsite,
        has_twitter: body.hasTwitter,
        original_wallets: body.originalWallets,
        original_message: body.originalMessage,
        rick_analysis: body.rickAnalysis,
        api_version: body.apiVersion,
      };

      // Insert into database
      const { error } = await supabase
        .from('signals')
        .insert([dbSignal]);

      if (error) {
        console.error('Database insert error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to save signal', 
            details: error.message 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }

      // Get total count
      const { count } = await supabase
        .from('signals')
        .select('*', { count: 'exact', head: true });

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Signal added successfully',
          signalId,
          totalSignals: count || 0
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
