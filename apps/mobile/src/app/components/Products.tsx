import { useEffect,useState } from "react"
import { supabase } from "../../lib/supabase"
import { ProductCard } from "./ProductCard"
import { useCart, CartItem } from "@/app/context/cart"
import { Loader } from "lucide-react"
import { Button } from "./ui/button"

type Product = {
  id: string
  name: string
  price: number
  image_url?: string
  category?: string
  description?: string
  rating?: number
  review_count?: number
  badge?: string
  sale_price?: number
}

type SortOption = "newest" |"popular" | "price-low" | "price-high" | "rating"

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const { addToCart } = useCart()
  const [cartNotification, setCartNotification] = useState<string | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [products, selectedCategory, sortBy, minPrice, maxPrice])

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabase.from("products").select("*")
    if (data) {
      setProducts(data as Product[])
    }
    setLoading(false)
  }

  function applyFiltersAndSort() {
    let result = [...products]

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((p) =>
        p.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    }

    // Apply price filter
    result = result.filter((p) => {
      const price = p.sale_price || p.price
      return price >= minPrice && price <= maxPrice
    })

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price))
        break
      case "price-high":
        result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price))
        break
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case "newest":
      default:
        // Assume the API returns newest first, or could use created_at
        break
    }

    setFilteredProducts(result)
  }

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort()

  const handleAddToCart = (item: CartItem) => {
    addToCart(item)
    setCartNotification(`${item.name} added to cart!`)
    setTimeout(() => setCartNotification(null), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
            Our Premium Flowers
          </span>
        </h1>
        <p className="text-base text-gray-600">
          Handpicked fresh flowers for every occasion. 30% discount on all items!
        </p>
      </div>

      {/* Cart Notification */}
      {cartNotification && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg animate-pulse text-sm">
          {cartNotification}
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-base text-gray-600 mb-4">No products found matching your filters</p>
          <Button
            onClick={() => {
              setSelectedCategory("")
              setMinPrice(0)
              setMaxPrice(10000)
              setSortBy("newest")
            }}
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-xs text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{" "}
            <span className="font-bold text-gray-900">{products.length}</span> products
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.image_url}
                category={product.category}
                rating={product.rating || 4.5}
                reviewCount={product.review_count || 0}
                description={product.description}
                badge={(product.badge as any) || undefined}
                salePrice={product.sale_price}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
