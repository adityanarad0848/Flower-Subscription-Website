import { Star, ShoppingCart } from 'lucide-react';
import { CartItem } from '@/app/context/cart';
import { getCategoryColor, badgeStyles, BadgeType } from '@/app/lib/productColors';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  description?: string;
  badge?: BadgeType;
  salePrice?: number;
  onAddToCart: (item: CartItem) => void;
  onQuickView?: () => void;
}

export function ProductCard({
  id,
  name,
  price,
  imageUrl,
  category,
  rating = 4.5,
  reviewCount = 0,
  description,
  badge,
  salePrice,
  onAddToCart,
  onQuickView,
}: ProductCardProps) {
  const categoryColor = getCategoryColor(category);

  // Apply 30% discount if no sale price is provided
  const discountPercent = 30;
  const originalPrice = price;
  const displayPrice = originalPrice * (1 - discountPercent / 100);
  const isSale = true;

  const handleAddToCart = () => {
    const item: CartItem = {
      productId: id,
      name,
      price: displayPrice,
      quantity: 1,
      imageUrl,
      category,
      rating,
      description,
    };
    onAddToCart(item);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image Container - Smaller */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square h-48">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Discount Badge - 30% */}
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -30%
        </div>

        {/* Category Badge */}
        {category && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-semibold ${categoryColor.badge}`}>
            {category}
          </div>
        )}
      </div>

      {/* Content Container - Compact */}
      <div className="p-3 flex flex-col flex-grow">
        {/* Product Name - Smaller font */}
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 hover:text-orange-600 transition-colors">
          {name}
        </h3>

        {/* Description - Smaller */}
        {description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {description}
          </p>
        )}

        {/* Rating - Compact */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          {reviewCount > 0 && (
            <span className="text-xs text-gray-600">({reviewCount})</span>
          )}
        </div>

        {/* Price - Standard dark color with discount */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">₹{displayPrice.toFixed(2)}</span>
          {isSale && (
            <span className="text-xs text-gray-500 line-through">₹{originalPrice.toFixed(2)}</span>
          )}
        </div>

        {/* Buttons - Compact */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-2 px-2 rounded text-sm transition-all duration-200 flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add</span>
          </button>

          {onQuickView && (
            <button
              onClick={onQuickView}
              className="flex-1 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold py-2 px-2 rounded text-sm transition-colors duration-200"
            >
              View
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
