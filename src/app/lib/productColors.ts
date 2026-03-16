/**
 * Category to color mapping for product badges and UI elements
 * Uses Tailwind color names for consistency
 */

export const categoryColorMap: Record<string, { bg: string; text: string; badge: string }> = {
  // Flower types
  'roses': { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 border-red-200' },
  'marigolds': { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 border-amber-200' },
  'jasmine': { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 border-purple-200' },
  'tulips': { bg: 'bg-pink-50', text: 'text-pink-700', badge: 'bg-pink-100 border-pink-200' },
  'sunflowers': { bg: 'bg-yellow-50', text: 'text-yellow-700', badge: 'bg-yellow-100 border-yellow-200' },
  'lilies': { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 border-orange-200' },
  'chrysanthemum': { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 border-green-200' },
  'bundles': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 border-blue-200' },

  // Default
  'default': { bg: 'bg-gray-50', text: 'text-gray-700', badge: 'bg-gray-100 border-gray-200' },
};

export function getCategoryColor(category?: string) {
  if (!category) return categoryColorMap['default'];
  const normalized = category.toLowerCase();

  // Direct match
  if (categoryColorMap[normalized]) {
    return categoryColorMap[normalized];
  }

  // Partial match
  for (const [key, value] of Object.entries(categoryColorMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  return categoryColorMap['default'];
}

/**
 * Badge styles for product status (New, Best Seller, Sale)
 */
export const badgeStyles = {
  new: 'bg-blue-500 text-white',
  bestSeller: 'bg-red-500 text-white',
  sale: 'bg-orange-500 text-white',
  limited: 'bg-amber-500 text-white',
};

export type BadgeType = keyof typeof badgeStyles;
