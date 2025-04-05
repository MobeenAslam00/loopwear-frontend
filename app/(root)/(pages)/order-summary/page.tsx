"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { NotificationModal } from "@/app/components/Modal/NotificationModal"

export default function OrderSummary() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleConfirmOrder = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <NotificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        heading="Order Confirmed"
        text="Your Order has been confirmed you can track your order."
      />

      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF4EF] p-4">
        <div className="w-full max-w-md bg-[#F1E4D19C] rounded-lg p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-center">Order Summary</h1>

          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20">
              <Image src="/placeholder.svg" alt="Product Image" fill className="object-cover rounded-md" />
            </div>
            <div className="flex-1">
              <p className="text-sm">Three piece non bridal festive wear</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>SubTotal:</span>
              <span>4500 PKR</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delivered On:</span>
              <span>25.Jan.2025</span>
            </div>
          </div>

          <Button
            onClick={handleConfirmOrder}
            className="w-full bg-[#632C0F] hover:bg-[#4A2109] text-white rounded-md py-2"
          >
            Confirm Order
          </Button>
        </div>
      </div>
    </>
  )
}

