-- Add missing columns to the signals table
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS price_usd NUMERIC;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS volume_24h NUMERIC;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS liquidity_ratio TEXT;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS percent_change_1h TEXT;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS buys_24h TEXT;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS sells_24h TEXT;
ALTER TABLE public.signals ADD COLUMN IF NOT EXISTS lp_percentage NUMERIC;

-- Update existing columns that might need type changes
ALTER TABLE public.signals ALTER COLUMN fresh_wallets_1d TYPE TEXT;
ALTER TABLE public.signals ALTER COLUMN fresh_wallets_7d TYPE TEXT;