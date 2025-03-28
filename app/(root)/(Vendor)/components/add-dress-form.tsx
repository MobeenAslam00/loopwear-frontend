"use client"

import * as React from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Plus, X } from "lucide-react"
import { NotificationModal } from "@/app/components/Modal/NotificationModal"

const MAX_FILES = 4

const formSchema = z.object({
  dressName: z.string().min(1, "Dress name is required"),
  category: z.string().min(1, "Please select a category"),
  dressBrand: z.string().min(1, "Please select a dress brand"),
  dressPrice: z.string().min(1, "Price is required"),
  dressSize: z.string().min(1, "Please select a size"),
  dressListing: z.string().min(1, "Please select a listing category"),
  dressDetails: z.string().min(10, "Please provide dress details"),
})

export function AddDressForm() {
  const [loading, setLoading] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || [])
    const updatedFiles = [...selectedFiles, ...newFiles]

    if (updatedFiles.length > MAX_FILES) {
      setError(`You can only upload up to ${MAX_FILES} images`)
      return
    }

    setError(null)
    setSelectedFiles(updatedFiles)

    // Create preview URLs for new files and add to existing previews
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviewUrls])
  }

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles]
    newFiles.splice(index, 1)
    setSelectedFiles(newFiles)

    URL.revokeObjectURL(previewUrls[index])
    const newPreviewUrls = [...previewUrls]
    newPreviewUrls.splice(index, 1)
    setPreviewUrls(newPreviewUrls)
  }

  // Clean up preview URLs when component unmounts
  React.useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)

      // Upload images to Cloudinary
      const imageUrls: string[] = []

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("upload_preset", process.env.NEXT_PUBLIC_PRESET_NAME || "loopwear")

          const cloudinaryResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME || "diml90c1y"}/image/upload`,
            {
              method: "POST",
              body: formData,
            },
          )

          const cloudinaryData = await cloudinaryResponse.json()
          console.log("Cloudinary response:", cloudinaryData)

          if (cloudinaryData.secure_url) {
            imageUrls.push(cloudinaryData.secure_url)
          } else {
            throw new Error("Failed to upload image to Cloudinary")
          }
        }
      }

      // Get userId from localStorage
      const user = localStorage.getItem("user")
      const parsedData = JSON.parse(user)

      // Prepare data for API
      const productData = {
        userId: parsedData.userId, 
        storeId : parsedData.storeId,
        productName: data.dressName,
        productBrand: data.dressBrand,
        productPrice: Number.parseFloat(data.dressPrice),
        productSize: data.dressSize,
        productListing: data.dressListing,
        productDetails: data.dressDetails,
        category: data.category,
        images: imageUrls,
      }

      console.log("Product data to be sent:", productData)

      // Send data to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/product/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add product")
      }

      const result = await response.json()
      console.log("Product addition response:", result)

      // Reset form and clear images
      reset()
      setSelectedFiles([])
      setPreviewUrls([])

      // Show success modal
      setIsModalOpen(true)
    } catch (error) {
      console.error("Failed to add dress", error)
      setError(error instanceof Error ? error.message : "Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading="Success"
        text="Dress added to the Product list"
      />

      <div className="min-h-screen bg-[#F6E7DB] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-12">
            <Image src="/updatedLogo.png" alt="Loop Wear" width={240} height={100} className="mx-auto" />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 relative">
            {/* Add Dress Button */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <Button className="bg-[#632C0F] hover:bg-[#4A2108] px-8 py-6 text-lg rounded-xl font-medium">
                Add Dress
              </Button>
            </div>

            {/* Welcome Text */}
            <div className="text-center mt-8 mb-12">
              <h2 className="text-xl mb-4">Welcome, Fill the following fields</h2>
              <div className="h-px bg-gray-200 max-w-2xl mx-auto"></div>
            </div>

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

                {/* Dress Images */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-600 block mb-1">Dress Images</label>

                  {/* Image Preview Boxes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
                      >
                        {index < previewUrls.length ? (
                          <>
                            <Image
                              src={previewUrls[index] || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-full flex items-center justify-center"
                          >
                            <Plus className="h-8 w-8 text-gray-400" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <p className="text-sm text-gray-500">Maximum 4 images, 5MB per image.</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-[#632C0F] hover:bg-[#4A2108] px-8 py-6 text-lg rounded-xl font-medium"
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

