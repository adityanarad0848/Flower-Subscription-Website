-- Add missing columns to orders table for checkout

-- Add postal_code column (if not exists)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Add items column (JSONB to store cart items)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS items JSONB;

-- Add subtotal column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);

-- Add delivery_fee column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0;

-- Add handling_fee column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS handling_fee DECIMAL(10, 2) DEFAULT 0;

-- Add discount column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) DEFAULT 0;

-- Add total column (rename from total_amount if exists)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2);

-- Add special_requests column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS special_requests TEXT;

-- Add payment_method column
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Add payment_id column (for PayUmoney transaction ID)
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS payment_id TEXT;

-- Update total from total_amount if total is null
UPDATE public.orders 
SET total = total_amount 
WHERE total IS NULL AND total_amount IS NOT NULL;

-- Create index on payment_id
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);
