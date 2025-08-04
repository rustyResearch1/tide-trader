-- Create signals table for persistent storage
CREATE TABLE public.signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp BIGINT NOT NULL,
  token_symbol TEXT NOT NULL,
  token_address TEXT,
  wallet_address TEXT,
  win_percentage NUMERIC,
  buy_size NUMERIC,
  entry_market_cap NUMERIC,
  current_roi NUMERIC,
  token_name TEXT,
  token_image TEXT,
  has_image BOOLEAN DEFAULT false,
  market_cap NUMERIC,
  fdv NUMERIC,
  price_usd NUMERIC,
  volume_24h NUMERIC,
  liquidity_amount NUMERIC,
  age TEXT,
  total_holders INTEGER,
  risk_level TEXT CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  fresh_wallet_percentage NUMERIC,
  lp_percentage NUMERIC,
  twitter_url TEXT,
  website_url TEXT,
  dexscreener_url TEXT,
  defined_url TEXT,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('buy', 'sell', 'alert')),
  alert_type TEXT,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (but allow public access for this use case)
ALTER TABLE public.signals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read/write access
CREATE POLICY "Allow public access to signals" ON public.signals
FOR ALL USING (true) WITH CHECK (true);

-- Create index for better performance on timestamp queries
CREATE INDEX idx_signals_timestamp ON public.signals(timestamp DESC);