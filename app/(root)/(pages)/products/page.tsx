"use client"

import { useState, useEffect } from "react"
import TopBanner from "@/app/components/global/top-banner"
import { ClothingCard } from "../../../components/global/clothing-card"
import FooterBanner from "@/app/components/global/footer-banner"
import { Filter, Loader2 } from "lucide-react"
import { SubHeader } from "@/app/components/global/sub-header"
import RentersPolicy from "@/app/components/global/renter-policy"
import { Button } from "@/components/ui/button"
import { FilterSheet } from "@/app/components/global/filter-sheet"
import { RenterPolicyBanner } from "@/app/components/global/renter-policy-banner"
import { useSearchParams } from "next/navigation" 

interface Product {
  _id: string
  productName: string 
  productPrice: number
  images: string[]
  productListing: string
  category: string
  // Add other fields as needed
}

interface ProductResponse {
  products: Product[]
  totalProducts: number
  currentPage: number
  totalPages: number
}

interface Filters {
  categories: string[]
  maxPrice: number
}

export default function Home() {
  const search = useSearchParams()
  // const type = search.get("type") || "buy"
  const [showPolicy, setShowPolicy] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    maxPrice: 200000,
  })

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)

    try {
      // const productListing = type === "buy" ? "sale" : "rent"

      let url = `${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/getAllProducts?limit=10&page=1`
      if (filters.categories.length > 0) {
        const categoryQuery = filters.categories.map(encodeURIComponent).join(',');
        url += `&category=${categoryQuery}`;
      }
      

      if (filters.maxPrice < 200000) {
        url += `&max=${filters.maxPrice}`
      }

      const response = await fetch(url)
      console.log(response);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data: ProductResponse = await response.json()
      setProducts(data.products || [])
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  return (
    <main className="min-h-screen bg-[#F6E7DB]">
      <TopBanner back={true} />
      <SubHeader showSearch={false} />

      {showPolicy &&  (
        <div className="w-full bg-[#F6E7DB]">
          <RentersPolicy onClose={() => setShowPolicy(false)} />
        </div>
      )}

      <h1 className="text-[#542D18] text-center text-3xl md:text-4xl font-semibold mt-6">
        Products for Sale/Rent
      </h1>

      <div className="flex justify-between items-center px-4 md:px-16 mt-6">
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-lg md:text-xl hover:bg-transparent hover:text-[#542D18]"
          onClick={() => setShowFilters(true)}
        >
          <span className="text-black">Filters</span>
          <Filter className="h-5 w-5" />
        </Button>

        {(filters.categories.length > 0 || filters.maxPrice < 200000) && (
          <div className="text-sm text-gray-600">
            {filters.categories.length > 0 && <span className="mr-2">Categories: {filters.categories.join(", ")}</span>}
            {filters.maxPrice < 200000 && <span>Max Price: Rs. {filters.maxPrice.toLocaleString()}</span>}
          </div>
        )}
      </div>

      <FilterSheet open={showFilters} onOpenChange={setShowFilters} onApplyFilters={handleApplyFilters} />

      <hr className="mx-auto my-4 w-11/12" />

      <div className="bg-[#F6E7DB] px-4 md:px-16 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-[#542D18] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchProducts} className="bg-[#6E391D] hover:bg-[#542D18]">
              Try Again
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#542D18] text-lg mb-4">No products found</p>
            <Button
              onClick={() => setFilters({ categories: [], maxPrice: 200000 })}
              className="bg-[#6E391D] hover:bg-[#542D18]"
            >
              Clear Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ClothingCard
                key={product._id}
                productId={product._id} 
                category={product.category}
                imageUrl={
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : "https://zuriador.com/cdn/shop/files/zuria-dor-dusty-beige-bridal-dress-2.jpg?v=1724221215&width=1200"
                }
                title={product.productName}
                price={product.productPrice}
                action={product.productListing}
              />
            ))}
          </div>
        )}
      </div>

      <RenterPolicyBanner />
      <FooterBanner />
    </main>
  )
}

