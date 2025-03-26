"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

// Define the Product type
interface Product {
  _id: string
  productName: string
  productPrice: number
  productBrand: string
  productListing: string
  productSize: string
  images: string[]
  category: string
}

// Define valid categories
const validCategories = ["Bridal", "Non-Bridal", "Party-Wear"]

export default function ProductsPage() {
  const params = useParams()
  const category = params?.category as string
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Format category for display
  const formattedCategory = category?.replace("-", " ") || ""

  useEffect(() => {
    async function fetchProducts() {
      try { 
        let cat = formattedCategory === "Non Bridal" ? "Non-Bridal" : formattedCategory;
        setLoading(true)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/getAllProducts?limit=10&page=1&category=${cat}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`)
        }

        const data = await response.json()
        console.log("data", data)
        setProducts(data.products || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchProducts()
    }
  }, [category])

  if (loading) {
    return (
      <div className="bg-[#F6E7DB] min-h-screen py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-64 bg-[#E5D6CA] animate-pulse rounded-md mx-auto mb-8"></div>
          <div className="h-4 w-full max-w-2xl bg-[#E5D6CA] animate-pulse rounded-md mx-auto mb-12"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative aspect-[3/4] bg-[#E5D6CA] animate-pulse"></div>
                <div className="p-4">
                  <div className="h-5 bg-[#E5D6CA] animate-pulse rounded-md mb-2"></div>
                  <div className="h-4 w-16 bg-[#E5D6CA] animate-pulse rounded-md"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F6E7DB] min-h-screen py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl text-[#462920] font-serif text-center mb-8">{formattedCategory}</h1>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl text-[#462920] mb-4">No products found</h2>
            <p className="text-[#6B4D3E]">Please check back later for our latest collection.</p>
          </div>
        ) : (
          <>
            <p className="text-center text-[#6B4D3E] mb-12 max-w-2xl mx-auto">
              Discover our exquisite collection of {formattedCategory.toLowerCase()} dresses, crafted with the finest
              materials and attention to detail.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <Link href={`/description/${product._id}`} key={product._id} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                    <div className="relative aspect-[3/4]">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.productName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium">
                        {product.productListing}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{product.productName}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.productBrand}</p>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-lg">PKR {product.productPrice?.toLocaleString() || '0'}</p>
                        <p className="text-sm text-gray-500">{product.productSize}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
