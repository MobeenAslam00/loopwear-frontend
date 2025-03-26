"use client"

import * as React from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { NotificationModal } from "@/app/components/Modal/NotificationModal"

const formSchema = z.object({
  dressName: z.string().min(1, "Dress name is required"),
  category: z.string().min(1, "Please select a category"),
  dressBrand: z.string().min(1, "Please select a dress brand"),
  dressPrice: z.string().min(1, "Price is required"),
  dressSize: z.string().min(1, "Please select a size"),
  dressListing: z.string().min(1, "Please select a listing category"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  dressDetails: z.string().min(10, "Please provide dress details"),
})

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

interface EditProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  onSuccess: () => void
}

export function EditProductModal({ isOpen, onClose, product, onSuccess }: EditProductModalProps) {
  const [loading, setLoading] = React.useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  // Set form values when product changes
  React.useEffect(() => {
    if (product) {
      setValue("dressName", product.productName)
      setValue("category", product.category)
      setValue("dressBrand", product.productBrand)
      setValue("dressPrice", product.productPrice.toString())
      setValue("dressSize", product.productSize)
      setValue("dressListing", product.productListing)

      // Format date for input
      const date = new Date(product.dateOfPurchase)
      const formattedDate = date.toISOString().split("T")[0]
      setValue("purchaseDate", formattedDate)

      setValue("dressDetails", product.productDetails)
    }
  }, [product, setValue])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!product) return

    try {
      setLoading(true)
      setError(null)

      // Get userId from localStorage
      const user = localStorage.getItem("user")
      const parsedData = JSON.parse(user)

      // Prepare data for API
      const productData = {
        userId: parsedData.userId,
        productName: data.dressName,
        productBrand: data.dressBrand,
        productPrice: Number.parseFloat(data.dressPrice),
        productSize: data.dressSize,
        productListing: data.dressListing,
        dateOfPurchase: new Date(data.purchaseDate).toISOString(),
        productDetails: data.dressDetails,
        category: data.category,
        images: product.images, // Keep existing images
      }

      // Send data to backend using axios
      const res = await axios.put(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/${product._id}`, productData)
      console.log("res", res)
      // Show success modal
      setIsSuccessModalOpen(true)

      // Call success callback
      onSuccess()

      // Close the edit modal after a delay
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error("Failed to update product", error)
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to update product")
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NotificationModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        heading="Success"
        text="Product updated successfully"
      />

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white p-6 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-center text-[#632C0F]">Edit Product</DialogTitle>
          </DialogHeader>

          <div className="my-4 h-px bg-gray-200"></div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Dress Name (changed from Dress Type) */}
              <div className="space-y-2">
                <label className="text-gray-600 block mb-1">Dress Name</label>
                <Input
                  placeholder="Enter Dress Name"
                  {...register("dressName")}
                  className="rounded-xl border-gray-200"
                />
                {errors.dressName && <p className="text-sm text-red-500">{errors.dressName.message}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-gray-600 block mb-1">Category</label>
                <select
                  {...register("category")}
                  className="w-full rounded-xl border-gray-200 border p-2 focus:outline-none focus:ring-2 focus:ring-[#632C0F] focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  <option value="Bridal">Bridal</option>
                  <option value="Party Wear">Party Wear</option>
                  <option value="Non-Bridal">Non-Bridal</option>
                </select>
                {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
              </div>

              {/* Dress Brand */}
              <div className="space-y-2">
                <label className="text-gray-600 block mb-1">Dress Brand</label>
                <Input
                  placeholder="Enter Brand Name"
                  {...register("dressBrand")}
                  className="rounded-xl border-gray-200"
                />
                {errors.dressBrand && <p className="text-sm text-red-500">{errors.dressBrand.message}</p>}
              </div>

              {/* Dress Price */}
              <div className="space-y-2">
                <label className="text-gray-600 block mb-1">Dress Price</label>
                <Input placeholder="In PKR" {...register("dressPrice")} className="rounded-xl border-gray-200" />
                {errors.dressPrice && <p className="text-sm text-red-500">{errors.dressPrice.message}</p>}
              </div>

              {/* Dress Size */}
              <div className="space-y-2">
                <label className="text-gray-600 block mb-1">Dress Size</label>
                <select
                  {...register("dressSize")}
                  className="w-full rounded-xl border-gray-200 border p-2 focus:outline-none focus:ring-2 focus:ring-[#632C0F] focus:border-transparent"
                >
                  <option value="">Select Size</option>
                  <option value="xs">XS</option>
                  <option value="s">S</option>
                  <option value="m">M</option>
                  <option value="l">L</option>
                  <option value="xl">XL</option>
                </select>
                {errors.dressSize && <p className="text-sm text-red-500">{errors.dressSize.message}</p>}
              </div>

              {/* Dress Listing */}
              <div className="space-y-2">
                <label className="text-gray-600 block mb-1">Dress Listing</label>
                <select
                  {...register("dressListing")}
                  className="w-full rounded-xl border-gray-200 border p-2 focus:outline-none focus:ring-2 focus:ring-[#632C0F] focus:border-transparent"
                >
                  <option value="">Select Dress listing category</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
                {errors.dressListing && <p className="text-sm text-red-500">{errors.dressListing.message}</p>}
              </div>

              {/* Date of Purchase */}
              <div className="space-y-2">
                <label className="text-gray-600 block mb-1">Date of Purchase</label>
                <div className="relative">
                  <Input type="date" {...register("purchaseDate")} className="rounded-xl border-gray-200" />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none h-5 w-5" />
                </div>
                {errors.purchaseDate && <p className="text-sm text-red-500">{errors.purchaseDate.message}</p>}
              </div>

              {/* Dress Details */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-gray-600 block mb-1">Dress Details</label>
                <Textarea
                  placeholder="Add dress details necessary to mention. Like, material of dress, stitching, fitting, need for adjustments or not etc."
                  {...register("dressDetails")}
                  className="rounded-xl border-gray-200 min-h-[120px]"
                />
                {errors.dressDetails && <p className="text-sm text-red-500">{errors.dressDetails.message}</p>}
              </div>

              {/* Dress Images (Read-only) */}
              {product && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-600 block mb-1">Dress Images (Cannot be changed)</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {product.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Product image ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - (product.images?.length || 0)) }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="aspect-square border border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                      >
                        <p className="text-gray-400 text-sm text-center px-2">No image</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">Images cannot be changed in edit mode</p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-8">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl px-6 py-2">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-[#632C0F] hover:bg-[#4A2108] rounded-xl px-6 py-2">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

