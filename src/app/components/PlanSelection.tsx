import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { addWeeks, addMonths } from 'date-fns';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart, CartItem } from '@/app/context/cart';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  description?: string;
  category?: string;
}

export default function PlanSelection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('price');
    setProducts(data || []);
  };

  const handleOneTimePurchase = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url
    });
    alert(`${product.name} added to cart!`);
  };

  const handleSubscribe = async (product: Product, duration: 'week' | 'month') => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert('Please login first at /auth');
      setLoading(false);
      return;
    }

    const { data: wallet } = await supabase
      .from('user_wallets')
      .select('balance, id')
      .eq('user_id', user.id)
      .single();

    if (!wallet || wallet.balance < product.price) {
      alert('Insufficient wallet balance. Add money in Account section.');
      setLoading(false);
      return;
    }

    const startDate = new Date();
    const endDate = duration === 'week' ? addWeeks(startDate, 1) : addMonths(startDate, 1);

    await supabase.from('user_subscriptions').insert({
      user_id: user.id,
      plan_id: product.id,
      status: 'active',
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      next_billing_date: endDate.toISOString().split('T')[0]
    });

    await supabase
      .from('user_wallets')
      .update({ balance: wallet.balance - product.price })
      .eq('id', wallet.id);

    await supabase.from('wallet_transactions').insert({
      wallet_id: wallet.id,
      amount: product.price,
      type: 'debit',
      description: `Subscription: ${product.name} (${duration})`
    });

    alert(`Subscribed to ${product.name} for ${duration === 'week' ? '1 week' : '1 month'}!`);
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Our Flowers
          </span>
        </h1>
        <p className="text-gray-600">Buy once or subscribe and save</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id}>
            {product.image_url && (
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              {product.description && (
                <p className="text-sm text-gray-600">{product.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="onetime" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="onetime">One-time</TabsTrigger>
                  <TabsTrigger value="subscribe">Subscribe</TabsTrigger>
                </TabsList>
                <TabsContent value="onetime" className="space-y-3">
                  <p className="text-2xl font-bold">₹{product.price}</p>
                  <Button
                    onClick={() => handleOneTimePurchase(product)}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </TabsContent>
                <TabsContent value="subscribe" className="space-y-3">
                  <p className="text-2xl font-bold">₹{product.price}</p>
                  <Button
                    onClick={() => handleSubscribe(product, 'week')}
                    disabled={loading}
                    variant="outline"
                    className="w-full"
                  >
                    Subscribe - 1 Week
                  </Button>
                  <Button
                    onClick={() => handleSubscribe(product, 'month')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-600"
                  >
                    Subscribe - 1 Month
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
