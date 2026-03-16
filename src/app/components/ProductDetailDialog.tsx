import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ProductDetailDialogProps {
  open: boolean;
  onClose: () => void;
  product: any;
  onAddToCart: () => void;
  onSubscribe: (duration: 'week' | 'month') => void;
}

export function ProductDetailDialog({
  open,
  onClose,
  product,
  onAddToCart,
  onSubscribe,
}: ProductDetailDialogProps) {
  if (!product) return null;

  const monthlyPrice = product.price * 30 * 0.8;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg border">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                {product.badge}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xl">★</span>
              <span className="font-bold text-lg">{product.rating || 4.5}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-600">Weight: {product.weight}</span>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2 text-gray-900">About this product</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t pt-6">
            <Tabs defaultValue="onetime" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100">
                <TabsTrigger value="onetime" className="font-semibold data-[state=active]:bg-white">One-time Purchase</TabsTrigger>
                <TabsTrigger value="subscribe" className="font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">Subscribe & Save</TabsTrigger>
              </TabsList>
              
              <TabsContent value="onetime" className="space-y-4 mt-4">
                <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200">
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-orange-600">₹{product.price}</span>
                    <span className="text-gray-600 text-lg ml-2">/day</span>
                  </div>
                  <Button
                    onClick={onAddToCart}
                    className="w-full bg-orange-600 hover:bg-orange-700 h-12 text-base font-semibold"
                  >
                    Add to Cart
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="subscribe" className="space-y-4 mt-4">
                <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-lg border-2 border-orange-200 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <div>
                        <span className="font-semibold text-base">Weekly Subscription</span>
                        <span className="block text-sm text-green-600 font-semibold mt-1">🎉 First Week FREE Trial</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                      <div>
                        <span className="font-semibold text-base">Monthly Subscription</span>
                        <span className="block text-sm text-green-600 font-semibold mt-1">💰 Save 20%</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">₹{monthlyPrice.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={() => onSubscribe('week')}
                      variant="outline"
                      className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 h-12 font-semibold text-base"
                    >
                      Start FREE Trial - 1 Week
                    </Button>
                    <Button
                      onClick={() => onSubscribe('month')}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 h-12 font-semibold text-base shadow-md"
                    >
                      Subscribe Monthly (Best Value)
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
