import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzytzztohlvjwdsfhoua.supabase.co';
const supabaseKey = 'sb_publishable_UGOMx9DGN9ceszOVP8veKA_5O5Bbncu';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Adding missing columns to orders table...');

  const queries = [
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS postal_code TEXT`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2)`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS handling_fee DECIMAL(10, 2) DEFAULT 0`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount DECIMAL(10, 2) DEFAULT 0`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total DECIMAL(10, 2)`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS special_requests TEXT`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT`,
    `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id TEXT`,
    `UPDATE public.orders SET total = total_amount WHERE total IS NULL AND total_amount IS NOT NULL`,
    `CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id)`
  ];

  for (const query of queries) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      if (error) {
        console.error('Error executing query:', query);
        console.error(error);
      } else {
        console.log('✓ Executed:', query.substring(0, 60) + '...');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  console.log('Migration complete!');
}

runMigration();
