-- Add missing columns to match full data structure
ALTER TABLE public.signals ADD COLUMN platform TEXT;
ALTER TABLE public.signals ADD COLUMN ath_fdv NUMERIC;
ALTER TABLE public.signals ADD COLUMN liquidity_ratio TEXT;
ALTER TABLE public.signals ADD COLUMN percent_change_1h TEXT;
ALTER TABLE public.signals ADD COLUMN buys_24h TEXT;
ALTER TABLE public.signals ADD COLUMN sells_24h TEXT;
ALTER TABLE public.signals ADD COLUMN age_minutes INTEGER;
ALTER TABLE public.signals ADD COLUMN avg_holder_age TEXT;
ALTER TABLE public.signals ADD COLUMN fresh_wallets_1d TEXT;
ALTER TABLE public.signals ADD COLUMN fresh_wallets_7d TEXT;
ALTER TABLE public.signals ADD COLUMN has_website BOOLEAN DEFAULT false;
ALTER TABLE public.signals ADD COLUMN has_twitter BOOLEAN DEFAULT false;
ALTER TABLE public.signals ADD COLUMN original_wallets JSONB;
ALTER TABLE public.signals ADD COLUMN original_message TEXT;
ALTER TABLE public.signals ADD COLUMN rick_analysis TEXT;
ALTER TABLE public.signals ADD COLUMN api_version TEXT;

-- Create useful indexes for filtering and performance
CREATE INDEX idx_signals_token_symbol ON public.signals(token_symbol);
CREATE INDEX idx_signals_wallet_address ON public.signals(wallet_address);
CREATE INDEX idx_signals_created_at ON public.signals(created_at DESC);