import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/cart";
import { ProductDetailDialog } from "./ProductDetailDialog";
import { supabase } from "../../lib/supabase";

export function Home() {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cardDuration, setCardDuration] = useState<Record<string, 'week' | 'month'>>({});
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const handleOneTimePurchase = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image_url
    });
    alert(`${product.name} added to cart!`);
  };

  const handleSubscribe = (product: any, duration: 'week' | 'month') => {
    const totalPrice = getSubscriptionPrice(product, duration);
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + (duration === 'week' ? 7 : 30));
    addToCart({
      productId: product.id,
      name: product.name,
      price: totalPrice,
      quantity: 1,
      imageUrl: product.image_url,
      subscription: {
        duration,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        isTrial: duration === 'week'
      }
    });
    navigate('/cart');
  };

  const getSubscriptionPrice = (product: any, duration: 'week' | 'month') => {
    if (duration === 'week') {
      return 0; // First week free
    }
    return product.price * 30 * 0.8; // Monthly with 20% discount
  };

  return (
    <div>
      {/* Products Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search flowers..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            )}
          </div>
          <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.filter((product) => {
              if (!search.trim()) return true;
              const q = search.trim().toLowerCase();
              return (
                product.name?.toLowerCase().includes(q) ||
                product.hindi_name?.toLowerCase().includes(q) ||
                product.description?.toLowerCase().includes(q)
              );
            }).map((product) => {
              const weeklyPrice = 0; // First week free
              const monthlyPrice = product.price * 30 * 0.8;
              return (
                <Card key={product.id} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold line-clamp-1">{product.name}</span>
                        {product.hindi_name && (
                          <span className="text-xs text-gray-400 block">{product.hindi_name}</span>
                        )}
                      </div>
                      <span className="text-xs text-yellow-500">★ {product.rating || 4.5}</span>
                    </div>
                    {product.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                    )}
                    {product.description && product.description.length > 80 && (
                      <button
                        className="text-xs text-orange-600 font-semibold"
                        onClick={() => { setSelectedProduct(product); setDetailDialogOpen(true); }}
                      >
                        Know More →
                      </button>
                    )}
                    <p className="text-xs text-gray-500">Weight: {product.weight}</p>
                    <Tabs defaultValue="onetime" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-7">
                        <TabsTrigger value="onetime" className="text-xs">One-time</TabsTrigger>
                        <TabsTrigger value="subscribe" className="text-xs">Subscribe</TabsTrigger>
                      </TabsList>
                      <div className="mt-2">
                        <TabsContent value="onetime" className="m-0 space-y-1.5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold text-orange-600">₹{product.price}</span>
                            <span className="text-xs text-gray-500">/day</span>
                          </div>
                          <Button
                            onClick={() => handleOneTimePurchase(product)}
                            size="sm"
                            className="w-full h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Add to Cart
                          </Button>
                        </TabsContent>
                        <TabsContent value="subscribe" className="m-0 space-y-1.5">
                          {(['week', 'month'] as const).map((d) => {
                            const selected = (cardDuration[product.id] ?? 'week') === d;
                            return (
                              <div
                                key={d}
                                onClick={() => setCardDuration(prev => ({ ...prev, [product.id]: d }))}
                                className={`flex justify-between items-center text-xs px-2 py-1.5 rounded cursor-pointer border transition-colors ${selected ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                              >
                                <span className={selected ? 'font-semibold text-orange-600' : 'text-gray-600'}>
                                  {d === 'week' ? 'Weekly' : 'Monthly'}
                                </span>
                                <span className={`font-bold ${selected ? 'text-orange-600' : 'text-green-600'}`}>
                                  {d === 'week' ? 'FREE trial' : `₹${monthlyPrice.toFixed(0)} (-20%)`}
                                </span>
                              </div>
                            );
                          })}
                          <Button
                            onClick={() => {
                              handleSubscribe(product, cardDuration[product.id] ?? 'week');
                            }}
                            size="sm"
                            className="w-full h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            Add to Cart
                          </Button>
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>
                </Card>
              );
            })}
          </div>
            {products.filter((product) => {
              if (!search.trim()) return true;
              const q = search.trim().toLowerCase();
              return (
                product.name?.toLowerCase().includes(q) ||
                product.hindi_name?.toLowerCase().includes(q) ||
                product.description?.toLowerCase().includes(q)
              );
            }).length === 0 && (
              <p className="text-center text-gray-500 text-sm py-8">No products found for "{search}"</p>
            )}
          </div>
        </div>
      </section>

      <ProductDetailDialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        product={selectedProduct}
        onAddToCart={() => {
          if (selectedProduct) {
            handleOneTimePurchase(selectedProduct);
            setDetailDialogOpen(false);
          }
        }}
        onSubscribe={(duration) => {
          if (selectedProduct) {
            handleSubscribe(selectedProduct, duration);
            setDetailDialogOpen(false);
          }
        }}
      />
    </div>
  );
}
