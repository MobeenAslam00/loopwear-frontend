"use client"

import * as React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface CheckoutProps {
  productImage: string
  productTitle: string
  rentAmount: number
  onCheckout?: (paymentMethod: string) => Promise<void>
}

export function BuyNowCheckout({ productImage, productTitle, rentAmount, onCheckout }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = React.useState("cod")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const shippingCost = 0
  const subTotal = rentAmount + shippingCost

  const handleCheckout = async () => {
    try {
      setLoading(true)
      await onCheckout?.(paymentMethod)
      router.push("/order-summary")
    } catch (error) {
      console.error("Failed to process order:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Section - Calculate Shipping */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Calculate Shipping</h2>

          <div className="flex flex-col items-center">
            <div className="relative w-64 h-80 rounded-lg overflow-hidden shadow-md">
              <Image src={productImage || "/placeholder.svg"} alt={productTitle} fill className="object-cover" />
            </div>

            <div className="w-full mt-6 space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span>Rent:</span>
                <span className="font-medium">{rentAmount} PKR</span>
              </div>

              <div className="flex justify-between items-center text-lg">
                <span>Shipping:</span>
                <span className="font-medium">{shippingCost} PKR</span>
              </div>

              <div className="flex justify-between items-center text-lg pt-2 border-t">
                <span className="font-semibold">SubTotal:</span>
                <span className="font-semibold">{subTotal} PKR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Payment Method */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Select Payment Method</h2>

          <RadioGroup defaultValue="cod" value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
            <div
              className={cn(
                "flex items-center space-x-3 p-4 rounded-xl transition-colors",
                paymentMethod === "cod" ? "bg-[#FAF4EF]" : "hover:bg-gray-50",
              )}
            >
              <RadioGroupItem value="cod" id="cod" />
              <Label htmlFor="cod" className="flex-1 cursor-pointer">
                Cash On Delivery
              </Label>
            </div>

            <div
              className={cn(
                "flex items-center space-x-3 p-4 rounded-xl transition-colors",
                paymentMethod === "easypaisa" ? "bg-[#FAF4EF]" : "hover:bg-gray-50",
              )}
            >
              <RadioGroupItem value="easypaisa" id="easypaisa" />
              <Label htmlFor="easypaisa" className="flex-1 cursor-pointer">
                Easy Paisa/ Jazz Cash
              </Label>
            </div>

            <div
              className={cn(
                "flex items-center space-x-3 p-4 rounded-xl transition-colors",
                paymentMethod === "bank" ? "bg-[#FAF4EF]" : "hover:bg-gray-50",
              )}
            >
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank" className="flex-1 cursor-pointer">
                Bank Transfer
              </Label>
            </div>
          </RadioGroup>

          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-[#6E391D] hover:bg-[#542D18] rounded-2xl text-white py-6 text-lg"
          >
            {loading ? "Processing..." : "Checkout"}
          </Button>
        </div>
      </div>
    </div>
  )
}

