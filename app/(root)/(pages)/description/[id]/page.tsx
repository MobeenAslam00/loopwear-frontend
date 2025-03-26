"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import TopBanner from "@/app/components/global/top-banner"
import { ProductDetails } from "./component/product-detail"
import { SubHeader } from "@/app/components/global/sub-header"
import { ProductSlider } from "@/app/components/global/product-slider"
import FooterBanner from "@/app/components/global/footer-banner"
import { products } from "@/lib/data"
import { Loader2 } from "lucide-react"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Define the Product type
interface Product {
  _id: string 
  storeId : string
  name: string
  price: number
  description: string
  imageUrl: string
  category: string
  images?: string[]
  size?: string
  productDetails?: string
  productBrand?: string
  productListing?: string
  productName?: string
  productPrice?: number
}

export default function ProductDescriptionPage() {
  const params = useParams()
  const id = params?.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProductById() {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/${id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status}`)
        }

        const data = await response.json()
        console.log("product data", data)
        setProduct(data || null)
      } catch (error) {
        console.error("Error fetching product:", error)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProductById()
    }
  }, [id])

  const handleRentNow = async (formData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Form data:", formData)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF4EF]">
        <TopBanner back={true} />
        <SubHeader showSearch={true} />
        <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 animate-spin text-[#6E391D]" />
          <p className="mt-4 text-[#6E391D] font-medium">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF4EF]">
        <TopBanner back={true} />
        <SubHeader showSearch={true} />
        <div className="max-w-7xl mx-auto p-8 text-center">
          <h2 className="text-2xl text-[#462920] mb-4">Product not found</h2>
          <p className="text-[#6B4D3E]">The product you're looking for doesn't exist or has been removed.</p>
        </div>
        <FooterBanner />
      </div>
    )
  }

  // Transform the product data to match the expected format for ProductDetails
  const productData = {
    _id: product._id, 
    storeId: product.storeId,
    title: product.productName || product.name,
    images: product.images || [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl],
    price: product.productPrice || product.price,
    size: product.size || "Medium",
    description: product.productDetails || product.description,
    productBrand: product.productBrand || "Checking",
    productListing: product.productListing || "Rent",
  }

  return (
    <div className="min-h-screen bg-[#FAF4EF]">
      <TopBanner back={true} />
      <SubHeader showSearch={false} />
      <ProductDetails {...productData} onRentNow={handleRentNow} />
      {/* <ProductSlider products={products} /> */}
      <FooterBanner />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

