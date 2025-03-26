"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Filter, Pencil, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import TopBanner from "@/app/components/global/top-banner"
import { SubHeader } from "@/app/components/global/sub-header"
import FooterBanner from "@/app/components/global/footer-banner"
import { FilterSheet } from "@/app/components/global/filter-sheet"
import { EditProductModal } from "../../components/edit-product-modal"

interface Product {
  _id: string
  productName: string
  productBrand: string
  productPrice: number
  productSize: string
  productListing: string
  dateOfPurchase: string
  productDetails: string
  category: string
  images: string[]
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const limit = 10

  useEffect(() => {
    fetchProducts()
  }, [page])

  const fetchProducts = async () => {
    try {
      const user:any = localStorage.getItem("user")
      const parsedUser = JSON.parse(user)
      if (!parsedUser.userId) throw new Error("User ID not found")

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/getAllProductsByUserId?userId=${parsedUser?.userId}&limit=${limit}&page=${page}`,
      )
 
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json() 
      console.log(data.products);
      setProducts(data.products || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Refresh products list
      fetchProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product")
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    fetchProducts()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6E7DB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#632C0F]"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#F6E7DB]">
      <TopBanner back={true} />
      {/* <SubHeader showSearch={true} /> */}

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onSuccess={handleEditSuccess}
      />

      <div className="px-4 md:px-8 lg:px-16 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-[#542D18] text-3xl md:text-4xl lg:text-[48px] font-semibold">My Products</h1>
          {/* <Button
            variant="ghost"
            className="flex items-center space-x-2 text-base md:text-lg hover:bg-transparent hover:text-[#542D18]"
            onClick={() => setShowFilters(true)}
          > */}
            {/* <span className="text-black">Filters</span> */}
            {/* <Filter className="h-5 w-5" /> */}
          {/* </Button> */}
        </div>

        {/* <FilterSheet open={showFilters} onOpenChange={setShowFilters} /> */}

        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.productName}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 bg-white/90 hover:bg-white/75 rounded-full">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(product._id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                    {product.productListing}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.productName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.productBrand}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-lg">PKR {product.productPrice.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{product.productSize}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-8 space-x-4">
          <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Previous
          </Button>
          <Button variant="outline" onClick={() => setPage((p) => p + 1)} disabled={products.length < limit}>
            Next
          </Button>
        </div>
      </div>

      <FooterBanner />
    </main>
  )
}

