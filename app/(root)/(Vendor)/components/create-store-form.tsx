"use client"

import * as React from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NotificationModal } from "@/app/components/Modal/NotificationModal"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  storeName: z.string().min(2, "Store name is required"),
  storeDescription: z.string().min(10, "Store description is required"),
  storeLogo: z.any().optional(),
  storeAddress: z.string().optional(),
  ownerName: z.string().min(2, "Owner name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  accountDetails: z.string().min(1, "Account details are required"),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
})

export function CreateStoreForm() {
  const [logoFile, setLogoFile] = React.useState<File | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch, 
    reset, 
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      
      let storeLogoUrl = "";
  
      if (logoFile) {
        const formData = new FormData();
        formData.append("file", logoFile);
        formData.append("upload_preset", "loopwear");
  
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/diml90c1y/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
  
        const cloudinaryData = await cloudinaryResponse.json();
        console.log("Cloudinary response:", cloudinaryData);
  
        if (cloudinaryData.secure_url) {
          storeLogoUrl = cloudinaryData.secure_url;
        } else {
          throw new Error("Failed to upload image to Cloudinary");
        }
      }
  
      const user = localStorage.getItem("user");  
      let parsedUser = JSON.parse(user);
      console.log('user', parsedUser);
  
      const storeData = {
        userId: parsedUser?.userId,
        storeName: data.storeName,
        storeDescription: data.storeDescription,
        storeAddress: data.storeAddress || "",
        ownerName: data.ownerName,
        email: data.email,
        phone: data.phone,
        accountDetails: `${data.bankName} - Account No: ${data.accountNumber}`,
        storeLogo: storeLogoUrl,
      };
  
      console.log("Store data to be sent:", storeData);
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_LOOP_SERVER}/store/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create store");
      }
  
      const result = await response.json();
      console.log("Store creation response:", result);
      if (result.store._id) { 
        parsedUser = {...parsedUser , storeId : result.store._id  , storeName : result.store.storeName , storeLogo:result.store.storeLogo} 
        localStorage.setItem("user", JSON.stringify(parsedUser));
        router.push('/vendor')
      }
      setIsModalOpen(true);
  
      // Clear form data
      setLogoFile(null);
      reset(); 
  
    } catch (error) {
      console.error("Failed to create store", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading="Success"
        text="Store created successfully!"
      />

      <div className="min-h-screen bg-[#F6E7DB] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-12">
            <Image src="/updatedLogo.png" alt="Loop Wear" width={240} height={100} className="mx-auto" />
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 relative">
            {/* Create Store Button */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2">
              <Button className="bg-[#632C0F] hover:bg-[#4A2108] px-8 py-6 text-lg rounded-xl font-medium">
                Create Store
              </Button>
            </div>

            {/* Welcome Text */}
            <div className="text-center mt-8 mb-12">
              <h2 className="text-xl mb-4">Welcome, Fill the following fields</h2>
              <div className="h-px bg-gray-200 max-w-2xl mx-auto"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Store Name */}
                <div className="space-y-2">
                  <label className="text-gray-600 block mb-1">Store Name</label>
                  <Input
                    placeholder="Enter Store Name"
                    {...register("storeName")}
                    className="rounded-xl border-gray-200"
                  />
                </div>

                {/* Store Description */}
                <div className="space-y-2">
                  <label className="text-gray-600 block mb-1">Store Description</label>
                  <Input
                    placeholder="Enter Store Details"
                    {...register("storeDescription")}
                    className="rounded-xl border-gray-200"
                  />
                </div>

                {/* Store Logo */}
                <div className="space-y-2">
                  <label className="text-gray-600 block mb-1">Store Logo</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="PNG, JPG File"
                      readOnly
                      value={logoFile?.name || ""}
                      className="rounded-xl border-gray-200 flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#90caf9] hover:bg-[#64b5f6] text-black rounded-xl px-6"
                    >
                      Upload
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        setLogoFile(file)
                        setValue("storeLogo", file)
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>

                {/* Store Address */}
                <div className="space-y-2">
                  <label className="text-gray-600 block mb-1">Store Address</label>
                  <Input placeholder="Optional" {...register("storeAddress")} className="rounded-xl border-gray-200" />
                </div>

                {/* Owner Name */}
                <div className="space-y-2">
                  <label className="text-gray-600 block mb-1">Owner Name</label>
                  <Input placeholder="Enter Name" {...register("ownerName")} className="rounded-xl border-gray-200" />
                </div>

                {/* Gmail Address */}
                <div className="space-y-2">
                  <label className="text-gray-600 block mb-1">Gmail Address</label>
                  <Input
                    type="email"
                    placeholder="Enter Gmail"
                    {...register("email")}
                    className="rounded-xl border-gray-200"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="text-gray-600 block mb-1">Phone no</label>
                  <Input placeholder="Contact Number" {...register("phone")} className="rounded-xl border-gray-200" />
                </div>

                {/* Account Details */}
                <div className="space-y-2">
                  <label className="text-gray-600 block mb-1">Account details</label>
                  <div className="space-y-2">
                    <select
                      {...register("bankName")}
                      className="w-full rounded-xl border-gray-200 border p-2 focus:outline-none focus:ring-2 focus:ring-[#632C0F] focus:border-transparent"
                      onChange={(e) => {
                        setValue("bankName", e.target.value)
                        // Update the combined account details whenever bank changes
                        const accNumber = watch("accountNumber") || ""
                        if (e.target.value) {
                          setValue("accountDetails", `${e.target.value} - Account No: ${accNumber}`)
                        }
                      }}
                    >
                      <option value="">Select Bank</option>
                      <option value="Habib Bank Limited (HBL)">Habib Bank Limited (HBL)</option>
                      <option value="National Bank of Pakistan (NBP)">National Bank of Pakistan (NBP)</option>
                      <option value="United Bank Limited (UBL)">United Bank Limited (UBL)</option>
                      <option value="MCB Bank Limited">MCB Bank Limited</option>
                      <option value="Allied Bank Limited (ABL)">Allied Bank Limited (ABL)</option>
                      <option value="Bank Alfalah">Bank Alfalah</option>
                      <option value="Meezan Bank">Meezan Bank</option>
                      <option value="Bank Al Habib">Bank Al Habib</option>
                      <option value="Faysal Bank">Faysal Bank</option>
                      <option value="Askari Bank">Askari Bank</option>
                      <option value="JS Bank">JS Bank</option>
                      <option value="Soneri Bank">Soneri Bank</option>
                      <option value="Bank of Punjab">Bank of Punjab</option>
                      <option value="Dubai Islamic Bank Pakistan">Dubai Islamic Bank Pakistan</option>
                      <option value="Sindh Bank">Sindh Bank</option>
                    </select>

                    <Input
                      placeholder="Enter Account Number"
                      {...register("accountNumber")}
                      className="rounded-xl border-gray-200"
                      onChange={(e) => {
                        setValue("accountNumber", e.target.value)
                        // Update the combined account details whenever account number changes
                        const bank = watch("bankName") || ""
                        if (bank) {
                          setValue("accountDetails", `${bank} - Account No: ${e.target.value}`)
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Checkbox */}
              <div className="flex items-start gap-2 mt-8">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1"
                  onChange={(e) => setValue("agreeToTerms", e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the terms and conditions in Lender&apos;s Policy
                </label>
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

